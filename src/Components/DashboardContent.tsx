import { motion } from 'framer-motion';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  index: number;
}

const StatCard = ({ icon, value, label, index }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 cursor-pointer transition-shadow hover:shadow-lg hover:shadow-blue-500/5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-gray-400 text-sm mt-1">{label}</p>
        </div>
        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const stats = [
  { icon: '👥', value: '12,459', label: 'Total Users' },
  { icon: '🔧', value: '3,721', label: 'Total Mechanics' },
  { icon: '📅', value: '847', label: 'Active Bookings' },
  { icon: '💰', value: '₹4.2L', label: 'Total Revenue' },
];

const recentBookings = [
  { id: 1, user: 'Rahul Sharma', mechanic: 'Amit Kumar', service: 'Bike Repair', status: 'Completed' },
  { id: 2, user: 'Priya Singh', mechanic: 'Suresh Yadav', service: 'Car Service', status: 'In Progress' },
  { id: 3, user: 'Vikram Patel', mechanic: 'Raju Verma', service: 'Tyre Change', status: 'Pending' },
  { id: 4, user: 'Sneha Gupta', mechanic: 'Mohit Singh', service: 'Oil Change', status: 'Completed' },
  { id: 5, user: 'Arjun Reddy', mechanic: 'Deepak Joshi', service: 'Engine Check', status: 'In Progress' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500/10 text-green-400';
    case 'In Progress':
      return 'bg-yellow-500/10 text-yellow-400';
    case 'Pending':
      return 'bg-gray-500/10 text-gray-400';
    default:
      return 'bg-gray-500/10 text-gray-400';
  }
};

const DashboardContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 lg:p-6 space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            index={index}
          />
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
      >
        <div className="p-4 lg:p-6 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-3">
                  User
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-3">
                  Mechanic
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-3">
                  Service
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 lg:px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-white">{booking.user}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{booking.mechanic}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-400">{booking.service}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
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
