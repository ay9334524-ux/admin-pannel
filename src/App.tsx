import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import HowItWorks from './Components/HowItWorks'
import Services from './Components/Services'
import WhyMecFinder from './Components/WhyMecFinder'
import ForMechanics from './Components/ForMechanics'
import CallToAction from './Components/CallToAction'
import Footer from './Components/Footer'
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import { adminAuthApi, apiHelpers } from './utils/api';

interface Admin {
  name: string;
  email: string;
  role: string;
}

function App() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'landing' | 'admin'>('landing');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setCurrentPage('admin');
    }

    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        apiHelpers.clearSession();
      }
    }
    setIsLoading(false);

    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPage(path.startsWith('/admin') ? 'admin' : 'landing');
    };
    window.addEventListener('popstate', handlePopState);

    // Listen for session expiry from the API layer (refresh failed / 401).
    const handleSessionExpired = () => {
      setAdmin(null);
      if (window.location.pathname.startsWith('/admin')) {
        // Stay on admin route so user sees the login screen.
        setCurrentPage('admin');
      }
    };
    window.addEventListener('admin:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('admin:session-expired', handleSessionExpired);
    };
  }, []);

  const handleLoginSuccess = (adminData: Admin) => {
    setAdmin(adminData);
  };

  const handleLogout = async () => {
    // Fire-and-forget server-side revoke; clear local state regardless.
    try {
      await adminAuthApi.logout();
    } catch {
      /* ignore server errors — we still want to log out locally */
    }
    apiHelpers.clearSession();
    setAdmin(null);
  };

  // Admin pages
  if (currentPage === 'admin') {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30 animate-pulse">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        </div>
      );
    }

    return admin ? (
      <Dashboard admin={admin} onLogout={handleLogout} />
    ) : (
      <Login onLoginSuccess={handleLoginSuccess} />
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <WhyMecFinder />
      <ForMechanics />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default App
