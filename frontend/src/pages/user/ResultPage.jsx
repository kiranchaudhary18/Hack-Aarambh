import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, AlertOctagon, CornerUpLeft, 
  ExternalLink, Building, Mail, Globe, MapPin, Sparkles, Terminal
} from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ResultPage = () => {
  const navigate = useNavigate();

  // Simulated Result Parameters (Vercel-level visual clarity)
  const result = {
    companyName: "Chevron Gulf Petroleum (Spoofed Impersonator)",
    jobTitle: "Remote Logistics Data Analyst",
    threatScore: 89,
    verdict: "High Threat — Verified Recruitment Spoof",
    details: "This candidate offer presents strong signatures of Advance Fee check fraudulent activity. It uses lookalike domains, text-onlyTelegram interview patterns, and requests equipment vendor routing.",
    scamType: "Advance Equipment Fee Fraud",
    metadata: {
      domain: "chevron-recruiting-gulf.com",
      creationDate: "2026-05-24 (2 days ago)",
      registrar: "NameCheap (Highly suspicious for large corporations)",
      emailMatch: "FAILED (Sender was chevron@gmail.com, not corporate domain)"
    },
    redFlags: [
      "The contract requests you pay Zelle or Crypto to an 'approved vendor' for a laptop purchase, promising reimbursement.",
      "The entire interview sequence occurred inside a Telegram chat channel with zero visual/audio confirmation.",
      "The sender email address uses a free public address (@gmail.com) despite representing a multinational enterprise.",
      "The recruiting domain was bought less than 48 hours ago and lacks an active corporate track record."
    ]
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto relative z-10">
      
      {/* Title */}
      <div className="border-b border-cyber-border/40 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase">
            Forensics Scan Audit Report
          </h1>
          <p className="text-sm text-cyber-gray mt-2 font-medium">
            AI validation ledger for Incident <span className="font-mono text-cyber-blue font-bold">#SH-9021-2026</span>.
          </p>
        </div>

        <Button 
          onClick={() => navigate('/user/dashboard')} 
          variant="secondary" 
          size="sm"
          icon={CornerUpLeft}
        >
          Return to Terminal
        </Button>
      </div>

      {/* Main Grid: Score Widget Left, Factors Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Large Threat Gauge Dial */}
        <div className="md:col-span-1 space-y-6">
          <Card glowColor="pink" className="p-8 text-center flex flex-col items-center justify-center space-y-6">
            <span className="text-[10px] font-bold text-cyber-gray uppercase tracking-widest leading-none">Threat Index Rating</span>
            
            {/* SVG Circular Ring Gauge */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#ec4899" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * result.threatScore) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-5xl font-black text-white font-mono">{result.threatScore}%</span>
                <span className="block text-[8px] text-cyber-pink font-bold uppercase tracking-widest mt-1">Critical</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-cyber-pink uppercase leading-snug">{result.verdict}</h3>
              <p className="text-[10px] text-cyber-gray leading-relaxed font-semibold">
                High probability of credentials exploitation and financial fraud signatures. Stop writing.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Side: Overview Details */}
        <div className="md:col-span-2 space-y-6">
          <Card glowColor="purple" className="p-8">
            <div className="space-y-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-cyber-purple">Scanned Target Information</span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase leading-none">{result.companyName}</h2>
              <div className="flex items-center gap-2 text-xs text-cyber-gray font-semibold">
                <Building className="w-4 h-4 text-cyber-blue" />
                <span>Job Offer: {result.jobTitle}</span>
              </div>
              <hr className="border-cyber-border/40 my-4" />
              <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
                {result.details}
              </p>
            </div>
          </Card>
        </div>

        {/* DNS / Domain Credibility breakdown */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Card glowColor="none" className="p-6">
            <CardHeader className="mb-4">
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Ecosystem DNS Credibility</CardTitle>
                <CardDescription className="text-xs">Security parameter checks of communication addresses.</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-4 text-xs font-semibold text-cyber-gray">
              <div className="flex justify-between border-b border-cyber-border/40 pb-2.5">
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-cyber-blue" /> Domain</span>
                <span className="font-mono text-white">{result.metadata.domain}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border/40 pb-2.5">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyber-blue" /> Domain Registration</span>
                <span className="font-mono text-cyber-pink">{result.metadata.creationDate}</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border/40 pb-2.5">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-cyber-blue" /> Registrar Node</span>
                <span className="font-mono text-white">{result.metadata.registrar}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-cyber-blue" /> DNS alignment check</span>
                <span className="font-mono text-cyber-pink font-bold uppercase">{result.metadata.emailMatch}</span>
              </div>
            </div>
          </Card>

          {/* Core Action Mitigations */}
          <Card glowColor="cyan" className="p-6">
            <CardHeader className="mb-4">
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Active Safe Action checklist</CardTitle>
                <CardDescription className="text-xs">Required protection mitigation tasks for immediate execute.</CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3.5 text-xs text-cyber-gray font-semibold">
              <label className="flex items-start gap-3">
                <input type="checkbox" defaultChecked disabled className="rounded bg-cyber-dark border-cyber-border text-cyber-pink w-4 h-4 mt-0.5" />
                <span>Stop sending messages to recruiter instantly.</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" defaultChecked disabled className="rounded bg-cyber-dark border-cyber-border text-cyber-pink w-4 h-4 mt-0.5" />
                <span>Do not sign digital contract PDFs or return sensitive SSNs.</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" defaultChecked disabled className="rounded bg-cyber-dark border-cyber-border text-cyber-pink w-4 h-4 mt-0.5" />
                <span>Report the lookalike spoof to the Federal Trade Commission.</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Detailed Red Flag Breakdown */}
        <div className="md:col-span-3">
          <Card glowColor="pink" className="p-8">
            <CardHeader className="mb-6">
              <div>
                <CardTitle className="text-lg uppercase tracking-tight">AI Compliance Violations</CardTitle>
                <CardDescription className="text-xs">Linguistic, structural, and behavioral markers flagged during sandbox analysis.</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              {result.redFlags.map((flag, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#050811] border border-cyber-border/80 flex gap-4 items-start group hover:border-cyber-pink/40 transition-all duration-300">
                  <div className="p-2 bg-cyber-pink/10 text-cyber-pink rounded-xl border border-cyber-pink/20 font-bold shrink-0 font-mono text-xs">
                    [!]
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-white uppercase tracking-wide">Threat Anomaly #{idx + 1}</p>
                    <p className="text-cyber-gray leading-relaxed font-semibold">{flag}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-cyber-border/40 pt-6 mt-8">
              <span className="text-[10px] text-cyber-gray font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyber-blue" /> Machine Learning engine
              </span>
              <a 
                href="https://reportfraud.ftc.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="danger" size="sm" className="w-full font-bold uppercase tracking-wide" icon={ExternalLink}>
                  Report Spoof Incident
                </Button>
              </a>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;
