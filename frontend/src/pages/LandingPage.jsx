import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertOctagon, Terminal, Play, ArrowRight, 
  Cpu, FileWarning, Lock, UserX, Sparkles, Server, Activity,
  Database, Fingerprint, Eye, RefreshCw, ChevronDown, Check,
  Send, MessageSquare, Quote, Heart, Mail, HelpCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardTitle, CardDescription, CardHeader, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import gsap from 'gsap';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  // States for Interactive Demo & FAQ
  const [demoText, setDemoText] = useState("Hi there, I am the lead recruiter at Chevron Energy. We reviewed your resume on LinkedIn and are pleased to offer you a remote Data Analyst role starting at $65/hour. To purchase your home office equipment, we will mail you a check for $2,500. Please buy the items from our approved vendor via Zelle.");
  const [demoScanning, setDemoScanning] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [demoPhase, setDemoPhase] = useState("");
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Run the Live AI Detection simulation
  const handleRunDemo = () => {
    if (!demoText.trim()) return;
    setDemoScanning(true);
    setDemoResult(null);
    
    const phases = [
      "Decompressing characters and headers...",
      "Analyzing recruiter domain signatures...",
      "Parsing financial check parameters...",
      "Calculating global threat index..."
    ];

    setTimeout(() => setDemoPhase(phases[0]), 300);
    setTimeout(() => setDemoPhase(phases[1]), 900);
    setTimeout(() => setDemoPhase(phases[2]), 1600);
    setTimeout(() => setDemoPhase(phases[3]), 2200);

    setTimeout(() => {
      setDemoScanning(false);
      setDemoResult({
        score: 94,
        threat: "CRITICAL VECTOR DETECTED",
        verdict: "This letter is highly suspicious. It contains strong signatures of advance-fee laptop purchase scams, requests check Zelle transfers, and lacks corporate domain registration.",
        flags: [
          "Advance fee equipment purchase check ($2,500)",
          "Urgent demand for Zelle/Crypto transfer",
          "Lack of official corporate domain channels"
        ]
      });
    }, 2800);
  };

  // GSAP Entrance Animation (Only immediate mount timeline - no ScrollTrigger dependency to avoid stuck opacity:0 issues)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.hero-badge', { y: -30, opacity: 0, duration: 1 })
        .from('.hero-title', { y: 60, opacity: 0, duration: 1.2 }, '-=0.8')
        .from('.hero-desc', { y: 30, opacity: 0, duration: 1 }, '-=0.9')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.8')
        .from('.hero-illustration', { scale: 0.95, opacity: 0, duration: 1.5 }, '-=0.6')
        .from('.brand-logo', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, '-=0.8');
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: "Recruiter Identity Audit",
      desc: "Autonomously cross-references LinkedIn identifiers and active corporate records to verify the recruiter writing to you holds legitimate permissions.",
      icon: UserX,
      color: "pink",
    },
    {
      title: "PDF Metadata Validation",
      desc: "Deconstructs contract offer sheets inside secure sandboxes, isolating spoofed digital stamps, embedded tracking links, and hidden payloads.",
      icon: FileWarning,
      color: "cyan",
    },
    {
      title: "Salary Anomaly Check",
      desc: "Evaluates compensation indexes against real-time global benchmarks to isolate entry-level roles offering highly inflated rates designed to bait applicants.",
      icon: Terminal,
      color: "purple",
    },
    {
      title: "DNS Spoofing Verification",
      desc: "Queries sender email structures against 100,000+ domain directories, lookalike brand variations, and recently registered malicious nodes.",
      icon: Lock,
      color: "green",
    },
    {
      title: "AI Semantic Scan",
      desc: "Scrapes conversational structures for pressure language, suspicious equipment checks, cryptocurrency requests, and grammar anomalies.",
      icon: Cpu,
      color: "cyan",
    }
  ];

  const trustedCompanies = [
    { name: "Google Cloud", logo: "Google Cloud" },
    { name: "Netflix", logo: "Netflix" },
    { name: "Stripe", logo: "Stripe" },
    { name: "Meta Security", logo: "Meta Security" },
    { name: "Amazon AWS", logo: "Amazon Web Services" }
  ];

  const workflowSteps = [
    {
      num: "01",
      title: "Deposit Communications",
      desc: "Drag and drop a recruiting contract PDF or paste suspicious message structures directly into our Sandbox inspect console."
    },
    {
      num: "02",
      title: "AI Analysis Audit",
      desc: "SafeHire's multi-layered machine learning model conducts sandboxed metadata parses, lookalike domain audits, and financial validation checks."
    },
    {
      num: "03",
      title: "Cryptographic Threat Report",
      desc: "Obtain a complete cryptographic score briefing, isolating critical violation red-flags, DNS reports, and mitigative action items."
    }
  ];

  const faqItems = [
    {
      q: "How does SafeHire differentiate between real and spoofed recruiting domains?",
      a: "Our system queries domain WHOIS records, SSL parameters, registration age (scam domains are typically under 30 days old), and lookalike strings (e.g. Meta vs Meta-Hiring-Team.com) using our live network intelligence datastore."
    },
    {
      q: "Are my uploaded PDFs or contract details kept completely secure?",
      a: "Yes. All processing is isolated inside stateless, sandboxed virtual machines. SafeHire encrypts and shreds all uploaded documents immediately after compiling your threat score. We never store personal identity records."
    },
    {
      q: "Can SafeHire AI identify advance-fee equipment purchase check scams?",
      a: "Absolutely. Our linguistic engine recognizes semantic structures asking candidates to pay Zelle/Crypto to 'approved vendors' under the promise of check reimbursement—which is the absolute #1 recruiting scam signature globally."
    },
    {
      q: "Is there a standard browser extension or email addon for candidates?",
      a: "SafeHire AI operates as a responsive web dashboard app, easily accessible on both desktop and mobile networks. We are currently rolling out custom email plug-ins for Outlook and Gmail."
    }
  ];

  const testimonials = [
    {
      quote: "SafeHire saved me from a $3,500 fake equipment scam. I uploaded a logistics analyst contract PDF, and the engine isolated a 12-hour-old spoof domain register in Namecheap.",
      author: "Marcus Vance",
      role: "Logistics Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "The interface is absolutely flawless, Vercel-level SaaS beauty. The Scam Calculator identified lookalike email signatures instantly. Essential protection tool for job hunters.",
      author: "Clara Reynolds",
      role: "Creative UI Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    },
    {
      quote: "As an administrative system auditor, I'm blown away by the lookalike domain checks and WHOIS parameter scrapers. Extremely high precision scanner engine.",
      author: "David Chen",
      role: "Director of Cybersecurity Operations",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
    }
  ];

  return (
    <div ref={pageRef} className="relative w-full overflow-hidden min-h-screen">
      
      {/* Visual Ambient Blur Blobs */}
      <div className="ambient-blob blur-blob blob-cyan absolute top-[5%] left-[-10%] w-[500px] h-[500px]" />
      <div className="ambient-blob blur-blob blob-purple absolute top-[25%] right-[-10%] w-[600px] h-[600px]" />
      <div className="ambient-blob blur-blob blob-pink absolute bottom-[30%] left-[10%] w-[500px] h-[500px]" />
      <div className="ambient-blob blur-blob blob-cyan absolute bottom-[5%] right-[-5%] w-[600px] h-[600px]" />

      <div className="particles-decor" />

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto pt-32 pb-20 px-6 md:px-12 flex flex-col items-center text-center relative z-10">
        
        {/* Futuristic Cyber Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-blue/10 border border-cyber-blue/25 text-cyber-blue text-xs font-bold uppercase tracking-widest mb-8 animate-neon-pulse">
          <Cpu className="w-3.5 h-3.5 text-cyber-glow" />
          <span className="flex items-center gap-1.5 font-sans">
            AI-Powered Recruiting Defense <Sparkles className="w-3 h-3 text-cyber-glow" />
          </span>
        </div>

        {/* Large Bold Heading */}
        <h1 className="hero-title text-4xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-none mb-8 uppercase font-sans">
          Audit Suspicious <br />
          <span className="bg-gradient-to-r from-cyber-blue via-cyber-glow to-cyber-purple bg-clip-text text-transparent">
            Job Offers
          </span>
        </h1>

        {/* Minimal premium text description */}
        <p className="hero-desc text-base sm:text-lg md:text-xl text-cyber-gray max-w-3xl mb-12 leading-relaxed font-medium">
          Recruitment phishing, lookalike corporate domains, and identity harvesting scams have reached critical limits. SafeHire AI sandboxes offer PDFs and recruit copy to verify security integrity.
        </p>

        {/* Hero CTA buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center gap-4 mb-20 relative z-20">
          <Button 
            onClick={() => navigate('/user/analyze')} 
            variant="primary" 
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            Deploy AI Inspect Node
          </Button>
          <Button 
            onClick={() => navigate('/user/awareness')} 
            variant="secondary" 
            size="lg"
            icon={Play}
          >
            Scam Vulnerability calculator
          </Button>
        </div>

        {/* Huge Cybersecurity Illustration Component (Glass Dashboard Preview) */}
        <div className="hero-illustration w-full max-w-5xl animate-float mb-20">
          <Card glowColor="purple" className="p-8 md:p-10 border-cyber-purple/20">
            <div className="flex flex-col lg:flex-row items-stretch gap-10 text-left">
              <div className="space-y-6 flex flex-col justify-between max-w-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyber-pink animate-ping shrink-0" />
                    <span className="text-[10px] font-bold text-cyber-gray uppercase tracking-widest font-mono">Real-Time Integrity Threat Audits</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight uppercase leading-none">Security Sandbox Inspection</h3>
                  <p className="text-xs text-cyber-gray leading-relaxed font-semibold">
                    SafeHire performs advanced metadata extraction, checking registrar lifetimes, lookup corporate addresses, and check equipment funds vectors inside safe stateless environments.
                  </p>
                </div>

                {/* Mini Stats inside illustration */}
                <div className="grid grid-cols-2 gap-4 border-t border-cyber-border/40 pt-6">
                  <div>
                    <p className="text-[9px] font-bold text-cyber-gray uppercase tracking-widest leading-none">Scans Completed</p>
                    <p className="text-2xl font-black text-white font-mono mt-1.5">28,430</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-cyber-gray uppercase tracking-widest leading-none">Threat Accuracy</p>
                    <p className="text-2xl font-black text-cyber-glow font-mono mt-1.5">99.6%</p>
                  </div>
                </div>
              </div>

              {/* Simulation console screen */}
              <div className="flex-1 rounded-2xl bg-[#03060c] border border-cyber-border/80 p-5 font-mono text-[10px] sm:text-xs text-cyber-gray relative overflow-hidden flex flex-col justify-between h-72 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between border-b border-cyber-border/30 pb-2 mb-3">
                    <span className="text-cyber-glow flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> inspect_terminal.sh</span>
                    <span className="text-[9px] font-mono text-cyber-gray/70">SECURE SHELL</span>
                  </div>
                  <p className="text-cyber-glow">{"$ safehire verify --file Chevron_Offer.pdf"}</p>
                  <p className="text-white">{"[+] Decompressing PDF packet blocks..."}</p>
                  <p className="text-cyber-blue">{"[i] Registrar Domain Audit: chevron-recruiter-gulf.com"}</p>
                  <p className="text-cyber-pink">{"[!] Anomaly: Domain registered 48 hours ago (Suspect lookalike)"}</p>
                  <p className="text-white">{"[+] Searching financial equipment checklists..."}</p>
                  <p className="text-cyber-pink animate-pulse">{"[!] Anomaly detected: Demands check payment via Zelle for vendor"}</p>
                  <p className="text-red-500 font-extrabold uppercase mt-2">{"[CRITICAL] ADVANCE FEE CHECK PHISHING DETECTED [97%]"}</p>
                </div>
                <div className="flex justify-between text-[9px] text-cyber-gray/50 relative z-10 pt-3 border-t border-cyber-border/30">
                  <span>SSL STATUS: VALID</span>
                  <span>IP NODES: 8.8.8.8</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </section>

      {/* 2. Trusted Companies Bar */}
      <section className="border-t border-b border-cyber-border/40 bg-cyber-navy/20 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-cyber-gray uppercase tracking-widest mb-6">Auditing Threat Data Globally Alongside Teams At</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {trustedCompanies.map((comp, idx) => (
              <div 
                key={idx} 
                className="brand-logo px-6 py-2.5 rounded-xl border border-cyber-border/80 bg-white/2 hover:border-cyber-blue/35 transition-all text-xs font-bold text-cyber-gray uppercase tracking-widest font-mono select-none"
              >
                {comp.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="features-grid-section py-28 relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-purple">AI Core Safeguards</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none">Forensic Validation Channels</h2>
          <p className="text-xs text-cyber-gray max-w-md mx-auto font-semibold leading-relaxed">
            Multi-layered inspection nodes scanning domains, salary benchmarks, and document metadata structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: 'easeOut' }}
              >
                <Card 
                  glowColor={feat.color} 
                  className="feat-card-landing text-left p-6 h-full"
                >
                  <div className="space-y-4">
                    <div className={`p-3 bg-[#050811] border border-cyber-border rounded-xl w-fit ${
                      feat.color === 'cyan' ? 'text-cyber-blue' :
                      feat.color === 'purple' ? 'text-cyber-purple' :
                      feat.color === 'pink' ? 'text-cyber-pink' :
                      'text-cyber-glow'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg uppercase tracking-tight">{feat.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed font-semibold">
                      {feat.desc}
                    </CardDescription>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="workflow-section py-28 border-t border-b border-cyber-border/40 bg-cyber-navy/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center mb-20 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-purple">Verification Pipeline</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none">Audit Sandbox Workflow</h2>
            <p className="text-xs text-cyber-gray max-w-md mx-auto font-semibold leading-relaxed">
              SafeHire audits suspicious recruiting files and emails through three simple automated phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {workflowSteps.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: 'easeOut' }}
                className="workflow-step relative flex flex-col justify-between p-8 rounded-3xl bg-[#050811] border border-cyber-border hover:border-cyber-blue/35 transition-all duration-300 group h-80 shadow-2xl"
              >
                {/* Visual Connector Line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-[1px] bg-cyber-border/80 z-0 pointer-events-none" />
                )}
                
                <span className="text-4xl font-black font-mono bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">{step.num}</span>
                
                <div className="space-y-3 mt-8">
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-cyber-blue transition-colors">{step.title}</h4>
                  <p className="text-xs text-cyber-gray leading-relaxed font-semibold">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. AI Detection Demo Section (Playground on Landing!) */}
      <section className="py-28 max-w-5xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-purple">Inspect Sandbox Playground</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none">Live AI Verification Sandbox</h2>
          <p className="text-xs text-cyber-gray max-w-md mx-auto font-semibold leading-relaxed">
            Paste recruiter letters, visa payment clauses, or check demands to watch our threat detection algorithms verify scams live.
          </p>
        </div>

        <Card glowColor="cyan" className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Input field */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="relative">
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  placeholder="Paste recruiting copy details here..."
                  className="w-full h-56 px-4 py-4 bg-[#050811] text-white rounded-xl border border-cyber-border/80 focus:border-cyber-blue/50 focus:outline-none transition-all font-mono text-xs placeholder:text-gray-700 leading-relaxed"
                />
                <div className="absolute bottom-3 right-3 text-[9px] text-cyber-gray uppercase font-bold tracking-widest font-mono bg-[#03060c] px-2.5 py-1.5 rounded-lg border border-cyber-border">
                  Interactive Demo
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleRunDemo} 
                  variant="primary" 
                  size="md"
                  loading={demoScanning}
                  icon={Play}
                >
                  Analyze Text Copy
                </Button>
              </div>
            </div>

            {/* Simulated Live Output Screen */}
            <div className="rounded-2xl bg-[#03060c] border border-cyber-border/80 p-5 font-mono text-xs text-cyber-gray flex flex-col justify-between min-h-[224px] shadow-2xl relative overflow-hidden">
              {demoScanning ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                  <RefreshCw className="w-8 h-8 text-cyber-blue animate-spin text-cyber-glow" />
                  <p className="text-[10px] text-cyber-glow font-bold uppercase tracking-wider animate-pulse">{demoPhase}</p>
                </div>
              ) : demoResult ? (
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center border-b border-cyber-border/30 pb-2.5">
                    <span className="text-cyber-pink font-bold flex items-center gap-1.5 uppercase"><AlertOctagon className="w-4 h-4 animate-pulse" /> {demoResult.threat}</span>
                    <span className="text-[10px] font-bold text-cyber-pink bg-cyber-pink/15 px-2 py-0.5 rounded border border-cyber-pink/30 font-mono">{demoResult.score}% Threat Score</span>
                  </div>

                  <p className="text-[11px] text-white leading-relaxed font-semibold">{demoResult.verdict}</p>

                  <div className="space-y-2 border-t border-cyber-border/30 pt-3">
                    <p className="text-[9px] font-bold text-cyber-gray uppercase tracking-widest">Isolated Violations</p>
                    <ul className="space-y-1.5 text-[10px] text-cyber-gray font-semibold">
                      {demoResult.flags.map((flag, idx) => (
                        <li key={idx} className="flex gap-2 leading-none">
                          <span className="text-cyber-pink font-bold">[!]</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <Terminal className="w-8 h-8 text-cyber-gray/40" />
                  <p className="text-[10px] text-cyber-gray font-bold uppercase tracking-wider">Inspect sandbox is idle. Paste details and execute scan.</p>
                </div>
              )}

              <div className="flex justify-between border-t border-cyber-border/30 pt-3 mt-4 text-[9px] text-cyber-gray/50">
                <span>ANALYZER: SH-V2.0</span>
                <span>STATUS: READY</span>
              </div>
            </div>

          </div>
        </Card>
      </section>

      {/* 6. Scam Statistics Section */}
      <section className="stats-section py-28 border-t border-cyber-border/40 bg-cyber-navy/20 relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-purple">Scam Prevalence</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none">Global Scam Epidemic Metrics</h2>
          <p className="text-xs text-cyber-gray max-w-md mx-auto font-semibold leading-relaxed">
            Statistics compiled from federal reporting registries logging job recruitment identity fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card glowColor="pink" className="stat-card-landing p-8 text-center flex flex-col justify-between h-48">
              <span className="text-[10px] text-cyber-gray font-bold uppercase tracking-widest">Federal Reports (FTC)</span>
              <h3 className="text-4xl sm:text-5xl font-black text-cyber-pink font-mono mt-4">$360M+</h3>
              <p className="text-xs text-cyber-gray font-semibold mt-4 leading-normal">Losses compiled annually from job spoofing.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card glowColor="purple" className="stat-card-landing p-8 text-center flex flex-col justify-between h-48">
              <span className="text-[10px] text-cyber-gray font-bold uppercase tracking-widest font-sans">Active Target Age</span>
              <h3 className="text-4xl sm:text-5xl font-black text-white font-mono mt-4">18 - 29</h3>
              <p className="text-xs text-cyber-gray font-semibold mt-4 leading-normal">Age brackets highly vulnerable to remote recruit traps.</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card glowColor="cyan" className="stat-card-landing p-8 text-center flex flex-col justify-between h-48">
              <span className="text-[10px] text-cyber-gray font-bold uppercase tracking-widest">Scam Vector Ratio</span>
              <h3 className="text-4xl sm:text-5xl font-black text-cyber-blue font-mono mt-4">84%</h3>
              <p className="text-xs text-cyber-gray font-semibold mt-4 leading-normal">Attacks requesting equipment buy check Zelle/crypto routing.</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-28 max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-purple">Candidate Reviews</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none">Shielded Candidate testimonials</h2>
          <p className="text-xs text-cyber-gray max-w-md mx-auto font-semibold leading-relaxed">
            Reviews from professionals safeguarded against credential theft by SafeHire AI threat checkers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <Card key={idx} glowColor="none" className="p-6 flex flex-col justify-between h-80 border-cyber-border hover:border-cyber-blue/30 transition-all">
              <div className="space-y-4">
                <Quote className="w-6 h-6 text-cyber-blue" />
                <p className="text-xs text-cyber-gray font-semibold leading-relaxed">"{test.quote}"</p>
              </div>

              <div className="flex items-center gap-3.5 border-t border-cyber-border/40 pt-4 mt-6">
                <img 
                  src={test.avatar} 
                  alt={test.author} 
                  className="w-10 h-10 rounded-xl border border-cyber-blue/20 object-cover" 
                />
                <div className="text-left leading-tight">
                  <p className="text-xs font-bold text-white uppercase">{test.author}</p>
                  <p className="text-[10px] text-cyber-gray font-semibold mt-0.5">{test.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-28 border-t border-cyber-border/40 bg-cyber-navy/20 relative z-10 max-w-4xl mx-auto px-6 rounded-30px mb-20">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-purple">Have Questions?</span>
          <h2 className="text-3xl font-black text-white uppercase leading-none">Frequently Answered Queries</h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = faqOpen[idx];
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-cyber-border/80 bg-[#050811]/90 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                >
                  <span className="text-xs font-bold uppercase text-white group-hover:text-cyber-glow transition-colors">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-cyber-gray transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyber-glow' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-cyber-gray leading-relaxed font-semibold border-t border-cyber-border/40 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
