import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supportApi } from '../utils/api';

interface Query {
  _id: string;
  userId: { name: string; email: string; phone: string };
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: { name: string; email: string };
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: { name: string };
  createdAt: string;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

const SupportPage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [resolution, setResolution] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [queriesRes, statsRes] = await Promise.all([
        supportApi.getAll(statusFilter ? { status: statusFilter } : undefined),
        supportApi.getStats(),
      ]);
      setQueries(queriesRes.queries);
      setStats(statsRes.stats);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await supportApi.updateStatus(id, { status, resolution: resolution || undefined });
      setSuccess(`Query marked as ${status}`);
      setSelectedQuery(null);
      setResolution('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BOOKING':
        return '📅';
      case 'PAYMENT':
        return '💳';
      case 'MECHANIC':
        return '🔧';
      case 'APP_ISSUE':
        return '📱';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Support Queries</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user support tickets</p>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 shadow-lg"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 shadow-lg"
        >
          {success}
        </motion.div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center text-lg">📊</div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-lg">📬</div>
              <div>
                <p className="text-sm text-gray-500">Open</p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 w-10 h-10 rounded-xl flex items-center justify-center text-lg">⏳</div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center text-lg">✅</div>
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 w-10 h-10 rounded-xl flex items-center justify-center text-lg">📁</div>
              <div>
                <p className="text-sm text-gray-500">Closed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Queries List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <motion.div
              key={query._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:border-gray-300 transition-all shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getCategoryIcon(query.category)}</span>
                    <h3 className="font-semibold text-gray-900">{query.subject}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{query.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-500">
                      👤 {query.userId?.name || 'Unknown'} ({query.userId?.phone})
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                      {query.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-400">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {query.resolution && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-green-600">
                        <span className="font-medium">Resolution:</span> {query.resolution}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => setSelectedQuery(query)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 border border-gray-200 transition-all"
                  >
                    View
                  </button>
                  {query.status !== 'RESOLVED' && query.status !== 'CLOSED' && (
                    <button
                      onClick={() => {
                        setSelectedQuery(query);
                      }}
                      className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-xl hover:bg-green-100 border border-green-200 transition-all"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {queries.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-lg">
          <p className="text-gray-500">No queries found.</p>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Query Details</h2>
              <button
                onClick={() => {
                  setSelectedQuery(null);
                  setResolution('');
                }}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Subject</label>
                <p className="font-medium text-gray-900">{selectedQuery.subject}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Message</label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedQuery.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">User</label>
                  <p className="text-gray-900 font-medium">{selectedQuery.userId?.name}</p>
                  <p className="text-sm text-gray-500">{selectedQuery.userId?.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Category</label>
                  <p className="text-gray-900">{selectedQuery.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Priority</label>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedQuery.priority)}`}>
                    {selectedQuery.priority}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Status</label>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuery.status)}`}>
                    {selectedQuery.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedQuery.status !== 'RESOLVED' && selectedQuery.status !== 'CLOSED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Note</label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Add resolution note..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedQuery(null);
                    setResolution('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 border border-gray-200 transition-all"
                >
                  Close
                </button>
                {selectedQuery.status === 'OPEN' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'IN_PROGRESS')}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg shadow-yellow-500/25"
                  >
                    Mark In Progress
                  </button>
                )}
                {(selectedQuery.status === 'OPEN' || selectedQuery.status === 'IN_PROGRESS') && (
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'RESOLVED')}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
