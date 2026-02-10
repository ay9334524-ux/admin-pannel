import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersApi } from '../utils/api';

interface BanInfo {
  isBanned: boolean;
  banType?: 'PERMANENT' | 'TEMPORARY';
  banReason?: string;
  bannedAt?: string;
  banExpiresAt?: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'ACTIVE' | 'BANNED';
  gender?: string;
  profileImageUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  bookingsCount?: number;
  banInfo?: BanInfo;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Ban modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banType, setBanType] = useState<'PERMANENT' | 'TEMPORARY'>('TEMPORARY');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState(7); // days
  const [banLoading, setBanLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: { page: number; limit: number; status?: string; search?: string } = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const response = await usersApi.getAll(params);
      setUsers(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openBanModal = (user: User) => {
    setSelectedUser(user);
    setBanType('TEMPORARY');
    setBanReason('');
    setBanDuration(7);
    setShowBanModal(true);
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      alert('Please provide a reason for the ban');
      return;
    }

    try {
      setBanLoading(true);
      await usersApi.ban(selectedUser._id, {
        banType,
        reason: banReason,
        duration: banType === 'TEMPORARY' ? banDuration : undefined,
      });
      setUsers(users.map(u => 
        u._id === selectedUser._id 
          ? { ...u, status: 'BANNED' as const, banInfo: { isBanned: true, banType, banReason } } 
          : u
      ));
      setShowBanModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || 'Failed to ban user');
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      await usersApi.unban(userId, { reason: 'Unbanned by admin' });
      setUsers(users.map(u => 
        u._id === userId 
          ? { ...u, status: 'ACTIVE' as const, banInfo: { isBanned: false } } 
          : u
      ));
    } catch (err: any) {
      alert(err.message || 'Failed to unban user');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.status === 'ACTIVE') {
      return <span className="badge badge-success">Active</span>;
    }
    
    // Check ban type for banned users
    if (user.banInfo?.isBanned) {
      if (user.banInfo.banType === 'PERMANENT') {
        return (
          <span className="badge badge-danger" title={user.banInfo.banReason}>
            🚫 Permanent Ban
          </span>
        );
      } else if (user.banInfo.banType === 'TEMPORARY' && user.banInfo.banExpiresAt) {
        const expiresAt = new Date(user.banInfo.banExpiresAt);
        const now = new Date();
        const remainingDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <span className="badge badge-warning" title={`${user.banInfo.banReason} - Expires in ${remainingDays} days`}>
            ⏳ Temp Ban ({remainingDays}d)
          </span>
        );
      }
    }
    
    return <span className="badge badge-danger">Banned</span>;
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
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered users</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-lg shadow-gray-200/50">
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-xs text-gray-500 font-medium">Total Users</p>
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
          >
            Search
          </motion.button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchUsers} className="text-red-500 underline mt-2 text-sm font-medium">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg shadow-gray-200/50">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <p className="text-gray-500 font-medium">No users found</p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">User</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Phone</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Joined</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                            {user.profileImageUrl ? (
                              <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                            ) : (
                              <span className="text-white font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            {user.gender && <p className="text-xs text-gray-500">{user.gender}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email || '-'}</td>
                      <td className="px-6 py-4">{getStatusBadge(user)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4">
                        {user.status === 'ACTIVE' ? (
                          <motion.button
                            onClick={() => openBanModal(user)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                          >
                            🚫 Ban User
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => handleUnbanUser(user._id)}
                            disabled={actionLoading === user._id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition-all"
                          >
                            {actionLoading === user._id ? (
                              <span className="inline-block animate-spin">⏳</span>
                            ) : (
                              '✅ Unban User'
                            )}
                          </motion.button>
                        )}
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
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">🚫 Ban User</h2>
              <button
                onClick={() => setShowBanModal(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">Banning user:</p>
              <p className="font-semibold text-gray-900">{selectedUser.name}</p>
              <p className="text-sm text-gray-600">{selectedUser.phone}</p>
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
                            ? 'bg-blue-600 text-white'
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
                    className="mt-2 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
                  placeholder="Enter reason for banning this user..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-700">
                  <strong>⚠️ Warning:</strong> {banType === 'PERMANENT' 
                    ? 'This user will be permanently banned and cannot login until unbanned manually.'
                    : `This user will be banned for ${banDuration} days and will be automatically unbanned after the period.`
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
                  onClick={handleBanUser}
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

export default UsersPage;
