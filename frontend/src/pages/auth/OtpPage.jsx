import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, ShieldCheck, ArrowRight, CornerUpLeft, 
  Terminal, RefreshCw, Key, ShieldAlert, Timer
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const OtpPage = () => {
  const navigate = useNavigate();
  
  // 6 Digit verification values
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Resend Timer Countdown (starts at 59 seconds)
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    // Only permit numeric inputs
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Return on Backspace to previous digit block
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const verificationCode = otp.join('');
    if (verificationCode.length < 6) {
      setError('Please provide the complete 6-digit MFA clearance code.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 1500);
    }, 1800);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setTimer(59);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
    setError('');
    alert("New secure Multi-Factor token has been broadcast successfully.");
  };

  return (
    <div className="min-h-screen bg-cyber-dark grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden select-none">
      
      {/* Visual Ambient Blur Blobs */}
      <div className="ambient-blob blur-blob blob-cyan absolute top-[-10%] left-[-10%] w-[500px] h-[500px]" />
      <div className="ambient-blob blur-blob blob-purple absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px]" />
      <div className="particles-decor" />

      {/* LEFT SPLIT PANEL: Pulsing Cryptographic Token Keys & Validator Engine */}
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

        {/* Center Animated Token Graphic */}
        <div className="relative flex flex-col items-center justify-center my-auto py-10 z-10 space-y-8">
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Visual server graphic cubes */}
            <div className="absolute inset-0 rounded-full border border-cyber-blue/20 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-cyber-purple/10 animate-ping" />
            
            {/* Pulsing center engine node */}
            <div className="w-24 h-24 rounded-full bg-[#050811] border border-cyber-glow/50 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.15)] relative">
              <Key className="w-10 h-10 text-cyber-glow animate-pulse" />
            </div>
          </div>

          <div className="text-center max-w-sm space-y-3">
            <h4 className="text-lg font-extrabold text-white tracking-tight uppercase flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-blue" /> MFA Verification Node
            </h4>
            <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
              Input the 6-digit Multi-Factor authorization key forwarded to your registered system address to verify security parameters.
            </p>
          </div>
        </div>

        {/* Bottom Mock System Logs Console */}
        <div className="rounded-2xl bg-[#03060c]/80 border border-cyber-border/40 p-4 font-mono text-[9px] text-cyber-gray/70 space-y-1 z-10 shadow-2xl backdrop-blur-md">
          <p className="text-cyber-glow">{"$ mfa_validator_engine --status: ACTIVE"}</p>
          <p className="text-white">{"[+] Listening to token handshake signals..."}</p>
          <p className="text-cyber-pink animate-pulse">{"[!] Waiting for 6-digit clearance code handshake packet."}</p>
        </div>

      </div>

      {/* RIGHT SPLIT PANEL: OTP verification digit inputs */}
      <div className="flex items-center justify-center p-8 sm:p-12 relative z-10 min-h-screen lg:min-h-0">
        
        {/* Animated Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-cyber-dark/95 flex flex-col items-center justify-center z-50 text-center space-y-6 animate-fade-in p-6">
            <div className="p-4 bg-cyber-glow/10 border border-cyber-glow/20 text-cyber-glow rounded-full w-fit mx-auto animate-bounce shadow-[0_0_50px_rgba(0,242,254,0.2)]">
              <ShieldCheck className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Security Handshake Complete</h3>
              <p className="text-xs text-cyber-gray font-semibold max-w-xs leading-relaxed">
                MFA credentials validated. Connecting client node to principal protection dashboard.
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
              <span className="text-[10px] font-bold text-cyber-purple uppercase tracking-widest font-mono">Multi-Factor Clearance Desk</span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Node Authorization</h2>
            </div>

            {error && (
              <div className="p-3 bg-cyber-pink/15 border border-cyber-pink/25 text-cyber-pink rounded-xl text-[10px] font-bold mb-4 uppercase tracking-wider animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              
              {/* Digit Inputs grid */}
              <div className="grid grid-cols-6 gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-full h-12 text-center text-lg font-mono font-black bg-[#03060c]/60 border border-cyber-border focus:border-cyber-blue focus:shadow-[0_0_12px_rgba(0,242,254,0.2)] focus:outline-none text-white rounded-xl transition-all"
                    required
                  />
                ))}
              </div>

              {/* Resend details countdown */}
              <div className="flex justify-between items-center text-[10px] font-bold font-mono uppercase text-cyber-gray">
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-cyber-purple animate-pulse" />
                  <span>Expires In: 0:{timer < 10 ? `0${timer}` : timer}</span>
                </span>
                
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-cyber-blue hover:text-cyber-glow transition-all uppercase cursor-pointer"
                  >
                    Resend clearance key
                  </button>
                ) : (
                  <span>Resend blocked</span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-widest mt-2"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Validate Clearance Key
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-cyber-gray font-semibold">
            Cancel authorization?{' '}
            <Link to="/auth/login" className="text-cyber-blue hover:underline hover:text-cyber-glow">
              Return to Login Node
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

// Micro spinner
const RefreshCwIcon = () => (
  <svg className="w-6 h-6 text-cyber-glow animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

export default OtpPage;
