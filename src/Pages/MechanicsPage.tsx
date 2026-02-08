import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mechanicsApi } from '../utils/api';

interface Mechanic {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  isOnline: boolean;
  isAvailable: boolean;
  vehicleTypes: string[];
  rating?: number;
  totalRatings?: number;
  totalEarnings?: number;
  completedJobs?: number;
  profileImageUrl?: string;
  createdAt: string;
}

const MechanicsPage = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchMechanics();
  }, [page, statusFilter]);

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: { page: number; limit: number; status?: string; search?: string } = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const response = await mechanicsApi.getAll(params);
      setMechanics(response.mechanics || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mechanics');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMechanics();
  };

  const handleUpdateStatus = async (mechanicId: string, newStatus: string) => {
    try {
      setActionLoading(mechanicId);
      await mechanicsApi.updateStatus(mechanicId, newStatus);
      setMechanics(mechanics.map(m => m._id === mechanicId ? { ...m, status: newStatus as Mechanic['status'] } : m));
    } catch (err: any) {
      alert(err.message || 'Failed to update mechanic status');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge-success">Approved</span>;
      case 'PENDING':
        return <span className="badge badge-warning">Pending</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Rejected</span>;
      case 'SUSPENDED':
        return <span className="badge badge-gray">Suspended</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mechanics Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all registered mechanics</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3">
            <p className="text-2xl font-bold text-white">{mechanics.length}</p>
            <p className="text-xs text-gray-400">Total Mechanics</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </motion.button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchMechanics} className="text-red-300 underline mt-2 text-sm">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : mechanics.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
          <p className="text-gray-400">No mechanics found</p>
        </div>
      ) : (
        <>
          {/* Mechanics Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Mechanic</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Phone</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Vehicle Types</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Rating</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Joined</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {mechanics.map((mechanic) => (
                    <tr key={mechanic._id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                              {mechanic.profileImageUrl ? (
                                <img src={mechanic.profileImageUrl} alt={mechanic.name} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <span className="text-white font-medium">{mechanic.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            {/* Online indicator */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-800 ${mechanic.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{mechanic.name}</p>
                            <p className="text-xs text-gray-500">
                              {mechanic.completedJobs || 0} jobs completed
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-300">{mechanic.phone}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {mechanic.vehicleTypes?.map((type) => (
                            <span key={type} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">{getStatusBadge(mechanic.status)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-white">{mechanic.rating?.toFixed(1) || 'N/A'}</span>
                          {mechanic.totalRatings && (
                            <span className="text-xs text-gray-500">({mechanic.totalRatings})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-400">{formatDate(mechanic.createdAt)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-2">
                          {mechanic.status === 'PENDING' && (
                            <>
                              <motion.button
                                onClick={() => handleUpdateStatus(mechanic._id, 'APPROVED')}
                                disabled={actionLoading === mechanic._id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20 disabled:opacity-50"
                              >
                                Approve
                              </motion.button>
                              <motion.button
                                onClick={() => handleUpdateStatus(mechanic._id, 'REJECTED')}
                                disabled={actionLoading === mechanic._id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 disabled:opacity-50"
                              >
                                Reject
                              </motion.button>
                            </>
                          )}
                          {mechanic.status === 'APPROVED' && (
                            <motion.button
                              onClick={() => handleUpdateStatus(mechanic._id, 'SUSPENDED')}
                              disabled={actionLoading === mechanic._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 disabled:opacity-50"
                            >
                              Suspend
                            </motion.button>
                          )}
                          {mechanic.status === 'SUSPENDED' && (
                            <motion.button
                              onClick={() => handleUpdateStatus(mechanic._id, 'APPROVED')}
                              disabled={actionLoading === mechanic._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20 disabled:opacity-50"
                            >
                              Reactivate
                            </motion.button>
                          )}
                          {mechanic.status === 'REJECTED' && (
                            <motion.button
                              onClick={() => handleUpdateStatus(mechanic._id, 'APPROVED')}
                              disabled={actionLoading === mechanic._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20 disabled:opacity-50"
                            >
                              Approve
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-400 px-4">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MechanicsPage;
