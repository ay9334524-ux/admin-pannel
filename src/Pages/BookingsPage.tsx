import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { bookingsApi } from '../utils/api';

interface Booking {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    name: string;
    phone: string;
  };
  mechanicId?: {
    _id: string;
    name: string;
    phone: string;
  };
  serviceSnapshot: {
    name: string;
    categoryName?: string;
  };
  status: string;
  pricing: {
    totalAmount: number;
    basePrice: number;
  };
  paymentMethod: string;
  paymentStatus?: string;
  location: {
    address: string;
  };
  createdAt: string;
  completedAt?: string;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      
      const response = await bookingsApi.getAll(params);
      setBookings(response.bookings || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">Completed</span>;
      case 'IN_PROGRESS':
      case 'EN_ROUTE':
      case 'ARRIVED':
        return <span className="badge badge-info">In Progress</span>;
      case 'ACCEPTED':
      case 'ASSIGNED':
        return <span className="badge badge-warning">Assigned</span>;
      case 'PENDING':
      case 'SEARCHING':
        return <span className="badge badge-warning">Pending</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      case 'EXPIRED':
        return <span className="badge badge-gray">Expired</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getPaymentBadge = (method: string, status?: string) => {
    if (status === 'COMPLETED' || status === 'PAID') {
      return <span className="badge badge-success">{method} - Paid</span>;
    }
    if (status === 'FAILED') {
      return <span className="badge badge-danger">{method} - Failed</span>;
    }
    return <span className="badge badge-gray">{method}</span>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 lg:p-8 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-lg shadow-gray-200/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="SEARCHING">Searching</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="ARRIVED">Arrived</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <motion.button
            onClick={fetchBookings}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
          >
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchBookings} className="text-red-500 underline mt-2 text-sm font-medium">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg shadow-gray-200/50">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <p className="text-gray-500 font-medium">No bookings found</p>
        </div>
      ) : (
        <>
          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Booking ID</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">User</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Mechanic</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Service</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Payment</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-blue-600 font-medium">{booking.bookingId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{booking.userId?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{booking.userId?.phone || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.mechanicId ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{booking.mechanicId.name}</p>
                            <p className="text-xs text-gray-500">{booking.mechanicId.phone}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{booking.serviceSnapshot?.name || '-'}</p>
                          {booking.serviceSnapshot?.categoryName && (
                            <p className="text-xs text-gray-500">{booking.serviceSnapshot.categoryName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(booking.pricing?.totalAmount || 0)}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                      <td className="px-6 py-4">{getPaymentBadge(booking.paymentMethod, booking.paymentStatus)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(booking.createdAt)}</td>
                      <td className="px-6 py-4">
                        <motion.button
                          onClick={() => setSelectedBooking(booking)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-100"
                        >
                          View
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-gray-600 px-4 font-medium">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Booking ID</span>
                <span className="text-gray-900 font-mono font-medium">{selectedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Service</span>
                <span className="text-gray-900">{selectedBooking.serviceSnapshot?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-gray-900 font-semibold">{formatCurrency(selectedBooking.pricing?.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-900">{selectedBooking.paymentMethod}</span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">User</h3>
                <p className="text-gray-900 font-medium">{selectedBooking.userId?.name}</p>
                <p className="text-gray-500 text-sm">{selectedBooking.userId?.phone}</p>
              </div>
              {selectedBooking.mechanicId && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Mechanic</h3>
                  <p className="text-gray-900 font-medium">{selectedBooking.mechanicId.name}</p>
                  <p className="text-gray-500 text-sm">{selectedBooking.mechanicId.phone}</p>
                </div>
              )}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Location</h3>
                <p className="text-gray-900 text-sm">{selectedBooking.location?.address || 'N/A'}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Created</h3>
                <p className="text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
