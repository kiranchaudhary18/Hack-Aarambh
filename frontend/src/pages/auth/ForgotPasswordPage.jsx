import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, Mail, ArrowRight, ShieldCheck, CornerUpLeft, 
  Terminal, RefreshCw, KeyRound, AlertTriangle 
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid account registration signature.');
      return;
    }

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Auto redirect to OTP page to type in the recovery code!
      setTimeout(() => {
        navigate('/auth/otp');
      }, 2000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-cyber-dark grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden select-none">
      
      {/* Visual Ambient Blur Blobs */}
      <div className="ambient-blob blur-blob blob-cyan absolute top-[-10%] left-[-10%] w-[500px] h-[500px]" />
      <div className="ambient-blob blur-blob blob-purple absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px]" />
      <div className="particles-decor" />

      {/* LEFT SPLIT PANEL: Animated Key Rotator & Recovery Signals */}
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

        {/* Center Animated Rotator Key Graphic */}
        <div className="relative flex flex-col items-center justify-center my-auto py-10 z-10 space-y-8">
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Visual server graphic cubes */}
            <div className="absolute inset-0 rounded-full border border-cyber-purple/20 animate-pulse" />
            <div className="absolute inset-6 rounded-full border-2 border-dashed border-cyber-blue/35 animate-spin" style={{ animationDuration: '40s' }} />
            
            {/* Pulsing center engine node */}
            <div className="w-24 h-24 rounded-full bg-[#050811] border border-cyber-blue/50 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.2)] relative">
              <KeyRound className="w-10 h-10 text-cyber-blue animate-pulse" />
            </div>
          </div>

          <div className="text-center max-w-sm space-y-3">
            <h4 className="text-lg font-extrabold text-white tracking-tight uppercase flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-glow" /> Dynamic Key Recovery
            </h4>
            <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
              Dispatches Multi-Factor OTP tokens to registered email signatures, verifying authorization integrity before resetting cryptographic passwords.
            </p>
          </div>
        </div>

        {/* Bottom Sandbox Log */}
        <div className="rounded-2xl bg-[#03060c]/80 border border-cyber-border/40 p-4 font-mono text-[9px] text-cyber-gray/70 space-y-1 z-10 shadow-2xl backdrop-blur-md">
          <p className="text-cyber-glow">{"$ credential_recovery_daemon --status: LISTENING"}</p>
          <p className="text-white">{"[+] Dispatched recovery handshake parameters on demand..."}</p>
        </div>

      </div>

      {/* RIGHT SPLIT PANEL: Recover Form card */}
      <div className="flex items-center justify-center p-8 sm:p-12 relative z-10 min-h-screen lg:min-h-0">
        
        {/* Animated Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-cyber-dark/95 flex flex-col items-center justify-center z-50 text-center space-y-6 animate-fade-in p-6">
            <div className="p-4 bg-cyber-glow/10 border border-cyber-glow/20 text-cyber-glow rounded-full w-fit mx-auto animate-bounce shadow-[0_0_50px_rgba(0,242,254,0.2)]">
              <ShieldCheck className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">OTP Token Dispatched</h3>
              <p className="text-xs text-cyber-gray font-semibold max-w-xs leading-relaxed">
                Verification credentials sent to your address. Forwarding to dynamic OTP clearance desk.
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
              <span className="text-[10px] font-bold text-cyber-purple uppercase tracking-widest font-mono">Credentials Recovery Hub</span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Rotate Security Key</h2>
            </div>

            {error && (
              <div className="p-3 bg-cyber-pink/15 border border-cyber-pink/25 text-cyber-pink rounded-xl text-[10px] font-bold mb-4 uppercase tracking-wider animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <Input
                id="forgot-email"
                label="Registered Corporate Email Signature"
                type="email"
                placeholder="e.g. candidate@safehire.ai"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-widest mt-2"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Request OTP Broadcast
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-cyber-gray font-semibold">
            Recall security credentials?{' '}
            <Link to="/auth/login" className="text-cyber-blue hover:underline hover:text-cyber-glow">
              Access Login Terminal
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

export default ForgotPasswordPage;
