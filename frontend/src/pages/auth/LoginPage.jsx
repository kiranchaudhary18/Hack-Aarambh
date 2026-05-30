import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, Mail, Lock, ArrowRight, UserCheck, ShieldAlert, 
  Sparkles, Eye, EyeOff, Github, Chrome, Terminal, ShieldCheck 
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardTitle, CardDescription } from '../../components/ui/Card';
import gsap from 'gsap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide valid authorization credentials.');
      return;
    }
    
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Navigate after success state animation
      setTimeout(() => {
        if (email.includes('admin')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }, 1500);
    }, 1800);
  };

  const handleDemoLogin = (role) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cyber-dark grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden select-none">
      
      {/* Visual Ambient Blur Blobs */}
      <div className="ambient-blob blur-blob blob-cyan absolute top-[-10%] left-[-10%] w-[500px] h-[500px]" />
      <div className="ambient-blob blur-blob blob-purple absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px]" />
      <div className="particles-decor" />

      {/* LEFT SPLIT PANEL: Animated Cybersecurity & Real-time Threat Monitor Terminal */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-black/25 border-r border-cyber-border/40 relative overflow-hidden h-full">
        <div className="cyber-grid absolute inset-0 opacity-10 pointer-events-none" />
        
        {/* Top Header Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)]">
            <Shield className="w-5.5 h-5.5 text-black" />
          </div>
          <div className="text-left leading-none">
            <span className="text-base font-bold tracking-wider text-white">SAFEHIRE AI</span>
            <span className="block text-[8px] text-cyber-gray font-bold tracking-widest leading-none mt-1 uppercase">
              Threat Intelligence Node
            </span>
          </div>
        </Link>

        {/* Center Animated Cyber Radar / Graphic */}
        <div className="relative flex flex-col items-center justify-center my-auto py-10 z-10 space-y-8">
          
          {/* Animated SVG Pulse Radar */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border border-cyber-blue/20 animate-ping opacity-60" />
            <div className="absolute inset-8 rounded-full border border-cyber-purple/30 animate-pulse" />
            <div className="absolute inset-16 rounded-full border border-cyber-pink/20" />
            
            {/* Center pulsing shield */}
            <div className="w-24 h-24 rounded-full bg-[#050811] border border-cyber-blue/50 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.15)] relative">
              <Shield className="w-10 h-10 text-cyber-blue animate-pulse" />
              <div className="absolute w-2 h-2 bg-cyber-glow rounded-full -top-1 -right-1 animate-ping" />
            </div>
            
            {/* Dynamic radar rotating beam */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyber-blue/10 animate-spin" style={{ animationDuration: '20s' }} />
          </div>

          <div className="text-center max-w-sm space-y-3">
            <h4 className="text-lg font-extrabold text-white tracking-tight uppercase flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-purple" /> Active Protection Layer
            </h4>
            <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
              Ecosystem metrics register 40+ recruiting fraud nodes daily. Secure authorization tokens enable direct API sandbox calls.
            </p>
          </div>
        </div>

        {/* Bottom Mock System Logs Console */}
        <div className="rounded-2xl bg-[#03060c]/80 border border-cyber-border/40 p-4 font-mono text-[9px] text-cyber-gray/70 space-y-1 z-10 shadow-2xl backdrop-blur-md">
          <p className="text-cyber-glow">{"$ node_protection_layer --status: ONLINE"}</p>
          <p className="text-white">{"[+] Listening to global recruiters DNS mappings..."}</p>
          <p className="text-cyber-purple">{"[i] Secure auth gateway activated. Waiting for handshake packet."}</p>
        </div>

      </div>

      {/* RIGHT SPLIT PANEL: Claymorphic Authentication Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 relative z-10 min-h-screen lg:min-h-0">
        
        {/* Animated Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-cyber-dark/95 flex flex-col items-center justify-center z-50 text-center space-y-6 animate-fade-in p-6">
            <div className="p-4 bg-cyber-glow/10 border border-cyber-glow/20 text-cyber-glow rounded-full w-fit mx-auto animate-bounce shadow-[0_0_50px_rgba(0,242,254,0.2)]">
              <ShieldCheck className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Authorization Successful</h3>
              <p className="text-xs text-cyber-gray font-semibold max-w-xs leading-relaxed">
                Security tokens successfully validated. Directing client node to main dashboard terminal.
              </p>
            </div>
            <RefreshCwIcon />
          </div>
        )}

        <div className="w-full max-w-md space-y-6">
          
          {/* Brand header for mobile screens */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-xl">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">SAFEHIRE AI</span>
            </Link>
          </div>

          <Card glowColor="purple" className="p-8 claymorphism">
            <div className="text-left mb-6 space-y-2">
              <span className="text-[10px] font-bold text-cyber-purple uppercase tracking-widest font-mono">Authorization Terminal</span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Access Node Control</h2>
            </div>

            {error && (
              <div className="p-3 bg-cyber-pink/15 border border-cyber-pink/25 text-cyber-pink rounded-xl text-[10px] font-bold mb-4 uppercase tracking-wider animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                id="login-email"
                label="Registered Email Signature"
                type="email"
                placeholder="e.g. candidate@safehire.ai"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  id="login-password"
                  label="Private Credentials Key"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3 text-cyber-gray hover:text-cyber-blue transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end text-xs font-bold font-mono">
                <Link to="/auth/forgot" className="text-cyber-blue hover:text-cyber-glow transition-all">
                  Recover Credentials Key?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-widest mt-2"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Authorize Node
              </Button>
            </form>

            {/* Social Logins */}
            <div className="space-y-4 mt-6 border-t border-cyber-border/40 pt-6">
              <p className="text-[8px] font-bold text-cyber-gray text-center uppercase tracking-widest font-mono">Or authorize via third-party certificate</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleDemoLogin('candidate')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-cyber-border bg-[#03060c]/60 hover:bg-[#050811] hover:border-cyber-blue/40 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-cyber-blue" />
                  <span>Google SSO</span>
                </button>
                <button 
                  onClick={() => handleDemoLogin('candidate')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-cyber-border bg-[#03060c]/60 hover:bg-[#050811] hover:border-cyber-purple/40 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4 text-cyber-purple" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Quick Demo Access Bar */}
          <div className="p-4 rounded-2xl glassmorphism border border-cyber-border/50 flex items-center justify-between gap-4">
            <span className="text-[9px] font-mono font-bold text-cyber-gray uppercase">Skip password check:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleDemoLogin('candidate')}
                className="px-2.5 py-1.5 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 text-[9px] font-bold text-cyber-blue hover:bg-cyber-blue/20 transition-all uppercase cursor-pointer"
              >
                User Dev
              </button>
              <button 
                onClick={() => handleDemoLogin('admin')}
                className="px-2.5 py-1.5 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 text-[9px] font-bold text-cyber-purple hover:bg-cyber-purple/20 transition-all uppercase cursor-pointer"
              >
                Admin Dev
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-cyber-gray font-semibold">
            Don't hold a SafeHire Node?{' '}
            <Link to="/auth/signup" className="text-cyber-blue hover:underline hover:text-cyber-glow">
              Register Node Key
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

// Micro components
const RefreshCwIcon = () => (
  <svg className="w-6 h-6 text-cyber-glow animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

export default LoginPage;
