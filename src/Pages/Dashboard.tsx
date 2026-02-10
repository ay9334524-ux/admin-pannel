import { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Topbar from '../Components/Topbar';
import DashboardContent from '../Components/DashboardContent';
import UsersPage from './UsersPage';
import MechanicsPage from './MechanicsPage';
import BookingsPage from './BookingsPage';
import ServicesPage from './ServicesPage';
import RegionsPage from './RegionsPage';
import PricingPage from './PricingPage';
import SupportPage from './SupportPage';

interface DashboardProps {
  admin: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const Dashboard = ({ admin, onLogout }: DashboardProps) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Users':
        return <UsersPage />;
      case 'Mechanics':
        return <MechanicsPage />;
      case 'Services':
        return <ServicesPage />;
      case 'Regions':
        return <RegionsPage />;
      case 'Pricing':
        return <PricingPage />;
      case 'Bookings':
        return <BookingsPage />;
      case 'Payments':
        return <PlaceholderContent title="Payments" description="Track all payments" />;
      case 'Support':
        return <SupportPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={admin?.role}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <Topbar
          title={activeItem}
          admin={admin}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Placeholder for other pages
const PlaceholderContent = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6 flex items-center justify-center min-h-[60vh]">
    <div className="text-center bg-white rounded-3xl p-12 shadow-lg shadow-gray-200/50 border border-gray-100">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🛠️</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">{description}</p>
      <p className="text-blue-600 text-sm mt-4 font-medium">Coming soon...</p>
    </div>
  </div>
);

export default Dashboard;
