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
import CouponsPage from './CouponsPage';
import ComplaintsPage from './ComplaintsPage';
import ReviewsPage from './ReviewsPage';
import WalletOperationsPage from './WalletOperationsPage';
import BannersPage from './BannersPage';

interface DashboardProps {
  admin: { name: string; email: string; role: string } | null;
  onLogout: () => void | Promise<void>;
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
      case 'Coupons':
        return <CouponsPage />;
      case 'Support':
        return <SupportPage />;
      case 'Complaints':
        return <ComplaintsPage />;
      case 'Reviews':
        return <ReviewsPage />;
      case 'Wallet / Payouts':
        return <WalletOperationsPage />;
      case 'Banners':
        return <BannersPage />;
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

export default Dashboard;
