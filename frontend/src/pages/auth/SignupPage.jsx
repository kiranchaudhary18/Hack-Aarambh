import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, Mail, Lock, User, ArrowRight, ShieldCheck, 
  Sparkles, Eye, EyeOff, Github, Chrome, Cpu, Terminal, Check
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardTitle, CardDescription } from '../../components/ui/Card';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Dynamic Password Strength Meter
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('NO SECURITY KEY PROVIDED');
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setStrengthLabel('NO SECURITY KEY PROVIDED');
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setStrength(score);
    if (score === 1) setStrengthLabel('CRITICAL SECURITY STRENGTH (WEAK)');
    else if (score === 2) setStrengthLabel('VULNERABLE DEPLOYMENT KEY (MEDIUM)');
    else if (score === 3) setStrengthLabel('SECURE ARCHITECTURE BLOCK (STRONG)');
    else if (score === 4) setStrengthLabel('MILITARY-GRADE INTEGRITY VALUE (EXTREME)');
  }, [password]);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all security parameter blocks.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Credentials do not match designated confirmation parameter.');
      return;
    }
    if (strength < 2) {
      setError('Your private credentials key must meet minimum security requirements.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/otp'); // Redirect to the OTP verification page next!
      }, 1500);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-cyber-dark grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden select-none">
      
      {/* Visual Ambient Blur Blobs */}
      <div className="ambient-blob blur-blob blob-cyan absolute top-[-10%] left-[-10%] w-[500px] h-[500px]" />
      <div className="ambient-blob blur-blob blob-purple absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px]" />
      <div className="particles-decor" />

      {/* LEFT SPLIT PANEL: Animated Virtual Machine Provisioner / Compiler Details */}
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

        {/* Center Sandbox Interactive Visual compilation */}
        <div className="relative flex flex-col items-center justify-center my-auto py-10 z-10 space-y-8">
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Visual server graphic cubes */}
            <div className="absolute inset-0 rounded-3xl border border-cyber-purple/20 rotate-45 animate-pulse" />
            <div className="absolute inset-8 rounded-3xl border border-cyber-blue/30 -rotate-45" />
            
            {/* Pulsing center engine node */}
            <div className="w-24 h-24 rounded-2xl bg-[#050811] border border-cyber-purple/50 flex items-center justify-center shadow-[0_0_40px_rgba(176,38,255,0.15)] relative">
              <Cpu className="w-10 h-10 text-cyber-purple animate-bounce" />
              <div className="absolute w-2 h-2 bg-cyber-pink rounded-full -bottom-1 -left-1 animate-ping" />
            </div>
            
            <div className="absolute inset-0 rounded-full border border-dashed border-cyber-purple/10 animate-spin" style={{ animationDuration: '30s' }} />
          </div>

          <div className="text-center max-w-sm space-y-3">
            <h4 className="text-lg font-extrabold text-white tracking-tight uppercase flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-blue" /> Sandbox Node Provisioner
            </h4>
            <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
              Activating an account allocates a isolated client protection VM. All file analysis requests parse inside container channels.
            </p>
          </div>
        </div>

        {/* Bottom Sandbox Log */}
        <div className="rounded-2xl bg-[#03060c]/80 border border-cyber-border/40 p-4 font-mono text-[9px] text-cyber-gray/70 space-y-1 z-10 shadow-2xl backdrop-blur-md">
          <p className="text-cyber-purple">{"$ provisioning_sandbox_cluster --node: COMPILING"}</p>
          <p className="text-white">{"[+] Bundling compliance headers and isolated libraries..."}</p>
          <p className="text-cyber-blue">{"[i] SafeHire identity protocol initialized. Waiting for user payload."}</p>
        </div>

      </div>

      {/* RIGHT SPLIT PANEL: Claymorphic Credentials Compilation Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 relative z-10 min-h-screen lg:min-h-0">
        
        {/* Animated Success Overlay */}
        {success && (
          <div className="absolute inset-0 bg-cyber-dark/95 flex flex-col items-center justify-center z-50 text-center space-y-6 animate-fade-in p-6">
            <div className="p-4 bg-cyber-glow/10 border border-cyber-glow/20 text-cyber-glow rounded-full w-fit mx-auto animate-bounce shadow-[0_0_50px_rgba(0,242,254,0.2)]">
              <ShieldCheck className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Node Identity Created</h3>
              <p className="text-xs text-cyber-gray font-semibold max-w-xs leading-relaxed">
                VM sandboxed parameters configured. Dispatching Multi-Factor OTP authorization key next.
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

          <Card glowColor="pink" className="p-8 claymorphism">
            <div className="text-left mb-6 space-y-2">
              <span className="text-[10px] font-bold text-cyber-pink uppercase tracking-widest font-mono">Sandbox Registration Portal</span>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Activate Secure Node</h2>
            </div>

            {error && (
              <div className="p-3 bg-cyber-pink/15 border border-cyber-pink/25 text-cyber-pink rounded-xl text-[10px] font-bold mb-4 uppercase tracking-wider animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                id="signup-name"
                label="Authorized Account Holder Name"
                type="text"
                placeholder="e.g. Alex Rivera"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                id="signup-email"
                label="Registered System Email"
                type="email"
                placeholder="e.g. candidate@safehire.ai"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  id="signup-password"
                  label="Establish Private Security Key"
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

              {/* Dynamic Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5 pt-1.5">
                  <div className="flex justify-between items-center text-[8px] font-bold font-mono uppercase">
                    <span className="text-cyber-gray">Security Level:</span>
                    <span className={
                      strength === 1 ? 'text-cyber-pink' :
                      strength === 2 ? 'text-orange-500' :
                      strength === 3 ? 'text-cyber-blue' :
                      'text-cyber-glow'
                    }>
                      {strengthLabel}
                    </span>
                  </div>
                  {/* Dynamic Progress Line */}
                  <div className="w-full h-1.5 bg-[#03060c] border border-cyber-border/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        strength === 1 ? 'bg-cyber-pink w-[25%]' :
                        strength === 2 ? 'bg-orange-500 w-[50%]' :
                        strength === 3 ? 'bg-cyber-blue w-[75%]' :
                        'bg-cyber-glow w-[100%]'
                      }`}
                    />
                  </div>
                </div>
              )}

              <Input
                id="signup-confirm-password"
                label="Confirm Security Key Parameter"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Provision Client Node
              </Button>
            </form>

            {/* Social Logins */}
            <div className="space-y-4 mt-6 border-t border-cyber-border/40 pt-6">
              <p className="text-[8px] font-bold text-cyber-gray text-center uppercase tracking-widest font-mono">Or establish node using identity token</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleSignup(new Event('submit'))}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-cyber-border bg-[#03060c]/60 hover:bg-[#050811] hover:border-cyber-blue/40 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-cyber-blue" />
                  <span>Google SSO</span>
                </button>
                <button 
                  onClick={() => handleSignup(new Event('submit'))}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-cyber-border bg-[#03060c]/60 hover:bg-[#050811] hover:border-cyber-purple/40 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4 text-cyber-purple" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </Card>

          <p className="text-center text-xs text-cyber-gray font-semibold">
            Already hold an active Node?{' '}
            <Link to="/auth/login" className="text-cyber-blue hover:underline hover:text-cyber-glow">
              Access Login Terminal
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

export default SignupPage;
