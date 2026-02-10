import { motion } from 'framer-motion';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  index: number;
  gradient: string;
  trend?: string;
}

const StatCard = ({ icon, value, label, index, gradient, trend }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          <p className="text-gray-500 font-medium mt-1">{label}</p>
          {trend && (
            <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {trend}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const stats = [
  { icon: '👥', value: '12,459', label: 'Total Users', gradient: 'from-blue-500 to-cyan-500', trend: '+12% this month' },
  { icon: '🔧', value: '3,721', label: 'Total Mechanics', gradient: 'from-purple-500 to-pink-500', trend: '+8% this month' },
  { icon: '📅', value: '847', label: 'Active Bookings', gradient: 'from-orange-500 to-amber-500', trend: '+23% this week' },
  { icon: '💰', value: '₹4.2L', label: 'Total Revenue', gradient: 'from-green-500 to-emerald-500', trend: '+18% this month' },
];

const recentBookings = [
  { id: 1, user: 'Rahul Sharma', mechanic: 'Amit Kumar', service: 'Bike Repair', status: 'Completed', time: '2 hours ago' },
  { id: 2, user: 'Priya Singh', mechanic: 'Suresh Yadav', service: 'Car Service', status: 'In Progress', time: '3 hours ago' },
  { id: 3, user: 'Vikram Patel', mechanic: 'Raju Verma', service: 'Tyre Change', status: 'Pending', time: '5 hours ago' },
  { id: 4, user: 'Sneha Gupta', mechanic: 'Mohit Singh', service: 'Oil Change', status: 'Completed', time: '6 hours ago' },
  { id: 5, user: 'Arjun Reddy', mechanic: 'Deepak Joshi', service: 'Engine Check', status: 'In Progress', time: '8 hours ago' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'In Progress':
      return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'Pending':
      return 'bg-gray-100 text-gray-600 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-200';
  }
};

const DashboardContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 lg:p-8 space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-blue-100">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            gradient={stat.gradient}
            trend={stat.trend}
            index={index}
          />
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="p-6 lg:p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <p className="text-gray-500 text-sm mt-1">Latest booking activities</p>
          </div>
          <button className="px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Mechanic
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Service
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{booking.user.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{booking.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{booking.mechanic}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{booking.service}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{booking.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
