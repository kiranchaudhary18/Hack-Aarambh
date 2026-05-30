import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Lenis from 'lenis';
import { Shield, Mail, Twitter, Linkedin, Github } from 'lucide-react';

const LandingLayout = () => {
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
    <div className="flex flex-col min-h-screen bg-cyber-dark overflow-x-hidden">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Futuristic Cybersecurity Footer */}
      <footer className="w-full bg-[#05070c] border-t border-cyber-border py-16 px-6 md:px-12 lg:px-24 mt-20 relative overflow-hidden">
        {/* Glow Decor */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">SAFEHIRE AI</span>
            </div>
            <p className="text-xs text-cyber-gray leading-relaxed">
              Safeguarding job seekers against high-tech phishing scams, fraudulent recruitment offers, and digital identity exploitation with enterprise-grade cybersecurity tools.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-white/5 border border-cyber-border hover:border-cyber-blue rounded-lg text-cyber-gray hover:text-cyber-glow transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 border border-cyber-border hover:border-cyber-blue rounded-lg text-cyber-gray hover:text-cyber-glow transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 border border-cyber-border hover:border-cyber-blue rounded-lg text-cyber-gray hover:text-cyber-glow transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-cyber-blue">Core Engine</h5>
            <ul className="space-y-2 text-xs text-cyber-gray">
              <li><a href="#" className="hover:text-white transition-colors">AI PDF Document Scanner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Domain Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Heuristic Threat Analyzer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Scam Database Query</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-cyber-purple">Resources</h5>
            <ul className="space-y-2 text-xs text-cyber-gray">
              <li><a href="#" className="hover:text-white transition-colors">Candidate Awareness Hub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Incident Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & Terms</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-cyber-glow">Contact Security</h5>
            <p className="text-xs text-cyber-gray">
              Have you identified a recruiting scam or fake site? Help us flag it!
            </p>
            <a 
              href="mailto:threat-report@safehire.ai" 
              className="flex items-center gap-2 p-3 bg-white/5 border border-cyber-border hover:border-cyber-pink hover:bg-cyber-pink/5 rounded-xl text-xs font-semibold text-white transition-all w-fit"
            >
              <Mail className="w-4 h-4 text-cyber-pink" />
              <span>threat-report@safehire.ai</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-cyber-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cyber-gray relative z-10 gap-4">
          <p>© 2026 SafeHire AI Inc. Shielding talent. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Security Compliance</a>
            <a href="#" className="hover:text-white transition-colors">GDPR & CCPA</a>
            <a href="#" className="hover:text-white transition-colors">SOC2 Certified</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
