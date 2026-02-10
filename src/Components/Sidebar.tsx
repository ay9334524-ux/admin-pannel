import { motion } from 'framer-motion';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isOpen: boolean;
  onClose: () => void;
  role?: string;
}

const navItems = [
  { name: 'Dashboard', icon: '📊', roles: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT'] },
  { name: 'Users', icon: '👥', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Mechanics', icon: '🔧', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Services', icon: '🛠️', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Regions', icon: '📍', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Pricing', icon: '💰', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Bookings', icon: '📅', roles: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT'] },
  { name: 'Payments', icon: '💳', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Support', icon: '🎧', roles: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT'] },
];

const Sidebar = ({ activeItem, onItemClick, isOpen, onClose, role = 'SUPPORT' }: SidebarProps) => {
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-50 transition-transform duration-300 shadow-xl shadow-gray-200/50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">MecFinder</span>
                <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
            {filteredNavItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => {
                  onItemClick(item.name);
                  onClose();
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                  activeItem === item.name
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
                {activeItem === item.name && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <p className="text-xs text-gray-500 font-medium">MecFinder Admin</p>
              <p className="text-xs text-blue-600 font-semibold">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
