import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { adminPayoutsApi, adminWalletLogsApi } from '../utils/api';

type Tab = 'payouts' | 'logs';

const WalletOperationsPage = () => {
  const [tab, setTab] = useState<Tab>('payouts');
  const [payouts, setPayouts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  const loadPayouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminPayoutsApi.list({ status: 'QUEUE', page: 1, limit: 50 });
      setPayouts(data.payouts || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminWalletLogsApi.list({ page: 1, limit: 80 });
      setLogs(data.logs || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'payouts') loadPayouts();
    else loadLogs();
  }, [tab, loadPayouts, loadLogs]);

  const approve = async (id: string) => {
    setActionId(id);
    try {
      await adminPayoutsApi.approve(id, notesById[id]);
      await loadPayouts();
    } catch (e: any) {
      setError(e.message || 'Approve failed');
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id: string) => {
    const reason =
      typeof window !== 'undefined'
        ? window.prompt('Reject reason?', 'Invalid bank details') || ''
        : '';
    setActionId(id);
    try {
      await adminPayoutsApi.reject(id, reason);
      await loadPayouts();
    } catch (e: any) {
      setError(e.message || 'Reject failed');
    } finally {
      setActionId(null);
    }
  };

  const formatDt = (d: string | undefined) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet & payouts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Approve mechanic withdrawal requests · Review payment-link and audit events
          </p>
        </div>
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setTab('payouts')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === 'payouts' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
            }`}
          >
            Payout queue
          </button>
          <button
            type="button"
            onClick={() => setTab('logs')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === 'logs' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
            }`}
          >
            Audit logs
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {tab === 'payouts' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <span className="font-semibold text-gray-700">Queued requests ({payouts.length})</span>
            <button
              type="button"
              onClick={loadPayouts}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading…</div>
          ) : payouts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No payouts waiting for approval.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3 font-medium">Mechanic</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Bank / UPI</th>
                    <th className="px-4 py-3 font-medium">Requested</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => {
                    const mId =
                      typeof p.mechanicId === 'object' && p.mechanicId ? p.mechanicId : null;
                    const nm = (mId as any)?.fullName || 'Mechanic';
                    const ph = (mId as any)?.phone || '';
                    const id = String(p._id);
                    const busy = actionId === id;
                    const bankSnap = p.bankDetails || {};

                    return (
                      <tr key={id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{nm}</div>
                          <div className="text-xs text-gray-500">{ph}</div>
                          <div className="text-xs font-mono text-gray-400">{p.payoutId}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          ₹{p.amount?.toLocaleString?.('en-IN') ?? p.amount}
                        </td>
                        <td className="px-4 py-3">{p.paymentGateway || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-700 max-w-[200px]">
                          {bankSnap.upiId && <div>UPI: {bankSnap.upiId}</div>}
                          {bankSnap.accountNumber && (
                            <div>Acct ****{String(bankSnap.accountNumber).slice(-4)}</div>
                          )}
                          {bankSnap.ifscCode && <div>{bankSnap.ifscCode}</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                          {formatDt(p.createdAt || p.requestedAt)}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <input
                            type="text"
                            placeholder="Admin note"
                            value={notesById[id] || ''}
                            onChange={(ev) =>
                              setNotesById((prev) => ({ ...prev, [id]: ev.target.value }))
                            }
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs max-w-[160px]"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => approve(id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => reject(id)}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-200 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {tab === 'logs' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <span className="font-semibold text-gray-700">Audit trail</span>
            <button
              type="button"
              onClick={loadLogs}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading…</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No log entries.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Mechanic</th>
                    <th className="px-4 py-3 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l._id} className="border-b border-gray-50">
                      <td className="px-4 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {formatDt(l.createdAt)}
                      </td>
                      <td className="px-4 py-2">{l.category}</td>
                      <td className="px-4 py-2 font-medium">{l.action}</td>
                      <td className="px-4 py-2">{l.amount != null ? `₹${l.amount}` : '—'}</td>
                      <td className="px-4 py-2 text-xs font-mono text-gray-500">
                        {l.mechanicId ? String(l.mechanicId) : '—'}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600 max-w-[320px]">
                        {[l.message, l.status]
                          .filter(Boolean)
                          .join(' · ')}
                        {l.meta?.razorpayPaymentId != null ? ` · RZP:${l.meta?.razorpayPaymentId}` : ''}
                        {l.meta?.paymentLinkId ? ` · link:${l.meta?.paymentLinkId}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default WalletOperationsPage;
