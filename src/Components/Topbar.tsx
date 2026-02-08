import { motion } from 'framer-motion';

interface TopbarProps {
  title: string;
  admin: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  onMenuClick: () => void;
}

const Topbar = ({ title, admin, onLogout, onMenuClick }: TopbarProps) => {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 lg:px-6">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page Title */}
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Admin Info */}
        {admin && (
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{admin.name}</p>
              <p className="text-xs text-gray-500">{admin.role}</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </header>
  );
};

export default Topbar;
