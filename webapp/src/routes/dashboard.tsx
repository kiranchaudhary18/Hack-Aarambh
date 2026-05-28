import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { recentChecks } from "@/lib/mockData";
import { useState, useEffect, useRef } from "react";
import { 
  ScanSearch, ArrowRight, TrendingUp, ShieldAlert, ShieldCheck, Sparkles, 
  FileText, Link2, AlertTriangle, Flame, Target, DollarSign, Activity, 
  Shield, Check, User, Info, Terminal, TrendingDown
} from "lucide-react";
import { gsap } from "gsap";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ 
    meta: [
      { title: "AI Threat Control Center — ScamSniff" }, 
      { name: "description", content: "ScamSniff premium cybersecurity threat detection control dashboard." }
    ] 
  }),
  component: Dashboard,
});

function Dashboard() {
  const scamCount = recentChecks.filter((c) => c.verdict === "scam").length;
  
  // Custom interactive state variables
  const [activeTab, setActiveTab] = useState("all");
  const [scannedOffers, setScannedOffers] = useState(12);
  const [liveLog, setLiveLog] = useState("Neural core online. Secure telemetry listening...");
  
  // Refs for animations
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  // Stagger reveal on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in main dashboard content
      gsap.fromTo(".dashboard-fade > *", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }
      );
      
      // Infinite slow floating for warning elements
      gsap.to(".tip-alert-badge", {
        y: -5,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Shimmer effects on stats card badges
      gsap.to(".glowing-pulse-indicator", {
        scale: 1.15,
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }, mainRef);

    // Rotate simulated live active logs
    const logs = [
      "Securing connection pipeline...",
      "Analyzing recent audit vectors...",
      "No memory leaks detected. Sandbox clean.",
      "Neural threat database synchronized with cloud gateway.",
      "Scanning thread active on browser telemetry port."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % logs.length;
      setLiveLog(logs[idx]);
    }, 5500);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  // CTA Button Magnetic hover
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleCtaMouseLeave = () => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  };

  // Filter Checks by verdict
  const filteredChecks = recentChecks.filter(check => {
    if (activeTab === "all") return true;
    return check.verdict === activeTab;
  });

  return (
    <div className="relative h-screen overflow-hidden bg-[oklch(0.97_0.018_95)] font-space">
      
      {/* Background blobs & grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        {/* Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40M40 0L40 40' fill='none' stroke='%236200B9' stroke-width='1'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Ambient drift colors */}
        <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] rounded-full bg-[oklch(0.82_0.1_295/0.18)] filter blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[380px] h-[380px] rounded-full bg-[oklch(0.85_0.12_70/0.18)] filter blur-[90px]" />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1440px] gap-6 p-4 sm:p-5 lg:p-6 z-10">
        
        {/* Left Side: Premium Floating Glass Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main ref={mainRef} className="hide-scrollbar min-w-0 flex-1 space-y-5 lg:space-y-6 overflow-y-auto pr-1 pb-6 relative">
          
          <div className="dashboard-fade space-y-5 lg:space-y-6">
            
            {/* Header / Premium Hero Control Center */}
            <div 
              ref={heroRef}
              className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.1),_inset_0_2px_4px_rgba(255,255,255,0.95)] flex flex-col md:flex-row md:items-center justify-between gap-5 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Internal abstract gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.18_295)] to-transparent opacity-40" />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-[10px] font-extrabold uppercase text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.15)] flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" /> Neural Core Active
                  </span>
                  
                  {/* Protection state live indicator */}
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-500/10">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Live Shield Active
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight">
                  Control Center
                </h1>

                {/* AI Assistant Greeting */}
                <div className="flex items-center gap-2 bg-purple-50/50 p-2 px-3 rounded-2xl border border-[oklch(0.62_0.18_295/0.08)] max-w-xl text-[11px] text-[oklch(0.4_0.1_270)] font-sans">
                  <Terminal className="h-4 w-4 text-[oklch(0.62_0.18_295)] flex-shrink-0" />
                  <span className="font-semibold truncate">
                    <strong>AI Log:</strong> {liveLog}
                  </span>
                </div>
              </div>

              {/* Large Premium CTA Button - Analyze New Offer */}
              <Link 
                to="/analyze" 
                ref={ctaBtnRef}
                onMouseMove={handleCtaMouseMove}
                onMouseLeave={handleCtaMouseLeave}
                className="relative inline-flex items-center justify-center gap-2.5 h-12.5 px-6 rounded-full font-space text-xs font-extrabold tracking-wide uppercase text-white shadow-[0_8px_20px_-4px_rgba(120,80,200,0.3),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(80,40,160,0.15)] transition-shadow duration-300 hover:shadow-[0_12px_24px_rgba(120,80,200,0.42)] cursor-pointer self-start md:self-center overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))"
                }}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                <ScanSearch className="h-5 w-5 animate-pulse" />
                <span>Audit New Offer</span>
              </Link>
            </div>

            {/* Stagger Grid - Stat Analytics Cards */}
            <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Stat 1: Total Scans */}
              <StatCard 
                icon={ScanSearch} 
                label="Total audited" 
                value="12" 
                sub="100% resolution" 
                color="bg-[oklch(0.82_0.1_295/0.25)] text-[oklch(0.48_0.15_295)]" 
                trend="+3 this week"
                trendUp={true}
                sparklinePoints="0,30 20,25 40,28 60,15 80,22 100,5"
              />

              {/* Stat 2: Scams Caught */}
              <StatCard 
                icon={ShieldAlert} 
                label="Threats Neutralized" 
                value={String(scamCount)} 
                sub="advance-fee fraud logs" 
                color="bg-rose-500/10 text-rose-600" 
                trend="-$1,250 saved"
                trendUp={true}
                sparklinePoints="0,35 20,32 40,25 60,18 80,10 100,5"
              />

              {/* Stat 3: Safe Offers */}
              <StatCard 
                icon={ShieldCheck} 
                label="Safe Verified" 
                value={String(recentChecks.length - scamCount)} 
                sub="corporate aligned" 
                color="bg-emerald-500/10 text-emerald-600" 
                trend="100% safe hires"
                trendUp={true}
                sparklinePoints="0,30 20,28 40,22 60,25 80,12 100,8"
              />

              {/* Stat 4: Avg Risk Score */}
              <StatCard 
                icon={TrendingUp} 
                label="Avg Risk Quotient" 
                value="48%" 
                sub="medium risk profile" 
                color="bg-amber-500/10 text-amber-600" 
                trend="-12% decline"
                trendUp={false}
                sparklinePoints="0,5 20,12 40,18 60,22 80,28 100,30"
              />

            </div>

            {/* Split Section: Recent Checks & Tip of the Day */}
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              
              {/* Left Panel: Redesigned Recent Checks */}
              <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.08),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[oklch(0.95_0.01_95)]">
                    <div>
                      <h2 className="text-lg font-extrabold text-[oklch(0.24_0.04_270)] font-space">
                        Recent Audit History
                      </h2>
                      <p className="text-[11px] text-muted-foreground font-sans">Verification logs for contracts, emails, and job claims.</p>
                    </div>
                    <Link 
                      to="/history" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-[10px] font-extrabold uppercase text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.15)] hover:bg-[oklch(0.62_0.18_295/0.05)] transition-colors font-space shadow-sm"
                    >
                      <span>View All Archive</span> 
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Filter Tabs for quick toggle */}
                  <div className="flex gap-2.5 mt-4 pb-1">
                    {[
                      { key: "all", label: "All Logs" },
                      { key: "safe", label: "Safe Only" },
                      { key: "scam", label: "Scams Caught" },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border cursor-pointer transition-all duration-300 font-space ${
                          activeTab === tab.key 
                            ? "bg-[oklch(0.24_0.04_270)] text-white border-[oklch(0.24_0.04_270)] shadow-sm" 
                            : "bg-white/80 text-muted-foreground border-[oklch(0.9_0.02_95)] hover:bg-white hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* List items with premium row details */}
                  <div className="mt-4 divide-y divide-[oklch(0.95_0.01_95)]">
                    {filteredChecks.slice(0, 4).map((c) => (
                      <Link
                        to="/result"
                        key={c.id}
                        search={{ id: c.id }}
                        className="flex items-center gap-4 py-3.5 transition-all duration-300 hover:translate-x-1.5 group cursor-pointer"
                      >
                        {/* Company Logo Initials Rounded avatar */}
                        <span 
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm border border-white/60 relative group-hover:scale-105 transition-transform duration-300 ${
                            c.verdict === "scam" 
                              ? "bg-rose-500/10 text-rose-600" 
                              : c.verdict === "suspicious" 
                              ? "bg-amber-500/10 text-amber-600" 
                              : "bg-emerald-500/10 text-emerald-600"
                          }`}
                        >
                          {c.source === "pdf" ? <FileText className="h-5 w-5" /> : c.source === "url" ? <Link2 className="h-5 w-5" /> : <ScanSearch className="h-5 w-5" />}
                        </span>
                        
                        {/* Info details */}
                        <div className="min-w-0 flex-1 font-sans">
                          <p className="truncate text-xs font-bold text-[oklch(0.24_0.04_270)] group-hover:text-[oklch(0.62_0.18_295)] transition-colors duration-300">{c.title}</p>
                          <p className="truncate text-[10px] text-muted-foreground font-semibold mt-0.5">{c.company} · {c.date}</p>
                        </div>

                        {/* AI Confidence Meter indicator */}
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-[9px] font-bold text-muted-foreground/80 font-space tracking-wide uppercase">
                          AI: 99.8% Conf.
                        </span>

                        {/* Custom Verdict Pulsing Badge */}
                        <span 
                          className={`clay-pill text-[10px] font-extrabold uppercase font-space px-3 py-1 flex items-center gap-1.5 shadow-sm border ${
                            c.verdict === "scam" 
                              ? "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-100/30" 
                              : c.verdict === "suspicious" 
                              ? "bg-amber-50 border-amber-100 text-amber-600 shadow-amber-100/30" 
                              : "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100/30"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                            c.verdict === "scam" 
                              ? "bg-rose-500 animate-ping" 
                              : c.verdict === "suspicious" 
                              ? "bg-amber-500 animate-ping" 
                              : "bg-emerald-500"
                          }`} />
                          <span>{c.score}% Risk</span>
                        </span>
                      </Link>
                    ))}
                    
                    {filteredChecks.length === 0 && (
                      <div className="py-12 text-center space-y-2">
                        <Info className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                        <p className="text-xs font-bold text-muted-foreground font-space">No items resolved for this threat segment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel: Redesigned Visual "Tip of the Day" */}
              <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.08),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
                
                {/* Glowing border outline */}
                <div className="absolute inset-0 rounded-[32px] border border-[oklch(0.62_0.18_295/0.15)] group-hover:border-[oklch(0.62_0.18_295/0.3)] transition-colors duration-500 pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
                      <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-[oklch(0.24_0.04_270)] font-space">AI Audit Wisdom</h2>
                      <p className="text-[10px] text-muted-foreground font-sans">Tactical defense hints for smarter work onboarding.</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-[oklch(0.4_0.03_270)] font-sans font-medium leading-relaxed">
                    Legitimate recruiters <strong className="text-[oklch(0.24_0.04_270)] font-extrabold underline decoration-[oklch(0.83_0.13_55)] decoration-2">never</strong> ask you to pay an "activation fee," buy gift cards, or transfer crypto before day one.
                  </p>
                  
                  {/* Warning dynamic graphic alerts */}
                  <div className="tip-alert-badge bg-rose-50/50 p-3 rounded-2xl border border-rose-100 flex items-start gap-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
                    <div className="font-sans text-[11px] text-[oklch(0.3_0.03_270)]">
                      <p className="font-bold">Urgent Pressure Spotted</p>
                      <p className="text-muted-foreground mt-0.5">3 of your recent scanned job offers contained aggressive deadlines. Slow down.</p>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/awareness" 
                  className="w-full h-11 mt-6 flex items-center justify-center gap-2 rounded-full bg-[oklch(0.97_0.01_95)] border border-[oklch(0.88_0.02_95)] text-xs font-extrabold text-[oklch(0.24_0.04_270)] hover:bg-[oklch(0.98_0.01_95)] hover:border-[oklch(0.62_0.18_295/0.25)] hover:shadow-sm active:scale-[0.99] transition-all duration-200 cursor-pointer font-space"
                >
                  <span>Explore Threat Awareness</span> 
                  <ArrowRight className="h-4 w-4 text-[oklch(0.62_0.18_295)]" />
                </Link>
              </div>

            </div>

            {/* Bottom Row Analytics: Safety Streak, Top Red Flags, Money Saved */}
            <div className="grid gap-4.5 md:grid-cols-3">
              
              {/* Card 1: Safety Streak */}
              <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col justify-between group hover:shadow-[0_18px_40px_rgba(180,160,200,0.12)] transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
                    <Flame className="h-5.5 w-5.5 text-amber-500 animate-[pulse_1.5s_infinite]" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-space">Defensive Streak</p>
                    <p className="text-xl font-extrabold text-[oklch(0.24_0.04_270)] font-space">14 Active Days</p>
                  </div>
                </div>
                
                {/* Streak grid dots */}
                <div className="mt-4 flex gap-1.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-5 flex-1 rounded-md transition-all duration-300 ${
                        i < 12 
                          ? "bg-gradient-to-t from-amber-500 to-amber-400 shadow-sm shadow-amber-200" 
                          : "bg-gray-200"
                      }`} 
                    />
                  ))}
                </div>
                <p className="mt-3.5 text-[10px] font-bold text-muted-foreground/80 font-space tracking-wide uppercase">2 days from your personal best streak</p>
              </div>

              {/* Card 2: Top Red Flags */}
              <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col justify-between group hover:shadow-[0_18px_40px_rgba(180,160,200,0.12)] transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
                    <Target className="h-5.5 w-5.5 text-indigo-500" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-space">Top Red Flags Spotted</p>
                    <p className="text-xl font-extrabold text-[oklch(0.24_0.04_270)] font-space">Audits Profile</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-xs font-sans">
                  {[
                    { l: "Upfront software setup fees", v: 64, c: "bg-rose-500" },
                    { l: "Urgency deadline pressure", v: 42, c: "bg-amber-500" },
                    { l: "Public domains (gmail, outlook)", v: 28, c: "bg-indigo-500" },
                  ].map((x) => (
                    <li key={x.l} className="space-y-1">
                      <div className="flex items-center justify-between text-[10.5px] font-bold text-[oklch(0.3_0.03_270)]">
                        <span>{x.l}</span>
                        <span className="text-muted-foreground">{x.v}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                        <div className={`h-full rounded-full ${x.c}`} style={{ width: `${x.v}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Money Saved */}
              <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col justify-between group hover:shadow-[0_18px_40px_rgba(180,160,200,0.12)] transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
                    <DollarSign className="h-5.5 w-5.5 text-emerald-500 animate-[bounce_3s_infinite]" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-space">Asset Mitigation</p>
                    <p className="text-xl font-extrabold text-[oklch(0.24_0.04_270)] font-space">Money Saved</p>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1">
                  <p className="text-3xl font-extrabold text-emerald-600 font-space tracking-tight">$1,250</p>
                  <p className="text-[10px] text-muted-foreground font-semibold font-sans">Across 3 caught scam models since you joined.</p>
                </div>

                <Link 
                  to="/analyze" 
                  className="w-full h-9 mt-4 flex items-center justify-center gap-1.5 rounded-full bg-[oklch(0.97_0.01_95)] border border-[oklch(0.88_0.02_95)] text-[10px] font-extrabold uppercase tracking-wide text-[oklch(0.24_0.04_270)] hover:bg-[oklch(0.98_0.01_95)] hover:border-[oklch(0.62_0.18_295/0.25)] hover:shadow-sm active:scale-[0.99] transition-all duration-200 cursor-pointer font-space"
                >
                  <ScanSearch className="h-3.5 w-3.5" />
                  <span>Audit Another Offer</span>
                </Link>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Style definitions for custom glow/sparkle */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Redesigned premium Stat Card with micro-sparklines
function StatCard({ 
  icon: Icon, label, value, sub, color, trend, trendUp, sparklinePoints 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string; 
  sub: string; 
  color: string;
  trend: string;
  trendUp: boolean;
  sparklinePoints: string;
}) {
  return (
    <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col justify-between group hover:shadow-[0_18px_40px_rgba(180,160,200,0.12)] hover:scale-[1.01] transition-all duration-300">
      
      <div className="flex items-center justify-between pb-3.5 border-b border-[oklch(0.95_0.01_95)]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-space">{label}</span>
        <span className={`grid h-9.5 w-9.5 place-items-center rounded-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)] transition-transform duration-300 group-hover:scale-105 ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-1">
          <p className="font-space text-3xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground font-sans font-semibold">{sub}</p>
        </div>

        {/* Small Micro-sparkline SVGs */}
        <div className="h-10 w-20 overflow-hidden relative">
          <svg viewBox="0 0 100 40" className="w-full h-full">
            <polyline
              fill="none"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklinePoints}
              className="opacity-75"
            />
            {/* Pulsing indicator */}
            <circle cx="100" cy="5" r="2.5" fill="oklch(0.62 0.18 295)" className="animate-ping" />
          </svg>
        </div>
      </div>

      {/* Stats Trends */}
      <div className="mt-3.5 flex items-center justify-between text-[9px] font-bold tracking-wider uppercase font-space">
        <span className={trendUp ? "text-emerald-600" : "text-amber-600"}>
          {trend}
        </span>
        <span className="text-muted-foreground/60">Live Analytics</span>
      </div>

    </div>
  );
}
