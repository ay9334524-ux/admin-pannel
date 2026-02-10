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
    <div className="p-4 lg:p-8 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regional Pricing</h1>
          <p className="text-gray-500 text-sm mt-1">Set service prices for different regions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
        >
          + Set Price
        </motion.button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 font-medium"
        >
          {success}
        </motion.div>
      )}

      {/* Region Filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg shadow-gray-200/50">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Filter by Region</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRegion('')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedRegion === ''
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region._id}
              onClick={() => setSelectedRegion(region._id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedRegion === region._id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <div className="animate-spin w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Service
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Region
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Base
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    GST
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Platform
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Travel
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Total
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Mechanic
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Company
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricing.map((p) => (
                  <tr key={p._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span>{p.serviceId?.categoryId?.icon || '🔧'}</span>
                        <span className="font-semibold text-gray-900">{p.serviceId?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{p.regionId?.name}</td>
                    <td className="px-4 py-4 text-right text-gray-900 font-medium">₹{p.basePrice}</td>
                    <td className="px-4 py-4 text-right text-gray-600">
                      ₹{p.gstAmount} <span className="text-xs text-gray-400">({p.gstPercent}%)</span>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600">
                      ₹{p.platformFeeAmount} <span className="text-xs text-gray-400">({p.platformFeePercent}%)</span>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600">₹{p.travelCharge}</td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">₹{p.totalPrice}</td>
                    <td className="px-4 py-4 text-right text-emerald-600 font-semibold">₹{p.mechanicEarning}</td>
                    <td className="px-4 py-4 text-right text-blue-600 font-semibold">₹{p.companyEarning}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
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
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-gray-500 font-medium">No pricing set. Start by setting prices for services in different regions!</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Set Regional Pricing</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service</label>
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Region</label>
                  <select
                    value={formData.regionId}
                    onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price (₹)</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">GST (%)</label>
                  <input
                    type="number"
                    value={formData.gstPercent}
                    onChange={(e) => setFormData({ ...formData, gstPercent: Number(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Platform Fee (%)</label>
                  <input
                    type="number"
                    value={formData.platformFeePercent}
                    onChange={(e) => setFormData({ ...formData, platformFeePercent: Number(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Travel Charge (₹)</label>
                  <input
                    type="number"
                    value={formData.travelCharge}
                    onChange={(e) => setFormData({ ...formData, travelCharge: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-gray-900 mb-3">Price Breakdown Preview</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base Price</span>
                    <span className="text-gray-900 font-medium">₹{preview.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST ({preview.gstPercent}%)</span>
                    <span className="text-gray-900 font-medium">₹{preview.gstAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Platform Fee ({preview.platformFeePercent}%)</span>
                    <span className="text-gray-900 font-medium">₹{preview.platformFeeAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Travel Charge</span>
                    <span className="text-gray-900 font-medium">₹{preview.travelCharge}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total (User Pays)</span>
                      <span className="text-gray-900">₹{preview.totalPrice}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 font-medium">Mechanic Earns</span>
                      <span className="text-emerald-600 font-bold">₹{preview.mechanicEarning}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 font-medium">Company Earns</span>
                      <span className="text-blue-600 font-bold">₹{preview.companyEarning}</span>
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
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
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
