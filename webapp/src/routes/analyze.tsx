import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { analyzeText } from "@/lib/mockData";
import { resultStore } from "@/lib/resultStore";
import { 
  FileText, Link2, Type, ScanSearch, Upload, Loader2, Sparkles, 
  ShieldCheck, ShieldAlert, Radio, Shield, Terminal, ArrowRight, 
  HelpCircle, Info, Lock, Check, RefreshCw
} from "lucide-react";
import { gsap } from "gsap";

export const Route = createFileRoute("/analyze")({
  head: () => ({ 
    meta: [
      { title: "AI Threat Workspace — ScamSniff" }, 
      { name: "description", content: "Verify job offer legitimacy using neural threat models." }
    ] 
  }),
  component: Analyze,
});

type Tab = "text" | "pdf" | "url";

function Analyze() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Immersive loading text sequence
  const [scanStep, setScanStep] = useState("");
  
  // Interactive stats
  const [characterCount, setCharacterCount] = useState(0);

  // Refs for animations
  const workspaceRef = useRef<HTMLDivElement>(null);
  const bgBlobsRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const samples = [
    "Congratulations! You've been selected for a remote data entry role paying $4,500 per week. No interview required. Send $50 activation fee via crypto wallet to begin onboarding. Reply within 2 hours.",
    "Hi Aisha, following up on your portfolio review for the Product Designer role at Notion Labs. Attaching the SOW and rate card. Let me know if you'd like to schedule the next stage. — Best, Sarah",
    "URGENT! Amazon Logistics is hiring package handlers — work from home, $3000/week. Contact our HR on WhatsApp +1-555-0199 to secure your slot today!",
  ];

  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

  // Stagger entry layout animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".workspace-fade > *", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }
      );

      // Slow float on blobs
      const blobs = bgBlobsRef.current?.children;
      if (blobs) {
        gsap.to(blobs[0], { x: "12vw", y: "15vh", duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(blobs[1], { x: "-18vw", y: "-10vh", duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      // Twinkling stars
      const stars = document.querySelectorAll(".twinkling-star");
      stars.forEach((star) => {
        gsap.to(star, {
          opacity: "random(0.2, 0.9)",
          scale: "random(0.6, 1.2)",
          duration: "random(1.5, 3.5)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      });
    }, workspaceRef);

    // Mouse Spotlight Follow
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseGlowRef.current) {
        gsap.to(mouseGlowRef.current, {
          x: e.clientX - 100,
          y: e.clientY - 100,
          duration: 0.7,
          ease: "power2.out"
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Magnetic Button Effect
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.3, ease: "power2.out" });
  };

  const handleButtonMouseLeave = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  // Submit and analyze triggers
  function handleAnalyze() {
    if (tab === "text" && text.trim().length < 20) {
      setShakeEffect();
      return toast.error("Paste at least 20 characters of the offer.");
    }
    if (tab === "text" && text.length > 8000) {
      setShakeEffect();
      return toast.error("Text must be under 8000 characters.");
    }
    if (tab === "url" && !/^https?:\/\/.+\..+/.test(url.trim())) {
      setShakeEffect();
      return toast.error("Enter a valid URL starting with http(s)://");
    }
    if (tab === "pdf") {
      if (!file) {
        setShakeEffect();
        return toast.error("Please upload a PDF file.");
      }
      if (file.type !== "application/pdf") {
        setShakeEffect();
        return toast.error("Only PDF files are supported.");
      }
      if (file.size > 10 * 1024 * 1024) {
        setShakeEffect();
        return toast.error("File must be under 10MB.");
      }
    }

    setLoading(true);
    
    // Immersive Scanning text loops
    const scanSteps = [
      "Decrypting message metadata payload...",
      "Analyzing semantic urgency pressures...",
      "Searching global advance-fee blacklist database...",
      "Resolving DNS reputation variables...",
      "Compiling neural threat quotient score..."
    ];

    scanSteps.forEach((step, index) => {
      setTimeout(() => {
        setScanStep(step);
      }, index * 450);
    });

    const payload = tab === "text" ? text : tab === "url" ? `Job link: ${url}` : (file ? `PDF: ${file.name}` : "");
    
    setTimeout(() => {
      const result = analyzeText(payload || "Empty offer submission");
      resultStore.set(result);
      toast.success("Analysis complete");
      nav({ to: "/result" });
    }, 2400);
  }

  function setShakeEffect() {
    const card = mainCardRef.current;
    if (card) {
      gsap.fromTo(card, 
        { x: -6 }, 
        { x: 6, duration: 0.08, repeat: 5, yoyo: true, ease: "sine.inOut", onComplete: () => {
          gsap.set(card, { x: 0 });
        }}
      );
    }
  }

  return (
    <div ref={workspaceRef} className="relative h-screen overflow-hidden bg-[oklch(0.97_0.018_95)] font-space">
      
      {/* Background Grids and Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40M40 0L40 40' fill='none' stroke='%236200B9' stroke-width='1'/%3E%3C/svg%3E")`
          }}
        />

        <div ref={bgBlobsRef} className="absolute inset-0 filter blur-[95px] opacity-60">
          <div className="absolute top-[10%] left-[10%] w-[420px] h-[420px] bg-[oklch(0.82_0.1_295)] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[20%] right-[10%] w-[380px] h-[380px] bg-[oklch(0.83_0.13_55)] rounded-full mix-blend-screen" />
        </div>

        <div 
          ref={mouseGlowRef} 
          className="absolute w-[200px] h-[200px] rounded-full pointer-events-none bg-gradient-to-r from-[oklch(0.82_0.1_295/0.4)] to-[oklch(0.83_0.13_55/0.4)] filter blur-[50px] mix-blend-screen z-10" 
          style={{ transform: "translate3d(0px, 0px, 0)" }}
        />
      </div>

      {/* Main Layout */}
      <div className="relative mx-auto flex h-full max-w-[1440px] gap-6 p-4 sm:p-5 lg:p-6 z-10">
        
        {/* Glass floating sidebar */}
        <Sidebar />

        {/* Workspace core */}
        <main className="hide-scrollbar min-w-0 flex-1 space-y-5 lg:space-y-6 overflow-y-auto pr-1 pb-6 relative">
          
          {loading ? (
            /* IMMERSIVE FULL SCREEN SECURITY RADAR SCANNER */
            <div className="h-full w-full bg-white/75 backdrop-blur-xl border border-white/80 rounded-[40px] shadow-[0_20px_50px_rgba(180,160,200,0.12)] p-8 flex flex-col items-center justify-center space-y-8 animate-[fade-in_0.3s_ease-out]">
              
              {/* Radar Scanner Core Animation */}
              <div className="relative h-44 w-44 rounded-full border-2 border-[oklch(0.62_0.18_295/0.2)] bg-purple-50/20 flex items-center justify-center shadow-lg">
                
                {/* Rotating scanner bar */}
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[oklch(0.62_0.18_295)] animate-spin opacity-80" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-[oklch(0.62_0.18_295/0.15)] animate-[spin_10s_linear_infinite]" />
                
                <div className="h-28 w-28 rounded-full bg-white shadow-md flex items-center justify-center relative">
                  <ScanSearch className="h-12 w-12 text-[oklch(0.62_0.18_295)] animate-pulse" />
                  <div className="absolute inset-[-4px] rounded-full border border-[oklch(0.62_0.18_295/0.3)] animate-ping" />
                </div>
              </div>

              {/* Progress telemetries */}
              <div className="text-center space-y-2.5 max-w-sm">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-[oklch(0.24_0.04_270)] font-space">Audit telemetry running</h3>
                
                {/* Custom glowing logs */}
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-[oklch(0.62_0.18_295/0.1)] font-sans text-xs text-[oklch(0.4_0.1_270)] min-h-[44px] flex items-center justify-center">
                  <Loader2 className="h-3.5 w-3.5 text-[oklch(0.62_0.18_295)] animate-spin mr-2 flex-shrink-0" />
                  <span className="font-bold">{scanStep}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="workspace-fade space-y-5 lg:space-y-6">
              
              {/* Hero welcome header */}
              <header className="flex flex-col space-y-2 relative">
                <Sparkles className="twinkling-star absolute top-[-5px] right-[40%] text-[oklch(0.62_0.18_295/0.4)] w-4 h-4" />
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-[10px] font-extrabold uppercase text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.15)] flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" /> Neural Model v2.1
                  </span>
                  
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-500/10">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Threat Scanner Active
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight">
                  Drop the offer in here.
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl leading-relaxed">
                  Paste the suspicious message, upload an offer PDF, or share the URL. Our threat engines evaluate indicators and issue an audit score in under 4 seconds.
                </p>
              </header>

              {/* 2-Column Core Layout: Workspace Card on Left, AI Assistance on Right */}
              <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start">
                
                {/* Left Side: Large Floating Claymorphism Glass Card */}
                <div 
                  ref={mainCardRef}
                  className="bg-white/75 border border-white/80 rounded-[40px] p-5 sm:p-7 shadow-[0_20px_50px_-12px_rgba(150,130,180,0.15),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl relative overflow-hidden"
                >
                  {/* Decorative Gradient light bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.18_295)] to-transparent opacity-40" />

                  {/* Tabs Selection Container */}
                  <div className="clay-inset inline-flex gap-1.5 p-1.5 rounded-full">
                    {([
                      { id: "text", label: "Paste offer details", icon: Type },
                      { id: "pdf", label: "Upload PDF / Image", icon: FileText },
                      { id: "url", label: "Inspect URL Link", icon: Link2 },
                    ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`flex items-center gap-2 rounded-full px-4.5 py-2.5 text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all duration-300 font-space ${
                          tab === id 
                            ? "clay-primary text-white shadow-md" 
                            : "text-muted-foreground hover:text-[oklch(0.24_0.04_270)] hover:bg-purple-50/50"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={2.5} /> 
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Tab Body */}
                  <div className="mt-6">
                    
                    {/* Paste Text Area */}
                    {tab === "text" && (
                      <div className="space-y-2">
                        <div className="relative group">
                          <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={9}
                            placeholder="Paste the suspicious outreach email, SMS template, WhatsApp messages, or job details here..."
                            className="w-full resize-none p-5 bg-[oklch(0.95_0.01_95/0.8)] border border-[oklch(0.88_0.02_95)] rounded-3xl outline-none text-xs sm:text-sm font-semibold text-[oklch(0.24_0.04_270)] placeholder:text-muted-foreground/60 shadow-[inset_2px_2px_5px_rgba(180,160,200,0.08),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)] hover:border-[oklch(0.82_0.1_295/0.3)] focus:border-[oklch(0.62_0.18_295/0.5)] focus:ring-4 focus:ring-[oklch(0.62_0.18_295/0.1)] focus:bg-white transition-all duration-300 font-sans leading-relaxed"
                          />
                          {/* Floating character counter */}
                          <div className="absolute bottom-4.5 right-4.5 text-[9px] font-bold text-muted-foreground/80 font-space uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-md border border-[oklch(0.9_0.02_95)]">
                            {characterCount} chars
                          </div>
                        </div>

                        {/* Quick threat suggestion hint */}
                        <div className="flex items-center gap-1.5 text-[9.5px] font-bold pl-1.5 text-muted-foreground uppercase font-space tracking-wide">
                          <Info className="h-3.5 w-3.5 text-purple-400" />
                          <span>Tip: Include salaries and payment descriptions for higher confidence models.</span>
                        </div>
                      </div>
                    )}

                    {/* Drag-Drop PDF Area */}
                    {tab === "pdf" && (
                      <label className="clay-inset flex cursor-pointer flex-col items-center justify-center gap-3.5 p-10 text-center border-2 border-dashed border-[oklch(0.62_0.18_295/0.2)] hover:border-[oklch(0.62_0.18_295/0.5)] hover:shadow-lg transition-all duration-300 group">
                        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-[oklch(0.82_0.1_295/0.25)] text-[oklch(0.48_0.15_295)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] group-hover:scale-105 transition-transform duration-300">
                          <Upload className="h-7 w-7 text-[oklch(0.62_0.18_295)]" />
                        </span>
                        
                        <div className="space-y-1">
                          <p className="font-space text-lg font-extrabold text-[oklch(0.24_0.04_270)]">
                            {file ? file.name : "Drop offer PDF here"}
                          </p>
                          <p className="text-xs text-muted-foreground font-sans">
                            {file ? `${(file.size / 1024).toFixed(0)} KB · Click to replace` : "or click to browse local files"}
                          </p>
                        </div>

                        {/* PDF restrictions */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-[8px] font-bold text-[oklch(0.62_0.18_295)] uppercase tracking-wider border border-[oklch(0.62_0.18_295/0.1)]">PDF FORMAT</span>
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-[8px] font-bold text-[oklch(0.62_0.18_295)] uppercase tracking-wider border border-[oklch(0.62_0.18_295/0.1)]">MAX 10MB</span>
                        </div>

                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      </label>
                    )}

                    {/* URL Link Input */}
                    {tab === "url" && (
                      <div className="space-y-2">
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[oklch(0.62_0.18_295)] transition-colors duration-300">
                            <Link2 className="h-5 w-5" />
                          </span>
                          
                          <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://careers.company.com/job-posting-18491"
                            className="w-full h-12 pl-12 pr-4 bg-[oklch(0.95_0.01_95/0.8)] border border-[oklch(0.88_0.02_95)] rounded-full outline-none text-xs sm:text-sm font-semibold text-[oklch(0.24_0.04_270)] placeholder:text-muted-foreground/60 shadow-[inset_2px_2px_5px_rgba(180,160,200,0.08),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)] hover:border-[oklch(0.82_0.1_295/0.3)] focus:border-[oklch(0.62_0.18_295/0.5)] focus:ring-4 focus:ring-[oklch(0.62_0.18_295/0.1)] focus:bg-white transition-all duration-300 font-sans"
                          />
                        </div>

                        {/* Domain checking warning details */}
                        <div className="flex items-center gap-1.5 text-[9.5px] font-bold pl-1.5 text-muted-foreground uppercase font-space tracking-wide">
                          <Lock className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Link crawler checks SSL certificates, DNS registry age, and spoofed domains.</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Audit execution panel details */}
                  <div className="mt-6 pt-5 border-t border-[oklch(0.95_0.01_95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-[10px] sm:text-xs text-muted-foreground/90 font-sans font-medium flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-emerald-500" /> 
                      Client-side sandboxing. Offer payloads are never stored.
                    </p>
                    
                    <button
                      ref={buttonRef}
                      onMouseMove={handleButtonMouseMove}
                      onMouseLeave={handleButtonMouseLeave}
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="relative h-11 px-7 overflow-hidden rounded-full font-space text-[11px] sm:text-xs font-extrabold tracking-wide uppercase text-white shadow-[0_8px_16px_-4px_rgba(120,80,200,0.25),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(80,40,160,0.2)] transition-shadow duration-300 hover:shadow-[0_12px_22px_rgba(120,80,200,0.38)] cursor-pointer flex items-center justify-center gap-2 group self-end"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))"
                      }}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                      <ScanSearch className="h-4.5 w-4.5 animate-pulse" />
                      <span>Verify Authenticity</span>
                    </button>
                  </div>

                </div>

                {/* Right Side: AI Assistant Side Panel */}
                <div className="space-y-4">
                  
                  {/* AI Suggestions Box */}
                  <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl relative overflow-hidden group">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                      <span className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-purple-500/10 text-[oklch(0.62_0.18_295)]">
                        <Sparkles className="h-4.5 w-4.5 text-[oklch(0.62_0.18_295)]" />
                      </span>
                      <div>
                        <h4 className="text-xs font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">Neural Matrix Guide</h4>
                        <p className="text-[9px] text-muted-foreground font-sans">Common scam patterns observed this week.</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3.5 font-sans">
                      {[
                        { title: "Advance Fee Scam", icon: ShieldAlert, desc: "Recruiters asking for processing, software setup, or onboarding fees prior to work contracts." },
                        { title: "Public Sender Domains", icon: Info, desc: "Communication extending from free web mail hosting services (e.g. gmail.com, mail.com, outlook.com) is spoofed." },
                      ].map((pattern, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gray-50 border border-gray-100 text-purple-400">
                            <pattern.icon className="h-4 w-4" />
                          </span>
                          <div className="text-[11px] text-[oklch(0.3_0.03_270)]">
                            <p className="font-extrabold text-[oklch(0.24_0.04_270)]">{pattern.title}</p>
                            <p className="text-muted-foreground mt-0.5">{pattern.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick stats mini-widget */}
                  <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-space">Secure Database</h4>
                      <p className="text-base font-extrabold text-[oklch(0.24_0.04_270)] font-space mt-1">291,482 Blacklists</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-purple-50 text-[8px] font-bold text-[oklch(0.62_0.18_295)] uppercase tracking-wider border border-[oklch(0.62_0.18_295/0.1)] shadow-sm">
                      Sync Completed
                    </span>
                  </div>

                </div>

              </div>

              {/* Try with a sample section */}
              {tab === "text" && (
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="flex items-center gap-3 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-[oklch(0.24_0.04_270)] font-space">Simulated Training Vectors</h2>
                      <p className="text-[9.5px] text-muted-foreground font-sans">Click a training model template below to load details into workspace.</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {samples.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          setText(s);
                          toast.success("Loaded model template to textarea");
                        }} 
                        className="p-3 bg-white border border-[oklch(0.88_0.02_95)] rounded-2xl text-left font-sans text-[11px] text-[oklch(0.3_0.03_270)] shadow-sm hover:border-[oklch(0.62_0.18_295/0.25)] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[96px]"
                      >
                        <p className="line-clamp-3 font-semibold text-[oklch(0.4_0.03_270)]">{s}</p>
                        <span className="text-[8.5px] font-bold text-[oklch(0.62_0.18_295)] uppercase tracking-wider mt-2.5 flex items-center gap-1 font-space">
                          Load model <ArrowRight className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
