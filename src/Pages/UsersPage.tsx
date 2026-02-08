import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersApi } from '../utils/api';

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

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      setActionLoading(userId);
      const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
      await usersApi.updateStatus(userId, newStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return <span className="badge badge-success">Active</span>;
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
    <div className="p-4 lg:p-6 bg-gray-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all registered users</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3">
            <p className="text-2xl font-bold text-white">{users.length}</p>
            <p className="text-xs text-gray-400">Total Users</p>
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
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
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
          <button onClick={fetchUsers} className="text-red-300 underline mt-2 text-sm">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">User</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Phone</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Email</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Joined</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {user.profileImageUrl ? (
                              <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <span className="text-white font-medium">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            {user.gender && <p className="text-xs text-gray-500">{user.gender}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-300">{user.phone}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-400">{user.email || '-'}</td>
                      <td className="px-4 lg:px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <motion.button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          disabled={actionLoading === user._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          } disabled:opacity-50`}
                        >
                          {actionLoading === user._id ? (
                            <span className="inline-block animate-spin">⏳</span>
                          ) : user.status === 'ACTIVE' ? (
                            'Ban User'
                          ) : (
                            'Unban User'
                          )}
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

export default UsersPage;
