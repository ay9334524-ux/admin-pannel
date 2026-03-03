import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Star, MessageSquare } from 'lucide-react';

interface BookingRating {
  _id: string;
  bookingId: string;
  rating: number;
  review?: string;
  ratedAt?: string;
  status: string;
  completedAt?: string;
  createdAt: string;
  userId: { _id: string; name: string; email: string; phoneNumber?: string; avatar?: string };
  mechanicId: { _id: string; name: string; email: string; phoneNumber?: string; avatar?: string };
  serviceId: { _id: string; name: string; categoryName?: string; icon?: string };
  serviceSnapshot?: { name: string; categoryName: string };
}

interface RatingStats {
  totalRatings: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

const ReviewsPage = () => {
  const [ratings, setRatings] = useState<BookingRating[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    totalRatings: 0, averageRating: 0,
    fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState('ratedAt');
  const [order, setOrder] = useState('-1');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState<BookingRating | null>(null);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const getHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = { page, limit: 15, sortBy, order };
      if (ratingFilter) params.rating = ratingFilter;

      const response = await axios.get(
        `${API_URL}/reviews/admin/booking-ratings`,
        { headers: getHeaders(), params }
      );

      const data = response.data.data;
      setRatings(data.ratings);
      setStats(data.stats);
      setTotalPages(data.pagination.pages);
    } catch (err: any) {
      console.error('Error loading ratings:', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [page, ratingFilter, sortBy, order]);

  const renderStars = (rating: number, size: string = 'w-4 h-4') => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const getRatingColor = (r: number) => {
    if (r >= 4) return 'text-green-600 bg-green-50';
    if (r === 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRatingBarWidth = (count: number) => {
    if (stats.totalRatings === 0) return '0%';
    return `${(count / stats.totalRatings) * 100}%`;
  };

  if (loading && ratings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
          <p className="text-gray-600">Real customer ratings and feedback from completed bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Average Rating Card */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || '0.0'}</p>
                <p className="text-xs text-gray-400">{stats.totalRatings} total ratings</p>
              </div>
            </div>
          </motion.div>

          {/* Rating Distribution Card */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-1 md:col-span-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">Rating Distribution</p>
            <div className="space-y-2">
              {[
                { stars: 5, count: stats.fiveStar },
                { stars: 4, count: stats.fourStar },
                { stars: 3, count: stats.threeStar },
                { stars: 2, count: stats.twoStar },
                { stars: 1, count: stats.oneStar },
              ].map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{stars} star</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stars >= 4 ? 'bg-green-400' : stars === 3 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: getRatingBarWidth(count) }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="1">⭐ 1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ratedAt">Date Rated</option>
                <option value="rating">Rating</option>
                <option value="completedAt">Completed Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={order}
                onChange={(e) => { setOrder(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="-1">Newest First</option>
                <option value="1">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No ratings found</p>
              <p className="text-gray-400 text-sm mt-1">Ratings will appear here when customers rate completed services</p>
            </div>
          ) : (
            ratings.map((booking) => (
              <motion.div
                key={booking._id}
                whileHover={{ scale: 1.005 }}
                onClick={() => setSelectedRating(booking)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Rating Badge */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${getRatingColor(booking.rating)}`}>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{booking.rating}</p>
                      <p className="text-[10px] font-medium">/ 5</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(booking.rating)}
                      <span className="text-sm text-gray-400">#{booking.bookingId}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-400">Customer</p>
                        <p className="text-sm font-semibold text-gray-800">{booking.userId?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Mechanic</p>
                        <p className="text-sm font-semibold text-gray-800">{booking.mechanicId?.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Service</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {booking.serviceSnapshot?.name || booking.serviceId?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {booking.review && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">Customer Feedback</p>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{booking.review}"</p>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Rated on</p>
                    <p className="text-sm font-medium text-gray-600">
                      {booking.ratedAt
                        ? new Date(booking.ratedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : new Date(booking.completedAt || booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} ({stats.totalRatings} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedRating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedRating(null)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Booking #{selectedRating.bookingId}</h2>
                  <p className="text-sm text-gray-500">Rating Details</p>
                </div>
                <button
                  onClick={() => setSelectedRating(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${getRatingColor(selectedRating.rating)}`}>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{selectedRating.rating}</p>
                    <p className="text-xs font-medium">/ 5</p>
                  </div>
                </div>
                <div>
                  {renderStars(selectedRating.rating, 'w-6 h-6')}
                  <p className="text-sm text-gray-500 mt-1">
                    Rated on {selectedRating.ratedAt
                      ? new Date(selectedRating.ratedAt).toLocaleString('en-IN')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {/* Feedback */}
              {selectedRating.review ? (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Customer Feedback</p>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-gray-800 italic">"{selectedRating.review}"</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <p className="text-sm text-gray-400 italic">No written feedback provided</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Customer</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedRating.userId?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{selectedRating.userId?.email || ''}</p>
                    <p className="text-xs text-gray-500">{selectedRating.userId?.phoneNumber || ''}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Mechanic</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedRating.mechanicId?.fullName || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{selectedRating.mechanicId?.email || ''}</p>
                    <p className="text-xs text-gray-500">{selectedRating.mechanicId?.phone || ''}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Service</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedRating.serviceSnapshot?.name || selectedRating.serviceId?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedRating.serviceSnapshot?.categoryName || selectedRating.serviceId?.categoryName || ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Booking Status</p>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {selectedRating.status}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Completed At</p>
                    <p className="text-sm text-gray-700">
                      {selectedRating.completedAt
                        ? new Date(selectedRating.completedAt).toLocaleString('en-IN')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ReviewsPage;
