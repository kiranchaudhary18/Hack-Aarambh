import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ShieldAlert, Sparkles, Plus, Clock, HelpCircle, 
  Search, Eye, ChevronRight, Activity, Calendar, ArrowRight,
  TrendingUp, Terminal, Zap, ShieldQuestion, Server, CheckCircle,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { mockStatistics, mockJobOffers } from '../../mock/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, BarChart, Bar 
} from 'recharts';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simulated stats counters for absolute wow-factor
  const [totalScans, setTotalScans] = useState(0);
  const [scamsDetected, setScamsDetected] = useState(0);
  const [safeOffers, setSafeOffers] = useState(0);
  const [riskRate, setRiskRate] = useState(0);

  useEffect(() => {
    // Dynamic simulated count-up animation on mount
    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setTotalScans(Math.floor((24 / steps) * step));
      setScamsDetected(Math.floor((4 / steps) * step));
      setSafeOffers(Math.floor((20 / steps) * step));
      setRiskRate(parseFloat(((16.6 / steps) * step).toFixed(1)));

      if (step >= steps) {
        clearInterval(timer);
        setTotalScans(24);
        setScamsDetected(4);
        setSafeOffers(20);
        setRiskRate(16.6);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleOpenDetails = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const aiInsights = [
    { id: 1, type: 'critical', text: 'Lookalike registrar spikes detected impersonating Chevron Energy HR. Avoid Chevron-Gulf domain mails.' },
    { id: 2, type: 'warning', text: 'Spam pattern identified in remote junior dev contracts demanding Telegram chat transfers.' },
    { id: 3, type: 'secure', text: 'Machine learning model SH-V2 successfully integrated with 99.6% audit verification precision.' }
  ];

  const securityTips = [
    { title: 'Validate DNS Registrars', desc: 'Legitimate corporate domains carry years of WHOIS records. Scam nodes are typically under 30 days old.' },
    { title: 'Isolate Offer Attachments', desc: 'Scan contract offer PDF structures inside isolated sandbox cells to bypass hidden spyware stamps.' },
    { title: 'Identify Financial Check Baits', desc: 'Never accept check reimbursement setups via Zelle, Zapple, or cryptocurrency for remote workspace gears.' }
  ];

  const liveActivity = [
    { node: 'Mumbai Node', desc: 'File clearance verified successfully', status: 'safe', time: '1m ago' },
    { node: 'Dublin Node', desc: 'Critical check phishing vector isolated', status: 'threat', time: '4m ago' },
    { node: 'Chicago Node', desc: 'DNS lookalike mismatch registered', status: 'threat', time: '12m ago' },
    { node: 'Tokyo Node', desc: 'Recruiter credential check passed', status: 'safe', time: '18m ago' }
  ];

  const accuracyGraphData = [
    { week: 'W1', accuracy: 98.4 },
    { week: 'W2', accuracy: 98.9 },
    { week: 'W3', accuracy: 99.2 },
    { week: 'W4', accuracy: 99.6 }
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto relative z-10 text-left select-none">
      
      {/* 1. Welcome Glass Banner with Quick Analyze Trigger */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-cyber-blue/10 via-cyber-purple/5 to-transparent border border-cyber-border/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(0,242,254,0.05)]"
      >
        <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/15 border border-cyber-blue/20 text-cyber-blue text-[9px] font-bold uppercase tracking-widest animate-pulse">
            <Zap className="w-3 h-3 text-cyber-glow" /> System Protection Active: 100%
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none font-sans">
            Welcome back, Alex Rivera
          </h2>
          <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
            SafeHire AI sandbox scanners are monitoring global recruitment domain records. Avoid check equipment and Telegram chat schemes with direct inspections.
          </p>
        </div>

        <Button 
          onClick={() => navigate('/user/analyze')} 
          variant="primary" 
          size="lg"
          icon={Plus}
          className="shrink-0 shadow-[0_0_20px_rgba(0,242,254,0.25)] hover:scale-105 transition-all"
        >
          Quick Analyze Offer
        </Button>
      </motion.div>

      {/* 2. Premium Metric Cards Row with Counter Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card glowColor="purple" className="p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-widest font-mono">Total Offers Audited</p>
              <h3 className="text-3xl font-black text-white font-mono mt-1">{totalScans} Scans</h3>
            </div>
            <div className="p-3 bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/25 rounded-2xl">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-cyber-glow font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> <span>Ecosystem secure</span>
          </div>
        </Card>

        <Card glowColor="pink" className="p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-widest font-mono">Critical Warnings</p>
              <h3 className="text-3xl font-black text-cyber-pink font-mono mt-1">{scamsDetected} Scams</h3>
            </div>
            <div className="p-3 bg-cyber-pink/15 text-cyber-pink border border-cyber-pink/25 rounded-2xl">
              <ShieldAlert className="w-5.5 h-5.5 animate-pulse" />
            </div>
          </div>
          <p className="text-[9px] text-cyber-pink font-bold mt-4 uppercase tracking-wider font-mono">Check/Zelle traps bypassed</p>
        </Card>

        <Card glowColor="green" className="p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-widest font-mono">Verified Safe Offers</p>
              <h3 className="text-3xl font-black text-white font-mono mt-1">{safeOffers} Valid</h3>
            </div>
            <div className="p-3 bg-cyber-glow/10 text-cyber-glow border border-cyber-glow/20 rounded-2xl">
              <CheckCircle className="w-5.5 h-5.5" />
            </div>
          </div>
          <p className="text-[9px] text-cyber-gray font-bold mt-4 uppercase font-mono">Credibility verified</p>
        </Card>

        <Card glowColor="purple" className="p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[9px] text-cyber-gray font-bold uppercase tracking-widest font-mono">Global Risk Rate</p>
              <h3 className="text-3xl font-black text-cyber-purple font-mono mt-1">{riskRate}%</h3>
            </div>
            <div className="p-3 bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/25 rounded-2xl">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
          </div>
          <p className="text-[9px] text-cyber-purple font-bold mt-4 uppercase font-mono">Low Vulnerability score</p>
        </Card>

      </div>

      {/* 3. Deep Scam Analytics & Multi-Chart Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly scan ledger trend area chart */}
        <div className="lg:col-span-2">
          <Card glowColor="cyan" className="p-6 h-96 flex flex-col justify-between">
            <CardHeader className="mb-4">
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Active Scan Volatility ledger</CardTitle>
                <CardDescription className="text-xs">Dynamic check timeline tracking scanner calls weekly.</CardDescription>
              </div>
            </CardHeader>

            <div className="w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockStatistics.dailyScans} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyberBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#050811', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                  <Area type="monotone" dataKey="scans" stroke="#00f2fe" strokeWidth={3} fillOpacity={1} fill="url(#cyberBlue)" name="Scans Completed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* AI Model Precision / Accuracy Chart */}
        <div className="lg:col-span-1">
          <Card glowColor="pink" className="p-6 h-96 flex flex-col justify-between">
            <CardHeader className="mb-4">
              <div>
                <CardTitle className="text-base uppercase tracking-tight font-sans">AI Detection Accuracy</CardTitle>
                <CardDescription className="text-xs">Dynamic validation precision index logs.</CardDescription>
              </div>
            </CardHeader>

            <div className="w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[95, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#050811', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#ff2a5f" strokeWidth={3} activeDot={{ r: 6 }} name="Model Accuracy (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>

      {/* 4. Split Layout: AI Insights, Security Tips & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI insights panel */}
        <Card glowColor="purple" className="p-6 flex flex-col justify-between h-96">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyber-purple shrink-0" />
              <div>
                <CardTitle className="text-base uppercase tracking-tight">AI Protection Insights</CardTitle>
                <CardDescription className="text-xs">Contextual alerts compiled by core classifier models.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {aiInsights.map((ins) => (
              <div 
                key={ins.id} 
                className={`p-3.5 rounded-2xl text-[11px] leading-relaxed font-semibold border ${
                  ins.type === 'critical' ? 'bg-cyber-pink/5 border-cyber-pink/20 text-cyber-gray' :
                  ins.type === 'warning' ? 'bg-orange-500/5 border-orange-500/20 text-cyber-gray' :
                  'bg-cyber-blue/5 border-cyber-blue/20 text-cyber-gray'
                }`}
              >
                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mr-1.5 ${
                  ins.type === 'critical' ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' :
                  ins.type === 'warning' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                }`}>
                  {ins.type}
                </span>
                {ins.text}
              </div>
            ))}
          </div>
        </Card>

        {/* Security Tips carousel grid */}
        <Card glowColor="none" className="p-6 flex flex-col justify-between h-96 border-cyber-border/80">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <ShieldQuestion className="w-5 h-5 text-cyber-blue shrink-0" />
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Candidate Security Tips</CardTitle>
                <CardDescription className="text-xs">Core defense pathways to bypass recruiting traps.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {securityTips.map((tip, idx) => (
              <div key={idx} className="p-3 bg-[#03060c]/60 border border-cyber-border/50 rounded-2xl text-left space-y-1">
                <h5 className="text-xs font-bold text-white uppercase">{tip.title}</h5>
                <p className="text-[10px] text-cyber-gray font-semibold leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Live global activity feed stream */}
        <Card glowColor="none" className="p-6 flex flex-col justify-between h-96 border-cyber-border/80">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyber-glow shrink-0 animate-pulse" />
              <div>
                <CardTitle className="text-base uppercase tracking-tight">Live Threat Stream Feed</CardTitle>
                <CardDescription className="text-xs">Scanners processed across edge nodes.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {liveActivity.map((act, idx) => (
              <div key={idx} className="flex justify-between items-center gap-3 border-b border-cyber-border/20 pb-3 last:border-b-0 text-[10px] font-semibold">
                <div className="space-y-0.5">
                  <p className="font-mono font-bold text-white flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${act.status === 'safe' ? 'bg-cyber-glow animate-ping' : 'bg-cyber-pink animate-ping'}`} />
                    {act.node}
                  </p>
                  <p className="text-cyber-gray/80">{act.desc}</p>
                </div>
                <span className="text-[9px] text-cyber-gray font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* 5. Centralized Scan History ledgers table */}
      <Card glowColor="purple" className="p-6">
        <CardHeader className="mb-6">
          <div>
            <CardTitle className="text-base uppercase tracking-tight">Ecosystem Incidents ledger</CardTitle>
            <CardDescription className="text-xs">Archived recruiting audits verified by core deep learning nodes.</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cyber-border/40 text-cyber-gray font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Designated Role</th>
                <th className="pb-3">Impersonated Entity</th>
                <th className="pb-3">Scanned Date</th>
                <th className="pb-3">Threat Rating Index</th>
                <th className="pb-3">AI Verdict</th>
                <th className="pb-3 pr-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/20">
              {mockJobOffers.map((offer) => (
                <tr 
                  key={offer.id} 
                  className="hover:bg-white/5 transition-all duration-200 group cursor-pointer"
                  onClick={() => handleOpenDetails(offer)}
                >
                  <td className="py-4 pl-2 font-bold text-white">
                    {offer.jobTitle}
                  </td>
                  <td className="py-4 text-cyber-gray font-semibold">
                    {offer.companyName}
                  </td>
                  <td className="py-4 text-cyber-gray/70 font-mono">
                    {offer.scannedAt}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            offer.fraudProbability > 75 ? 'bg-cyber-pink' :
                            offer.fraudProbability > 30 ? 'bg-yellow-400' : 'bg-cyber-glow'
                          }`} 
                          style={{ width: `${offer.fraudProbability}%` }}
                        />
                      </div>
                      <span className={`font-bold font-mono ${
                        offer.fraudProbability > 75 ? 'text-cyber-pink' :
                        offer.fraudProbability > 30 ? 'text-yellow-400' : 'text-cyber-glow'
                      }`}>{offer.fraudProbability}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      offer.status === 'scam' ? 'bg-cyber-pink/25 text-cyber-pink border border-cyber-pink/30' :
                      offer.status === 'suspicious' ? 'bg-yellow-500/25 text-yellow-400 border border-yellow-500/30' :
                      'bg-cyber-glow/20 text-cyber-glow border border-cyber-glow/30'
                    }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenDetails(offer); }}
                      className="p-1.5 rounded-lg bg-white/5 border border-cyber-border hover:border-cyber-blue hover:text-cyber-glow transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Case Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Forensic Audit File Details"
      >
        {selectedOffer && (
          <div className="space-y-6 text-left font-sans">
            <div className="flex justify-between items-start gap-4 p-4 rounded-xl bg-white/5 border border-cyber-border">
              <div>
                <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Target Entity</p>
                <p className="text-lg font-bold text-white uppercase">{selectedOffer.companyName}</p>
                <p className="text-xs text-cyber-gray mt-0.5">{selectedOffer.jobTitle}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Scam Probability</p>
                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${
                  selectedOffer.fraudProbability > 70 ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30' :
                  selectedOffer.fraudProbability > 30 ? 'bg-yellow-500/25 text-yellow-400 border border-yellow-500/30' :
                  'bg-cyber-glow/20 text-cyber-glow border border-cyber-glow/30'
                }`}>
                  {selectedOffer.fraudProbability}% Index
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-cyber-blue uppercase tracking-widest font-sans">Identified Threat Factors</h5>
              <div className="space-y-2.5">
                {selectedOffer.analysis && selectedOffer.analysis.flags ? (
                  selectedOffer.analysis.flags.map((flag, idx) => (
                    <div key={idx} className="p-3 bg-cyber-pink/5 border border-cyber-pink/15 rounded-xl text-xs text-cyber-gray flex gap-2.5 items-start">
                      <span className="text-cyber-pink font-bold text-sm shrink-0 leading-none">!</span>
                      <span className="leading-normal font-semibold">{flag}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-cyber-gray font-semibold">No critical red flags detected inside embedded signatures.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cyber-border">
              <Button 
                onClick={() => { setIsModalOpen(false); navigate('/user/result'); }} 
                variant="primary" 
                size="sm"
                icon={ChevronRight}
                iconPosition="right"
              >
                Inspect Threat Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
