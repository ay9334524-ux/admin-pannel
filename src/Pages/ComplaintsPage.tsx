import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Complaint {
  _id: string;
  bookingId: { bookingId: string };
  userId: { name: string; email: string; phone: string };
  mechanicId: { name: string; ratingAverage: number };
  serviceId: { name: string };
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  adminNotes?: string;
  resolution?: string;
  refundAmount?: number;
  createdAt: string;
  resolvedAt?: string;
}

interface Stats {
  total: number;
  open: number;
  inReview: number;
  resolved: number;
  rejected: number;
}

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    loadData();
  }, [statusFilter, severityFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (severityFilter) params.append('severity', severityFilter);

      const response = await axios.get(
        `${API_URL}/complaints/admin/all?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComplaints(response.data.data.complaints);
      setStats(response.data.data.stats);
    } catch (err) {
      console.error('Error loading complaints:', err);
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async (complaintId: string) => {
    if (!status) {
      setError('Please select a status');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const updateData: any = { status };
      if (resolution) updateData.resolution = resolution;
      if (refundAmount) updateData.refundAmount = parseFloat(refundAmount);
      if (adminNotes) updateData.adminNotes = adminNotes;

      await axios.put(
        `${API_URL}/complaints/admin/${complaintId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(`Complaint updated to ${status}`);
      setSelectedComplaint(null);
      setStatus('');
      setResolution('');
      setRefundAmount('');
      setAdminNotes('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update complaint');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'LOW':
        return 'bg-green-50 text-green-600 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'IN_REVIEW':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'QUALITY_ISSUE':
        return '⚙️';
      case 'BEHAVIOR':
        return '👤';
      case 'PRICING':
        return '💰';
      case 'TIME_ISSUE':
        return '⏱️';
      case 'OTHER':
        return '📋';
      default:
        return '📝';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Complaints</h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-50 border-blue-200' },
            { label: 'Open', value: stats.open, color: 'bg-red-50 border-red-200' },
            { label: 'In Review', value: stats.inReview, color: 'bg-yellow-50 border-yellow-200' },
            { label: 'Resolved', value: stats.resolved, color: 'bg-green-50 border-green-200' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-gray-50 border-gray-200' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${stat.color}`}
            >
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Alert Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-50 text-green-600 p-4 rounded-lg border border-green-200"
        >
          {success}
        </motion.div>
      )}

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No complaints found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Booking ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Severity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono">{complaint.bookingId?.bookingId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{complaint.userId?.name}</div>
                      <div className="text-gray-500 text-xs">{complaint.userId?.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium line-clamp-1">{complaint.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-lg">{getCategoryIcon(complaint.category)}</span> {complaint.category}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(complaint.severity)}`}>
                        {complaint.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setStatus(complaint.status);
                          setResolution(complaint.resolution || '');
                          setRefundAmount(complaint.refundAmount?.toString() || '');
                          setAdminNotes(complaint.adminNotes || '');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedComplaint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedComplaint(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedComplaint.title}</h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="font-medium">{selectedComplaint.userId?.name}</p>
                  <p className="text-sm text-gray-600">{selectedComplaint.userId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mechanic</p>
                  <p className="font-medium">{selectedComplaint.mechanicId?.name}</p>
                  <p className="text-sm text-gray-600">⭐ {selectedComplaint.mechanicId?.ratingAverage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Severity</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getSeverityColor(selectedComplaint.severity)}`}>
                    {selectedComplaint.severity}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="mt-2 bg-gray-50 p-3 rounded">{selectedComplaint.description}</p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {status === 'RESOLVED' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Describe how the complaint was resolved..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount (₹)</label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateComplaint(selectedComplaint._id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ComplaintsPage;
