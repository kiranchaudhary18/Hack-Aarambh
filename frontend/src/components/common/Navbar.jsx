import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, User, Bell, LogOut, LayoutDashboard, Search, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { mockNotifications } from '../../mock/mockData';
import gsap from 'gsap';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  
  // Dummy Auth State
  const isLoggedIn = location.pathname.includes('/user') || location.pathname.includes('/admin');

  useEffect(() => {
    // GSAP navbar entrance animation
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.1 }
    );
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Scanner', path: '/user/analyze' },
    { name: 'Scam Database', path: '/user/history' },
    { name: 'Awareness Hub', path: '/user/awareness' },
  ];

  return (
    <nav 
      ref={navRef}
      className="sticky top-0 z-40 w-full bg-cyber-dark/65 backdrop-blur-xl border-b border-cyber-border/40 py-4 px-6 md:px-12 flex items-center justify-between"
    >
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-3 group relative z-50">
        <div className="p-2.5 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] group-hover:scale-105 transition-all duration-300">
          <Shield className="w-5.5 h-5.5 text-black" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-white via-cyber-blue to-cyber-glow bg-clip-text text-transparent">
            SAFEHIRE AI
          </span>
          <span className="text-[8px] text-cyber-gray font-bold tracking-widest leading-none mt-0.5 uppercase">
            Threat Intelligence
          </span>
        </div>
      </Link>

      {/* Desktop navigation links */}
      {!isLoggedIn && (
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xs font-bold uppercase tracking-wider text-cyber-gray hover:text-cyber-glow transition-all duration-300 relative group"
            >
              <span>{link.name}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-glow group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>
      )}

      {/* Actions / User controls */}
      <div className="hidden md:flex items-center gap-6">
        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 w-4 h-4 text-cyber-gray/50 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search scams..." 
                className="w-48 px-3 py-2 pl-9 text-xs rounded-xl bg-[#060a12] border border-cyber-border/80 focus:border-cyber-blue/50 focus:outline-none transition-all duration-300 text-white placeholder:text-gray-700"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-white/5 border border-cyber-border hover:border-cyber-blue/35 hover:text-cyber-glow rounded-xl transition-all duration-300 cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-pink rounded-full ring-2 ring-cyber-dark animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 rounded-2xl claymorphism border border-cyber-border/60 p-4 shadow-2xl z-50">
                  <div className="flex justify-between items-center mb-3 border-b border-cyber-border/40 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-blue">Active Threats Feed</span>
                    <button className="text-[9px] text-cyber-gray hover:text-white transition-colors uppercase font-bold">Clear all</button>
                  </div>
                  <div className="space-y-3">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="p-2.5 rounded-xl bg-white/3 hover:bg-white/5 transition-all border border-transparent hover:border-cyber-border/40 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            notif.type === 'critical' ? 'bg-cyber-pink/20 text-cyber-pink' :
                            notif.type === 'success' ? 'bg-cyber-glow/20 text-cyber-glow' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {notif.type}
                          </span>
                          <span className="text-[8px] text-cyber-gray/70">{notif.time}</span>
                        </div>
                        <p className="text-xs font-bold text-white mt-1.5">{notif.title}</p>
                        <p className="text-[10px] text-cyber-gray mt-0.5 leading-snug">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar control */}
            <div className="flex items-center gap-4 border-l border-cyber-border/40 pl-6">
              <Link to="/user/profile" className="flex items-center gap-3 group">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-xl border border-cyber-blue/30 group-hover:border-cyber-blue transition-all duration-300 object-cover"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-white leading-none">Alex Rivera</p>
                  <p className="text-[9px] text-cyber-glow font-bold tracking-wider mt-1 flex items-center gap-1 uppercase">
                    <Sparkles className="w-2.5 h-2.5" /> Premium Node
                  </p>
                </div>
              </Link>
              
              <button 
                onClick={() => navigate('/')} 
                className="p-2 text-cyber-gray hover:text-cyber-pink hover:bg-cyber-pink/10 rounded-xl transition-all duration-300 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="secondary" size="sm">Log In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu button toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2.5 text-white bg-white/5 rounded-xl border border-cyber-border hover:border-cyber-blue transition-all duration-200 cursor-pointer"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu overlay drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-[73px] left-0 right-0 p-6 claymorphism border-b border-cyber-border shadow-2xl flex flex-col gap-6 md:hidden z-50 animate-float">
          {!isLoggedIn ? (
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold uppercase tracking-wider text-cyber-gray hover:text-cyber-glow transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-cyber-border/40 my-2" />
              <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="secondary" size="md" className="w-full">Log In</Button>
              </Link>
              <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="primary" size="md" className="w-full">Get Started</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/user/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold uppercase tracking-wider text-cyber-gray hover:text-cyber-glow">
                <LayoutDashboard className="w-4.5 h-4.5 text-cyber-blue" /> Dashboard
              </Link>
              <Link to="/user/analyze" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold uppercase tracking-wider text-cyber-gray hover:text-cyber-glow">
                <Shield className="w-4.5 h-4.5 text-cyber-blue" /> AI Scan
              </Link>
              <Link to="/user/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-base font-bold uppercase tracking-wider text-cyber-gray hover:text-cyber-glow">
                <User className="w-4.5 h-4.5 text-cyber-blue" /> Profile
              </Link>
              <button 
                onClick={() => { setMobileMenuOpen(false); navigate('/'); }} 
                className="flex items-center gap-3 text-base font-bold uppercase tracking-wider text-cyber-pink hover:text-red-500 mt-4 cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" /> Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
