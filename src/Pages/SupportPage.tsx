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
        return 'bg-red-900/50 text-red-400';
      case 'HIGH':
        return 'bg-orange-900/50 text-orange-400';
      case 'MEDIUM':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'LOW':
        return 'bg-gray-700 text-gray-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-900/50 text-blue-400';
      case 'IN_PROGRESS':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'RESOLVED':
        return 'bg-green-900/50 text-green-400';
      case 'CLOSED':
        return 'bg-gray-700 text-gray-400';
      default:
        return 'bg-gray-700 text-gray-400';
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
    <div className="min-h-screen bg-gray-950 p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Support Queries</h1>
        <p className="text-gray-400 text-sm mt-1">Manage user support tickets</p>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-400"
        >
          {success}
        </motion.div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <p className="text-sm text-gray-400">Open</p>
            <p className="text-2xl font-bold text-blue-400">{stats.open}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <p className="text-sm text-gray-400">In Progress</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <p className="text-sm text-gray-400">Resolved</p>
            <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <p className="text-sm text-gray-400">Closed</p>
            <p className="text-2xl font-bold text-gray-500">{stats.closed}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5 hover:bg-gray-800 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getCategoryIcon(query.category)}</span>
                    <h3 className="font-semibold text-white">{query.subject}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{query.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-400">
                      👤 {query.userId?.name || 'Unknown'} ({query.userId?.phone})
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                      {query.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {query.resolution && (
                    <div className="mt-3 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                      <p className="text-sm text-green-400">
                        <span className="font-medium">Resolution:</span> {query.resolution}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => setSelectedQuery(query)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    View
                  </button>
                  {query.status !== 'RESOLVED' && query.status !== 'CLOSED' && (
                    <button
                      onClick={() => {
                        setSelectedQuery(query);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-green-400 bg-green-900/30 rounded-lg hover:bg-green-900/50 transition-colors"
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
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <p className="text-gray-400">No queries found.</p>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Query Details</h2>
              <button
                onClick={() => {
                  setSelectedQuery(null);
                  setResolution('');
                }}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Subject</label>
                <p className="font-medium text-white">{selectedQuery.subject}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Message</label>
                <p className="text-gray-300">{selectedQuery.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">User</label>
                  <p className="text-white">{selectedQuery.userId?.name}</p>
                  <p className="text-sm text-gray-400">{selectedQuery.userId?.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Category</label>
                  <p className="text-white">{selectedQuery.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Priority</label>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedQuery.priority)}`}>
                    {selectedQuery.priority}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuery.status)}`}>
                    {selectedQuery.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedQuery.status !== 'RESOLVED' && selectedQuery.status !== 'CLOSED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Resolution Note</label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Add resolution note..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedQuery(null);
                    setResolution('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                {selectedQuery.status === 'OPEN' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'IN_PROGRESS')}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Mark In Progress
                  </button>
                )}
                {(selectedQuery.status === 'OPEN' || selectedQuery.status === 'IN_PROGRESS') && (
                  <button
                    onClick={() => handleUpdateStatus(selectedQuery._id, 'RESOLVED')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
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
