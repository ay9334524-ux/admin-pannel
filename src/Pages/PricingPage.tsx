import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pricingApi, servicesApi, regionsApi } from '../utils/api';

interface Service {
  _id: string;
  name: string;
  basePrice: number;
  categoryId: { name: string; icon: string };
}

interface Region {
  _id: string;
  name: string;
  state: string;
}

interface Pricing {
  _id: string;
  serviceId: Service;
  regionId: Region;
  basePrice: number;
  gstPercent: number;
  gstAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  travelCharge: number;
  totalPrice: number;
  mechanicEarning: number;
  companyEarning: number;
  status: string;
}

const PricingPage = () => {
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [formData, setFormData] = useState({
    serviceId: '',
    regionId: '',
    basePrice: 0,
    gstPercent: 18,
    platformFeePercent: 25,
    travelCharge: 88,
  });
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadPricing();
  }, [selectedRegion]);

  useEffect(() => {
    if (formData.basePrice > 0) {
      calculatePreview();
    }
  }, [formData.basePrice, formData.gstPercent, formData.platformFeePercent, formData.travelCharge]);

  const loadInitialData = async () => {
    try {
      const [servRes, regRes] = await Promise.all([
        servicesApi.getAll({ status: 'ACTIVE' }),
        regionsApi.getAll({ status: 'ACTIVE' }),
      ]);
      setServices(servRes.services);
      setRegions(regRes.regions);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const loadPricing = async () => {
    try {
      setLoading(true);
      const params = selectedRegion ? { regionId: selectedRegion } : undefined;
      const res = await pricingApi.getAll(params);
      setPricing(res.pricing);
    } catch (err) {
      console.error('Error loading pricing:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePreview = async () => {
    try {
      const res = await pricingApi.calculate({
        basePrice: formData.basePrice,
        gstPercent: formData.gstPercent,
        platformFeePercent: formData.platformFeePercent,
        travelCharge: formData.travelCharge,
      });
      setPreview(res.breakdown);
    } catch (err) {
      console.error('Error calculating preview:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await pricingApi.upsert(formData);
      setSuccess('Pricing saved successfully!');
      setShowForm(false);
      resetForm();
      loadPricing();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing?')) return;

    try {
      await pricingApi.delete(id);
      setSuccess('Pricing deleted successfully!');
      loadPricing();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (p: Pricing) => {
    setFormData({
      serviceId: p.serviceId._id,
      regionId: p.regionId._id,
      basePrice: p.basePrice,
      gstPercent: p.gstPercent,
      platformFeePercent: p.platformFeePercent,
      travelCharge: p.travelCharge,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      regionId: '',
      basePrice: 0,
      gstPercent: 18,
      platformFeePercent: 25,
      travelCharge: 88,
    });
    setPreview(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-950 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Regional Pricing</h1>
          <p className="text-gray-400 text-sm mt-1">Set service prices for different regions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Set Price
        </motion.button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400"
        >
          {success}
        </motion.div>
      )}

      {/* Region Filter */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <h2 className="text-sm font-medium text-gray-300 mb-3">Filter by Region</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRegion('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRegion === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region._id}
              onClick={() => setSelectedRegion(region._id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRegion === region._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Service
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Region
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Base
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    GST
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Platform
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Travel
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Total
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Mechanic
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Company
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {pricing.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-700/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{p.serviceId?.categoryId?.icon || '🔧'}</span>
                        <span className="font-medium text-white">{p.serviceId?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{p.regionId?.name}</td>
                    <td className="px-4 py-3 text-right text-white">₹{p.basePrice}</td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ₹{p.gstAmount} <span className="text-xs text-gray-500">({p.gstPercent}%)</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ₹{p.platformFeeAmount} <span className="text-xs text-gray-500">({p.platformFeePercent}%)</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">₹{p.travelCharge}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">₹{p.totalPrice}</td>
                    <td className="px-4 py-3 text-right text-green-400 font-medium">₹{p.mechanicEarning}</td>
                    <td className="px-4 py-3 text-right text-blue-400 font-medium">₹{p.companyEarning}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-2 py-1 text-xs font-medium text-red-400 bg-red-500/10 rounded hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pricing.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-800/50 border border-gray-700/50 rounded-xl">
          <p className="text-gray-400">No pricing set. Start by setting prices for services in different regions!</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">Set Regional Pricing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Service</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => {
                      const service = services.find((s) => s._id === e.target.value);
                      setFormData({
                        ...formData,
                        serviceId: e.target.value,
                        basePrice: service?.basePrice || 0,
                      });
                    }}
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.categoryId?.icon} {s.name} (₹{s.basePrice})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Region</label>
                  <select
                    value={formData.regionId}
                    onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select region</option>
                    {regions.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}, {r.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">GST (%)</label>
                  <input
                    type="number"
                    value={formData.gstPercent}
                    onChange={(e) => setFormData({ ...formData, gstPercent: Number(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Platform Fee (%)</label>
                  <input
                    type="number"
                    value={formData.platformFeePercent}
                    onChange={(e) => setFormData({ ...formData, platformFeePercent: Number(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Travel Charge (₹)</label>
                  <input
                    type="number"
                    value={formData.travelCharge}
                    onChange={(e) => setFormData({ ...formData, travelCharge: Number(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-white mb-3">Price Breakdown Preview</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white">₹{preview.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">GST ({preview.gstPercent}%)</span>
                    <span className="text-white">₹{preview.gstAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Platform Fee ({preview.platformFeePercent}%)</span>
                    <span className="text-white">₹{preview.platformFeeAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Travel Charge</span>
                    <span className="text-white">₹{preview.travelCharge}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total (User Pays)</span>
                      <span className="text-white">₹{preview.totalPrice}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Mechanic Earns</span>
                      <span className="text-green-400 font-medium">₹{preview.mechanicEarning}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-400">Company Earns</span>
                      <span className="text-blue-400 font-medium">₹{preview.companyEarning}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Pricing
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
