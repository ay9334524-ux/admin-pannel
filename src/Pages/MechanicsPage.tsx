import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mechanicsApi } from '../utils/api';

interface BanInfo {
  isBanned: boolean;
  banType?: 'PERMANENT' | 'TEMPORARY';
  banReason?: string;
  bannedAt?: string;
  banExpiresAt?: string;
}

interface Mechanic {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'BANNED' | 'ACTIVE';
  isOnline: boolean;
  isAvailable: boolean;
  vehicleTypes: string[];
  rating?: number;
  totalRatings?: number;
  totalEarnings?: number;
  completedJobs?: number;
  profileImageUrl?: string;
  createdAt: string;
  banInfo?: BanInfo;
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
  
  // Ban modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [banType, setBanType] = useState<'PERMANENT' | 'TEMPORARY'>('TEMPORARY');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState(7);
  const [banLoading, setBanLoading] = useState(false);

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

  const openBanModal = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    setBanType('TEMPORARY');
    setBanReason('');
    setBanDuration(7);
    setShowBanModal(true);
  };

  const handleBanMechanic = async () => {
    if (!selectedMechanic || !banReason.trim()) {
      alert('Please provide a reason for the ban');
      return;
    }

    try {
      setBanLoading(true);
      await mechanicsApi.ban(selectedMechanic._id, {
        banType,
        reason: banReason,
        duration: banType === 'TEMPORARY' ? banDuration : undefined,
      });
      setMechanics(mechanics.map(m => 
        m._id === selectedMechanic._id 
          ? { ...m, status: 'BANNED' as const, banInfo: { isBanned: true, banType, banReason } } 
          : m
      ));
      setShowBanModal(false);
      setSelectedMechanic(null);
    } catch (err: any) {
      alert(err.message || 'Failed to ban mechanic');
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnbanMechanic = async (mechanicId: string) => {
    try {
      setActionLoading(mechanicId);
      await mechanicsApi.unban(mechanicId, { reason: 'Unbanned by admin' });
      setMechanics(mechanics.map(m => 
        m._id === mechanicId 
          ? { ...m, status: 'ACTIVE' as const, banInfo: { isBanned: false } } 
          : m
      ));
    } catch (err: any) {
      alert(err.message || 'Failed to unban mechanic');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (mechanic: Mechanic) => {
    // Check for ban first
    if (mechanic.banInfo?.isBanned || mechanic.status === 'BANNED') {
      if (mechanic.banInfo?.banType === 'PERMANENT') {
        return (
          <span className="badge badge-danger" title={mechanic.banInfo.banReason}>
            🚫 Permanent Ban
          </span>
        );
      } else if (mechanic.banInfo?.banType === 'TEMPORARY' && mechanic.banInfo.banExpiresAt) {
        const expiresAt = new Date(mechanic.banInfo.banExpiresAt);
        const now = new Date();
        const remainingDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <span className="badge badge-warning" title={`${mechanic.banInfo.banReason} - Expires in ${remainingDays} days`}>
            ⏳ Temp Ban ({remainingDays}d)
          </span>
        );
      }
      return <span className="badge badge-danger">🚫 Banned</span>;
    }

    switch (mechanic.status) {
      case 'APPROVED':
      case 'ACTIVE':
        return <span className="badge badge-success">Approved</span>;
      case 'PENDING':
        return <span className="badge badge-warning">Pending</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Rejected</span>;
      case 'SUSPENDED':
        return <span className="badge badge-gray">Suspended</span>;
      default:
        return <span className="badge badge-gray">{mechanic.status}</span>;
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
    <div className="p-4 lg:p-8 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mechanics Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered mechanics</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-lg shadow-gray-200/50">
            <p className="text-2xl font-bold text-gray-900">{mechanics.length}</p>
            <p className="text-xs text-gray-500 font-medium">Total Mechanics</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-lg shadow-gray-200/50">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 focus:bg-white transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
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
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
          >
            Search
          </motion.button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchMechanics} className="text-red-500 underline mt-2 text-sm font-medium">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : mechanics.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg shadow-gray-200/50">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔧</span>
          </div>
          <p className="text-gray-500 font-medium">No mechanics found</p>
        </div>
      ) : (
        <>
          {/* Mechanics Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Mechanic</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Phone</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Vehicle Types</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Rating</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Joined</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mechanics.map((mechanic) => (
                    <tr key={mechanic._id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                              {mechanic.profileImageUrl ? (
                                <img src={mechanic.profileImageUrl} alt={mechanic.name} className="w-10 h-10 rounded-xl object-cover" />
                              ) : (
                                <span className="text-white font-semibold">{mechanic.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            {/* Online indicator */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${mechanic.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{mechanic.name}</p>
                            <p className="text-xs text-gray-500">
                              {mechanic.completedJobs || 0} jobs completed
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{mechanic.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {mechanic.vehicleTypes?.map((type) => (
                            <span key={type} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(mechanic)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500">⭐</span>
                          <span className="text-sm text-gray-900 font-medium">{mechanic.rating?.toFixed(1) || 'N/A'}</span>
                          {mechanic.totalRatings && (
                            <span className="text-xs text-gray-400">({mechanic.totalRatings})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(mechanic.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Show unban for banned mechanics */}
                          {(mechanic.banInfo?.isBanned || mechanic.status === 'BANNED') ? (
                            <motion.button
                              onClick={() => handleUnbanMechanic(mechanic._id)}
                              disabled={actionLoading === mechanic._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 disabled:opacity-50"
                            >
                              {actionLoading === mechanic._id ? '⏳' : '✅ Unban'}
                            </motion.button>
                          ) : (
                            <>
                              {mechanic.status === 'PENDING' && (
                                <>
                                  <motion.button
                                    onClick={() => handleUpdateStatus(mechanic._id, 'APPROVED')}
                                    disabled={actionLoading === mechanic._id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 disabled:opacity-50"
                                  >
                                    Approve
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleUpdateStatus(mechanic._id, 'REJECTED')}
                                    disabled={actionLoading === mechanic._id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                                  >
                                    Reject
                                  </motion.button>
                                </>
                              )}
                              {(mechanic.status === 'APPROVED' || mechanic.status === 'ACTIVE') && (
                                <>
                                  <motion.button
                                    onClick={() => openBanModal(mechanic)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100"
                                  >
                                    🚫 Ban
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleUpdateStatus(mechanic._id, 'SUSPENDED')}
                                    disabled={actionLoading === mechanic._id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-xl text-sm font-semibold hover:bg-yellow-100 disabled:opacity-50"
                                  >
                                    Suspend
                                  </motion.button>
                                </>
                              )}
                              {mechanic.status === 'SUSPENDED' && (
                                <>
                                  <motion.button
                                    onClick={() => handleUpdateStatus(mechanic._id, 'APPROVED')}
                                    disabled={actionLoading === mechanic._id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 disabled:opacity-50"
                                  >
                                    Reactivate
                                  </motion.button>
                                  <motion.button
                                    onClick={() => openBanModal(mechanic)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100"
                                  >
                                    🚫 Ban
                                  </motion.button>
                                </>
                              )}
                              {mechanic.status === 'REJECTED' && (
                                <motion.button
                                  onClick={() => handleUpdateStatus(mechanic._id, 'APPROVED')}
                                  disabled={actionLoading === mechanic._id}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  Approve
                                </motion.button>
                              )}
                            </>
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

      {/* Ban Modal */}
      {showBanModal && selectedMechanic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">🚫 Ban Mechanic</h2>
              <button
                onClick={() => setShowBanModal(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">Banning mechanic:</p>
              <p className="font-semibold text-gray-900">{selectedMechanic.name}</p>
              <p className="text-sm text-gray-600">{selectedMechanic.phone}</p>
            </div>

            <div className="space-y-4">
              {/* Ban Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ban Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBanType('TEMPORARY')}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      banType === 'TEMPORARY'
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    ⏳ Temporary
                  </button>
                  <button
                    onClick={() => setBanType('PERMANENT')}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      banType === 'PERMANENT'
                        ? 'bg-red-100 text-red-700 border-2 border-red-400'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    🚫 Permanent
                  </button>
                </div>
              </div>

              {/* Duration (for temporary) */}
              {banType === 'TEMPORARY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 3, 7, 14, 30].map((days) => (
                      <button
                        key={days}
                        onClick={() => setBanDuration(days)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          banDuration === days
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {days} {days === 1 ? 'day' : 'days'}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={banDuration}
                    onChange={(e) => setBanDuration(parseInt(e.target.value) || 1)}
                    min="1"
                    className="mt-2 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="Custom days"
                  />
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ban Reason *</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for banning this mechanic..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                />
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-700">
                  <strong>⚠️ Warning:</strong> {banType === 'PERMANENT' 
                    ? 'This mechanic will be permanently banned and cannot login or receive jobs until unbanned manually.'
                    : `This mechanic will be banned for ${banDuration} days and will be automatically unbanned after the period.`
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanMechanic}
                  disabled={banLoading || !banReason.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-500/25"
                >
                  {banLoading ? '⏳ Banning...' : '🚫 Confirm Ban'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MechanicsPage;
