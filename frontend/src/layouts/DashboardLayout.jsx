import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Lenis from 'lenis';

const DashboardLayout = () => {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cyber-dark">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Application Container */}
      <div className="flex flex-1 relative">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dashboard Pages Content */}
        <main className="flex-1 min-w-0 overflow-y-auto px-6 py-8 md:p-10 lg:p-12">
          {/* Dynamic Page Rendering */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
