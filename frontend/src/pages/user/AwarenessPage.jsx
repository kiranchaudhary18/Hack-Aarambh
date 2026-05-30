import React, { useState } from 'react';
import { BookOpen, ShieldCheck, HelpCircle, CheckSquare, AlertOctagon, HelpCircle as QuestionIcon, Sparkles, Terminal } from 'lucide-react';
import Card, { CardTitle, CardDescription, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AwarenessPage = () => {
  // Scam Calculator questionnaire states
  const [q1, setQ1] = useState(false); 
  const [q2, setQ2] = useState(false); 
  const [q3, setQ3] = useState(false); 
  const [q4, setQ4] = useState(false); 
  const [q5, setQ5] = useState(false); 
  
  const [calcScore, setCalcScore] = useState(null);

  const calculateScamScore = () => {
    let score = 0;
    if (q1) score += 20;
    if (q2) score += 20;
    if (q3) score += 35; 
    if (q4) score += 15;
    if (q5) score += 10;
    
    setCalcScore(score);
  };

  const resetCalculator = () => {
    setQ1(false);
    setQ2(false);
    setQ3(false);
    setQ4(false);
    setQ5(false);
    setCalcScore(null);
  };

  const scamTypes = [
    {
      title: "Advance Equipment Fee Fraud",
      warning: "Impersonators send forged checks to purchase computer devices from a fake designated vendor via Zelle or Crypto.",
      prevention: "Corporate recruiting shipping processes ship devices directly. They never demand money transfer or check deposits."
    },
    {
      title: "Telegram Chat Screening Sequences",
      warning: "The screeners perform full recruiting, tests, and offer discussions solely within text messaging apps (Telegram, Signal) with zero audio or video links.",
      prevention: "Reputable companies interview candidates on official video channels (Teams, Zoom, Google Meet)."
    },
    {
      title: "Identity Data Harvesting",
      warning: "Recruiters solicit bank details, credit card logins, tax records, or passport screenshots on the initial day before standard onboarding contracts.",
      prevention: "Private information is only requested inside highly secure HR portals (e.g. Workday, Rippling) *after* formal employment signoffs."
    }
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
          Defense Awareness Vault
        </h1>
        <p className="text-sm text-cyber-gray mt-2 font-medium">
          Defensive security manuals, recruitment scam indicators, and interactive self-scoring risk indexes.
        </p>
      </div>

      {/* Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Risk Calculator */}
        <div className="md:col-span-2 space-y-8">
          <Card glowColor="purple" className="p-8">
            <CardHeader className="mb-6">
              <div>
                <CardTitle className="text-lg uppercase tracking-tight">Active Scam Vulnerability Calculator</CardTitle>
                <CardDescription className="text-xs">Self-score recruiting sequences to identify potential cyberthreat vectors.</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              <label className="flex items-start gap-4 p-4 bg-[#050811] border border-cyber-border/80 rounded-2xl cursor-pointer hover:bg-white/3 transition-colors group">
                <input 
                  type="checkbox" 
                  checked={q1} 
                  onChange={() => setQ1(!q1)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-purple w-5 h-5 mt-0.5" 
                />
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Unreasonable Pay Benchmarks</p>
                  <p className="text-cyber-gray mt-1 leading-relaxed">Proposed wages or hourly pay rates significantly higher than standard domestic parameters (e.g. entry-level data input at $50/hr).</p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 bg-[#050811] border border-cyber-border/80 rounded-2xl cursor-pointer hover:bg-white/3 transition-colors group">
                <input 
                  type="checkbox" 
                  checked={q2} 
                  onChange={() => setQ2(!q2)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-purple w-5 h-5 mt-0.5" 
                />
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Text-Only Screenings</p>
                  <p className="text-cyber-gray mt-1 leading-relaxed">Recruiter workflows conducted exclusively over Telegram, Signal, WhatsApp, or chat rooms, completely avoiding voice/video verification.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 bg-[#050811] border border-cyber-border/80 rounded-2xl cursor-pointer hover:bg-white/3 transition-colors group">
                <input 
                  type="checkbox" 
                  checked={q3} 
                  onChange={() => setQ3(!q3)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-purple w-5 h-5 mt-0.5" 
                />
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Equipment / Purchase Demands</p>
                  <p className="text-cyber-gray mt-1 leading-relaxed">Demands to make payments for computer setups, visas, or background certifications to an approved vendor, claiming reimbursement.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 bg-[#050811] border border-cyber-border/80 rounded-2xl cursor-pointer hover:bg-white/3 transition-colors group">
                <input 
                  type="checkbox" 
                  checked={q4} 
                  onChange={() => setQ4(!q4)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-purple w-5 h-5 mt-0.5" 
                />
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Lookalike Communications Channels</p>
                  <p className="text-cyber-gray mt-1 leading-relaxed">Messages dispatched from free domains (@gmail.com, @outlook.com) or custom spoofed corporate domains (e.g. recruit-amazon-gulf.com).</p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 bg-[#050811] border border-cyber-border/80 rounded-2xl cursor-pointer hover:bg-white/3 transition-colors group">
                <input 
                  type="checkbox" 
                  checked={q5} 
                  onChange={() => setQ5(!q5)}
                  className="rounded bg-cyber-dark border-cyber-border text-cyber-purple w-5 h-5 mt-0.5" 
                />
                <div className="text-xs font-semibold">
                  <p className="font-bold text-white uppercase tracking-wide group-hover:text-cyber-glow transition-colors">Null Professional footprints</p>
                  <p className="text-cyber-gray mt-1 leading-relaxed">The recruiters have zero professional tracks on LinkedIn, or their team names are totally absent from official enterprise websites.</p>
                </div>
              </label>
            </div>

            <div className="mt-6 flex justify-between gap-4 border-t border-cyber-border/40 pt-6">
              <Button onClick={resetCalculator} variant="secondary" size="sm">
                Reset Parameters
              </Button>
              <Button onClick={calculateScamScore} variant="primary" size="sm">
                Evaluate Scam Index
              </Button>
            </div>
          </Card>

          {/* Scam types list */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight px-1">Common Phishing Signatures</h3>
            
            {scamTypes.map((type, idx) => (
              <Card key={idx} glowColor="none" className="p-6">
                <h4 className="text-base font-bold text-cyber-blue uppercase tracking-tight">{type.title}</h4>
                <div className="mt-3 text-xs font-semibold space-y-2.5 leading-relaxed">
                  <p className="text-cyber-gray">
                    <strong className="text-cyber-pink uppercase font-bold tracking-wider">Attack Vector: </strong>{type.warning}
                  </p>
                  <p className="text-cyber-gray">
                    <strong className="text-cyber-glow uppercase font-bold tracking-wider">Mitigation Safeguard: </strong>{type.prevention}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {calcScore !== null && (
            <Card glowColor={calcScore > 50 ? 'pink' : calcScore > 20 ? 'none' : 'green'} className="p-6 text-center space-y-4">
              <span className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Threat Index Score</span>
              <h3 className={`text-5xl font-black font-mono ${
                calcScore > 50 ? 'text-cyber-pink' : calcScore > 20 ? 'text-yellow-400' : 'text-cyber-glow'
              }`}>
                {calcScore}%
              </h3>
              <p className="text-xs text-cyber-gray font-semibold leading-relaxed">
                {calcScore > 50 
                  ? "CRITICAL ALERT: Extreme risk parameters detected. Terminate recruiting communications instantly." 
                  : calcScore > 20 
                  ? "WARNING: Moderate risk anomalies found. Demand a visual meeting and check corporate email domains." 
                  : "SAFE PARAMS: Clean recruiting checks. SafeHire still recommends scanning official PDF contracts."}
              </p>
            </Card>
          )}

          <Card glowColor="cyan" className="p-6">
            <CardTitle className="text-base uppercase tracking-tight mb-4">Critical Action Steps</CardTitle>
            
            <div className="space-y-5 text-xs leading-relaxed text-cyber-gray font-semibold">
              <div className="space-y-1">
                <p className="font-bold text-white uppercase tracking-wide">1. Secure Financial Vaults</p>
                <p className="text-[11px]">Inform banking fraud departments to freeze credit ratings or disputed check deposits immediately.</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-white uppercase tracking-wide">2. Dispatch Coalition Reports</p>
                <p className="text-[11px]">Register records with the Federal Trade Commission (FTC) at <a href="https://reportfraud.ftc.gov/" className="text-cyber-blue hover:underline">reportfraud.ftc.gov</a>.</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-white uppercase tracking-wide">3. Rotate Credentials keys</p>
                <p className="text-[11px]">Update credentials on email accounts or portfolios if they gained access via mock onboarding portals.</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AwarenessPage;
