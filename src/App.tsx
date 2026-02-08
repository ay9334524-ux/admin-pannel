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
    // Check URL for admin route
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setCurrentPage('admin');
    }

    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);

    // Listen for URL changes
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPage(path.startsWith('/admin') ? 'admin' : 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = (adminData: Admin) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  // Admin pages
  if (currentPage === 'admin') {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
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
