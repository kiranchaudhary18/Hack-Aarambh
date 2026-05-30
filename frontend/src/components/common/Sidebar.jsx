import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Shield, History, BookOpen, User, 
  Settings, ChevronRight, LogOut, ShieldAlert, BarChart3, Users,
  Activity, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAdmin = location.pathname.includes('/admin');

  // Navigation Links based on role
  const userLinks = [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'AI Scanner', path: '/user/analyze', icon: Shield },
    { name: 'Scam History', path: '/user/history', icon: History },
    { name: 'Awareness Hub', path: '/user/awareness', icon: BookOpen },
    { name: 'My Profile', path: '/user/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Admin Hub', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Flagged Cases', path: '/admin/flagged', icon: ShieldAlert },
    { name: 'Global Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'User Management', path: '/user/profile', icon: Users },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <motion.div
      animate={{ width: collapsed ? '80px' : '260px' }}
      transition={{ type: 'spring', damping: 24, stiffness: 220 }}
      className={`
        sticky top-[73px] h-[calc(100vh-73px)] shrink-0 bg-cyber-dark/45 backdrop-blur-2xl border-r border-cyber-border/40
        hidden md:flex flex-col justify-between py-8 px-4 z-30 transition-all duration-300
      `}
    >
      {/* Upper Section */}
      <div className="flex flex-col gap-10">
        {/* Toggle Collapse */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-2`}>
          {!collapsed && (
            <span className="text-[9px] font-bold text-cyber-gray tracking-widest uppercase">
              {isAdmin ? 'SYSTEM ADM' : 'CORE NAV'}
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-white/5 border border-cyber-border/80 hover:border-cyber-blue hover:text-cyber-glow transition-all duration-300 active:scale-90 cursor-pointer"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-500 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/5 text-cyber-glow border-l-2 border-cyber-glow shadow-[0_0_20px_rgba(0,255,208,0.08)]' 
                    : 'text-cyber-gray hover:text-white hover:bg-white/3 border-l-2 border-transparent'
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-115 group-hover:text-cyber-blue ${isActive ? 'text-cyber-glow' : ''}`} />
                {!collapsed && (
                  <span className="text-xs font-bold uppercase tracking-wider truncate">{link.name}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Lower Section */}
      <div className="flex flex-col gap-4">
        {/* Role Quick-Switch Trigger */}
        <div className="border-t border-cyber-border/40 pt-6">
          <button
            onClick={() => navigate(isAdmin ? '/user/dashboard' : '/admin/dashboard')}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl border border-cyber-border/80 w-full
              transition-all duration-300 hover:border-cyber-purple hover:bg-cyber-purple/10 text-left cursor-pointer
              ${collapsed ? 'justify-center' : ''}
            `}
            title={isAdmin ? "Switch to Candidate Hub" : "Switch to Security Admin"}
          >
            <Activity className={`w-4 h-4 ${isAdmin ? 'text-cyber-blue' : 'text-cyber-purple animate-pulse'}`} />
            {!collapsed && (
              <div className="truncate">
                <p className="text-[9px] text-cyber-gray leading-none font-bold uppercase tracking-wider">Node Switcher</p>
                <p className="text-xs font-bold text-white mt-1.5 flex items-center gap-1">
                  <span>{isAdmin ? 'Candidate Hub' : 'Security Admin'}</span>
                  <Sparkles className="w-3 h-3 text-cyber-glow" />
                </p>
              </div>
            )}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate('/')}
          className={`
            flex items-center gap-4 px-4 py-3.5 rounded-xl text-cyber-gray hover:text-cyber-pink hover:bg-cyber-pink/5
            transition-all duration-300 w-full cursor-pointer ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          {!collapsed && (
            <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
