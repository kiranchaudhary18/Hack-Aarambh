import React, { useState, useEffect } from 'react';
import { Cpu, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

const Loader = ({
  message = "Initializing Threat Audit Sandbox...",
  showScanningSteps = true,
  progress = 0
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const scanSteps = [
    "Decrypting file metadata structure...",
    "Scanning headers for spoofed credentials...",
    "Validating recruitment domains against scam blacklists...",
    "Parsing text semantic structures for financial urgency patterns...",
    "Running salary benchmark anomaly detection...",
    "Cross-referencing recruiter profiles via SafeHire registry...",
    "Assembling fraud probability coefficients..."
  ];

  useEffect(() => {
    if (!showScanningSteps) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % scanSteps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [showScanningSteps]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      
      {/* High-end Cybersecurity Rotating Radar Ring */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Pulsing Backdrops */}
        <div className="absolute inset-0 rounded-full bg-cyber-blue/5 animate-ping [animation-duration:3s]" />
        <div className="absolute -inset-4 rounded-full border border-cyber-blue/15 animate-pulse" />
        
        {/* Rotating Outer Cyber Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-cyber-purple/35 spin-premium" />
        <div className="absolute -inset-2 rounded-full border border-cyber-blue/20 animate-spin [animation-duration:8s]" />
        
        {/* Main Center Capsule */}
        <div className="absolute inset-4 rounded-2xl bg-[#060a12] border border-cyber-blue/30 shadow-neon-cyan flex items-center justify-center">
          <Cpu className="w-8 h-8 text-cyber-glow animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xl font-bold uppercase tracking-tight text-white">
          {message}
        </h4>
        
        {showScanningSteps && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-6">
              <p className="text-xs text-cyber-gray font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-ping" />
                <span>{scanSteps[stepIndex]}</span>
              </p>
            </div>

            {/* Custom linear progress bar */}
            {progress > 0 && (
              <div className="w-48 h-1 bg-white/5 border border-cyber-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
