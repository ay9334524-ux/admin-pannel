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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold text-white">MecFinder</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => {
                  onItemClick(item.name);
                  onClose();
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeItem === item.name
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-600 text-center">
              MecFinder Admin v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
