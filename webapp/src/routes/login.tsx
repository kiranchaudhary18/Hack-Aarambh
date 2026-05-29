import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Radio,
  CheckCircle,
  Activity,
  Sparkles,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { gsap } from "gsap";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Secure Login — ScamSniff AI" },
      { name: "description", content: "Authenticate secure session to your ScamSniff account." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Interactive UX states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [liveScanCount, setLiveScanCount] = useState(482910);
  const [rememberMe, setRememberMe] = useState(false);

  // Refs for GSAP
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const bgBlobsRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const chartCardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);

  // Counter increments
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScanCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade reveal background
      gsap.fromTo(".bg-overlay", { opacity: 0 }, { opacity: 1, duration: 1.2 });

      // Floating blobs (slow elegant drift)
      const blobs = bgBlobsRef.current?.children;
      if (blobs) {
        gsap.to(blobs[0], {
          x: "15vw",
          y: "10vh",
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(blobs[1], {
          x: "-12vw",
          y: "-15vh",
          duration: 22,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(blobs[2], {
          x: "8vw",
          y: "-10vh",
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Left column stagger reveal
      gsap.fromTo(
        ".animate-left-hero > *",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
      );

      // Card floats
      if (shieldRef.current) {
        gsap.to(shieldRef.current, {
          y: -8,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (statsCardRef.current) {
        gsap.to(statsCardRef.current, {
          y: 6,
          x: -3,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.3,
        });
      }
      if (chartCardRef.current) {
        gsap.to(chartCardRef.current, {
          y: -6,
          x: 4,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.8,
        });
      }
      if (floatCard1Ref.current) {
        gsap.to(floatCard1Ref.current, {
          y: -10,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });
      }
      if (floatCard2Ref.current) {
        gsap.to(floatCard2Ref.current, {
          y: 8,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.2,
        });
      }

      // Entrance animation for login card
      gsap.fromTo(
        ".login-card-container",
        { opacity: 0, scale: 0.98, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );

      // Stagger child elements inside the form
      gsap.fromTo(
        ".form-stagger > *",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power3.out", delay: 0.15 },
      );

      // Twinkling stars
      const stars = document.querySelectorAll(".twinkling-star");
      stars.forEach((star) => {
        gsap.to(star, {
          opacity: "random(0.15, 0.9)",
          scale: "random(0.6, 1.3)",
          duration: "random(1.5, 3)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });

      // Floating dust particles
      const particles = document.querySelectorAll(".glowing-particle");
      particles.forEach((p) => {
        gsap.to(p, {
          x: "random(-40, 40)",
          y: "random(-50, 50)",
          opacity: "random(0.1, 0.5)",
          duration: "random(6, 10)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    });

    // Mouse follow spotlight glow
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseGlowRef.current) {
        gsap.to(mouseGlowRef.current, {
          x: e.clientX - 100,
          y: e.clientY - 100,
          duration: 0.7,
          ease: "power2.out",
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

  // Form submission with premium loading, shake, and success checkmark states
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Invalid access mock validation: if password is less than 6 chars, trigger premium form shake!
    if (password.length < 6) {
      setShake(true);
      setErrorMsg("Password integrity check failed (too short)");
      setTimeout(() => setShake(false), 600);
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await api.login(email, password);

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Login successful!");

      // Navigate to dashboard after showing beautiful checkmark transition
      setTimeout(() => {
        nav({ to: "/dashboard" });
      }, 1300);
    } catch (error) {
      setIsLoading(false);
      setShake(true);
      setErrorMsg("Invalid credentials. Please try again.");
      setTimeout(() => setShake(false), 600);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[oklch(0.97_0.018_95)] font-space flex items-center justify-center p-3 sm:p-5 lg:p-6">
      {/* 1. Futuristic Background Overlay with blobs and grid */}
      <div className="bg-overlay absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40M40 0L40 40' fill='none' stroke='%236200B9' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Slow drifting animated gradient blobs */}
        <div ref={bgBlobsRef} className="absolute inset-0 filter blur-[90px] opacity-65">
          <div className="absolute top-[10%] left-[10%] w-[380px] h-[380px] rounded-full bg-[oklch(0.82_0.1_295)] mix-blend-multiply" />
          <div className="absolute bottom-[20%] right-[15%] w-[420px] h-[420px] rounded-full bg-[oklch(0.83_0.13_55)] mix-blend-screen" />
          <div className="absolute top-[45%] left-[50%] w-[320px] h-[320px] rounded-full bg-[oklch(0.9_0.14_95)] mix-blend-overlay" />
        </div>

        {/* Mouse follow spotlight glow */}
        <div
          ref={mouseGlowRef}
          className="absolute w-[220px] h-[220px] rounded-full pointer-events-none bg-gradient-to-r from-[oklch(0.82_0.1_295/0.4)] to-[oklch(0.83_0.13_55/0.4)] filter blur-[55px] mix-blend-screen z-10"
          style={{ transform: "translate3d(0px, 0px, 0)" }}
        />

        {/* Shimmering dust particles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="glowing-particle absolute w-2 h-2 rounded-full bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,1)]"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center lg:h-full py-2 lg:py-0">
        {/* LEFT COLUMN: HERO, VISUALS & GLASS NOTIFICATIONS */}
        <div
          ref={leftColRef}
          className="lg:col-span-6 flex flex-col justify-center space-y-4 lg:space-y-5 animate-left-hero px-2 lg:px-4 py-4 lg:py-0 relative"
        >
          {/* Twinkling stars scattered floating */}
          <Sparkles className="twinkling-star absolute top-[-10px] right-[20%] text-[oklch(0.62_0.18_295/0.5)] w-4 h-4" />
          <Sparkles className="twinkling-star absolute bottom-[10%] left-[-20px] text-[oklch(0.85_0.12_70/0.6)] w-5 h-5" />

          {/* AI Protected Cybersecurity Badge */}
          <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_4px_12px_rgba(180,160,200,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-[oklch(0.4_0.1_270)] flex items-center gap-1 font-space">
              <Shield className="h-3.5 w-3.5 text-[oklch(0.62_0.18_295)]" /> Cyber Defense Spotlight
              Active
            </span>
          </div>

          {/* Large startup-style heading */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[oklch(0.24_0.04_270)] leading-[1.1] font-space">
              Scam<span className="text-gradient">Sniff</span> AI.
              <br />
              <span className="font-light text-[oklch(0.4_0.05_270)]">Zero Job Scams.</span>
              <br />
              Total Protection.
            </h1>
            <p className="max-w-md text-sm sm:text-base text-[oklch(0.45_0.03_270)] font-sans font-medium leading-relaxed">
              Verify jobs, scan contracts, and detect fraud instantly with next-gen neural
              evaluation. Clean, premium cybersecurity built for smart workers.
            </p>
          </div>

          {/* Interactive Shield Visual & Stats Box */}
          <div className="relative flex items-center justify-start h-[210px] sm:h-[230px] w-full max-w-lg mt-2">
            {/* Elegant shield icon container */}
            <div
              ref={shieldRef}
              className="absolute left-2 top-2.5 z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[oklch(0.82_0.1_295/0.2)] to-[oklch(0.85_0.12_70/0.3)] backdrop-blur-md border border-white/60 shadow-[0_20px_50px_rgba(180,160,200,0.2)] flex items-center justify-center"
            >
              <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-white/90 shadow-[inset_8px_8px_16px_rgba(180,160,200,0.1),_inset_-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.82_0.1_295/0.1)] to-[oklch(0.85_0.12_70/0.15)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <ShieldCheck
                  className="h-12 w-12 sm:h-16 sm:w-16 text-[oklch(0.62_0.18_295)] drop-shadow-[0_10px_20px_rgba(98,0,185,0.25)] relative z-10"
                  strokeWidth={1.5}
                />
                <div className="absolute inset-2 border-2 border-dashed border-[oklch(0.62_0.18_295/0.2)] rounded-full animate-[spin_40s_linear_infinite]" />
              </div>
            </div>

            {/* Live Scam Stats Card */}
            <div
              ref={statsCardRef}
              className="absolute right-0 top-3.5 z-20 clay-sm p-3 w-[170px] sm:w-[200px] border border-white/70 bg-white/85 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Live Activity
                  </p>
                  <p className="text-xs font-bold text-[oklch(0.24_0.04_270)]">Scams Blocked</p>
                </div>
              </div>
              <div className="mt-2 space-y-0.5">
                <p className="text-lg sm:text-xl font-extrabold text-[oklch(0.24_0.04_270)] font-space">
                  {liveScanCount.toLocaleString()}
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600">
                  <span className="flex items-center gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                    99.8% Accuracy
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Glowing Analytics Chart */}
            <div
              ref={chartCardRef}
              className="absolute right-6 bottom-1 z-20 clay-sm p-2.5 w-[160px] sm:w-[185px] border border-white/70 bg-white/80 backdrop-blur-md shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">
                  Threat Index
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-[oklch(0.62_0.18_295)]">
                  AI Monitored
                </span>
              </div>

              <div className="mt-2 h-11 w-full overflow-hidden relative">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.18 295)" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="oklch(0.62 0.18 295)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0"
                    y1="10"
                    x2="100"
                    y2="10"
                    stroke="rgba(0,0,0,0.03)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="20"
                    x2="100"
                    y2="20"
                    stroke="rgba(0,0,0,0.03)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="0"
                    y1="30"
                    x2="100"
                    y2="30"
                    stroke="rgba(0,0,0,0.03)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M0 40 L0 30 Q15 15 30 25 T60 12 T85 20 Q92 5 100 8 L100 40 Z"
                    fill="url(#chartGlow)"
                  />
                  <path
                    d="M0 30 Q15 15 30 25 T60 12 T85 20 Q92 5 100 8"
                    fill="none"
                    stroke="oklch(0.62 0.18 295)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-[dash_3s_ease-in-out_infinite]"
                  />
                  <circle
                    cx="100"
                    cy="8"
                    r="2.5"
                    fill="oklch(0.62 0.18 295)"
                    className="animate-ping"
                  />
                  <circle
                    cx="100"
                    cy="8"
                    r="2"
                    fill="white"
                    stroke="oklch(0.62 0.18 295)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Glowing neon lines floating in background */}
            <div className="absolute left-[35%] bottom-[15%] w-32 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.18_295)] to-transparent blur-[1px] opacity-40 transform rotate-12 pointer-events-none" />
            <div className="absolute left-[15%] top-[10%] w-48 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.85_0.12_70)] to-transparent blur-[1px] opacity-50 transform -rotate-12 pointer-events-none" />
          </div>

          {/* 1. Floating Glassmorphism Notification Card 1 */}
          <div
            ref={floatCard1Ref}
            className="absolute left-[-20px] top-[40%] z-20 hidden md:flex items-center gap-2.5 p-2 px-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_20px_-4px_rgba(180,160,200,0.15)] pointer-events-none"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[oklch(0.24_0.04_270)]">
                Scam Neutralized
              </p>
              <p className="text-[8px] font-bold text-muted-foreground">Telegram Fake Job Offer</p>
            </div>
          </div>

          {/* 2. Floating Glassmorphism Notification Card 2 */}
          <div
            ref={floatCard2Ref}
            className="absolute right-[-10px] bottom-[15%] z-20 hidden md:flex items-center gap-2.5 p-2 px-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_8px_20px_-4px_rgba(180,160,200,0.15)] pointer-events-none"
          >
            <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-[oklch(0.62_0.18_295)]">
              <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[oklch(0.24_0.04_270)]">
                E2E Shield Active
              </p>
              <p className="text-[8px] font-bold text-muted-foreground">AES-256 Verified Scan</p>
            </div>
          </div>

          {/* Small feature list */}
          <div className="grid grid-cols-2 gap-3.5 max-w-md pt-1">
            {[
              "Instant Job Offer Auditing",
              "Neural Red Flag Tagging",
              "Phishing Domain Detection",
              "100% Client-Side Privacy",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle
                  className="h-4 w-4 text-[oklch(0.62_0.18_295)] flex-shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-[11px] sm:text-xs font-bold text-[oklch(0.3_0.03_270)] font-sans">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CLAYMORPHISM & GLASSMORPHISM LOGIN CARD */}
        <div className="lg:col-span-6 flex items-center justify-center p-0.5 sm:p-2 relative">
          <div
            className={`login-card-container w-full max-w-md relative transition-transform duration-300 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          >
            {/* Layered Depth Shadow Card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.82_0.1_295/0.2)] to-[oklch(0.85_0.12_70/0.2)] rounded-[32px] blur-sm transform translate-y-2 scale-[0.99] -z-10 pointer-events-none animate-[pulse_4s_infinite]" />

            {/* Main Login Card */}
            <div className="w-full bg-white/75 backdrop-blur-[24px] rounded-[32px] p-5 sm:p-7.5 border border-white/80 shadow-[0_20px_50px_-12px_rgba(150,130,180,0.2),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(180,160,200,0.08)] relative overflow-hidden">
              {/* Decorative light reflection on card border */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />

              {/* Premium Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-3.5 transition-all duration-300">
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-[oklch(0.62_0.18_295)] animate-spin" />
                    <Shield className="h-5 w-5 text-[oklch(0.62_0.18_295)] absolute" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-extrabold text-[oklch(0.24_0.04_270)] tracking-wider uppercase font-space">
                      Running Security Integrity Audit
                    </p>
                    <p className="text-[10px] text-muted-foreground font-sans">
                      Connecting to ScamSniff Neural Engine...
                    </p>
                  </div>
                </div>
              )}

              {/* Premium Success Overlay */}
              {isSuccess && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-3 transition-all duration-300 animate-[fade-in_0.3s_ease-out]">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-100 relative">
                    {/* Pulsing ring */}
                    <div className="absolute inset-[-6px] rounded-full border border-emerald-500/20 animate-ping opacity-75" />
                    <Check className="h-9 w-9 text-emerald-500 stroke-[3]" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-extrabold text-[oklch(0.24_0.04_270)] font-space tracking-wide">
                      Identity Verified Successfully
                    </p>
                    <p className="text-[10px] text-muted-foreground font-sans">
                      Launching secure ScamSniff dashboard session
                    </p>
                  </div>
                </div>
              )}

              <div className="form-stagger space-y-4 lg:space-y-4.5">
                {/* Logo & Welcome Header */}
                <div className="flex flex-col items-center justify-center text-center">
                  <Link to="/" className="group inline-flex items-center gap-3 mb-1.5 relative">
                    <div className="absolute -inset-1.5 rounded-2xl bg-[oklch(0.62_0.18_295/0.15)] blur-sm group-hover:bg-[oklch(0.62_0.18_295/0.25)] transition-all duration-300 pointer-events-none" />

                    <span className="grid h-10 w-10 place-items-center rounded-2xl clay-primary relative z-10 transition-transform duration-300 group-hover:scale-105">
                      <ShieldCheck
                        className="h-5 w-5 text-white animate-[pulse_2s_infinite]"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="font-space text-xl font-extrabold tracking-tight relative z-10 text-[oklch(0.24_0.04_270)]">
                      Scam<span className="text-gradient">Sniff</span>
                    </span>
                  </Link>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[oklch(0.24_0.04_270)] mt-1 font-space">
                    Welcome back
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground max-w-[280px] font-sans">
                    Secure your assets with next-gen AI threat protection.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 font-bold font-sans animate-[fade-in_0.2s_ease-out]">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* Email Input Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[oklch(0.4_0.03_270)] pl-1.5 tracking-wider uppercase flex items-center gap-1 font-space">
                      <Mail className="h-2.5 w-2.5 text-purple-400" /> Email address
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[oklch(0.62_0.18_295)] transition-colors duration-300">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="kiran@hacksniff.ai"
                        className="w-full h-11 pl-11 pr-4 bg-[oklch(0.95_0.01_95/0.8)] border border-[oklch(0.88_0.02_95)] rounded-full outline-none text-xs sm:text-sm font-semibold text-[oklch(0.24_0.04_270)] placeholder:text-muted-foreground/60 shadow-[inset_2px_2px_5px_rgba(180,160,200,0.08),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)] hover:border-[oklch(0.82_0.1_295/0.3)] focus:border-[oklch(0.62_0.18_295/0.5)] focus:ring-4 focus:ring-[oklch(0.62_0.18_295/0.1)] focus:bg-white transition-all duration-300 font-sans"
                      />
                    </div>
                  </div>

                  {/* Password Input Field */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between pl-1.5">
                      <label className="text-[10px] font-bold text-[oklch(0.4_0.03_270)] tracking-wider uppercase flex items-center gap-1 font-space">
                        <Lock className="h-2.5 w-2.5 text-purple-400" /> Password
                      </label>
                    </div>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[oklch(0.62_0.18_295)] transition-colors duration-300">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type={show ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-11 pl-11 pr-11 bg-[oklch(0.95_0.01_95/0.8)] border border-[oklch(0.88_0.02_95)] rounded-full outline-none text-xs sm:text-sm font-semibold text-[oklch(0.24_0.04_270)] placeholder:text-muted-foreground/60 shadow-[inset_2px_2px_5px_rgba(180,160,200,0.08),_inset_-2px_-2px_5px_rgba(255,255,255,0.7)] hover:border-[oklch(0.82_0.1_295/0.3)] focus:border-[oklch(0.62_0.18_295/0.5)] focus:ring-4 focus:ring-[oklch(0.62_0.18_295/0.1)] focus:bg-white transition-all duration-300 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[oklch(0.62_0.18_295)] transition-colors p-1 rounded-full hover:bg-purple-50/50"
                      >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot Row with smooth custom checkbox */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs px-1.5 font-sans pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-[oklch(0.4_0.03_270)]">
                      <span className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only peer"
                        />
                        <span className="w-4 h-4 rounded-md border border-[oklch(0.82_0.03_270)] bg-[oklch(0.95_0.01_95)] shadow-[inset_1px_1px_2px_rgba(180,160,200,0.15)] peer-checked:bg-[oklch(0.62_0.18_295)] peer-checked:border-[oklch(0.62_0.18_295)] transition-all duration-200" />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 stroke-[3]" />
                      </span>
                      <span>Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="font-bold text-[oklch(0.62_0.18_295)] hover:text-[oklch(0.55_0.2_305)] hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    ref={buttonRef}
                    onMouseMove={handleButtonMouseMove}
                    onMouseLeave={handleButtonMouseLeave}
                    type="submit"
                    className="relative w-full h-11 mt-3 overflow-hidden rounded-full font-space text-[11px] sm:text-xs font-extrabold tracking-wide uppercase text-white shadow-[0_8px_16px_-4px_rgba(120,80,200,0.25),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(80,40,160,0.2)] transition-shadow duration-300 hover:shadow-[0_12px_22px_rgba(120,80,200,0.38)] cursor-pointer flex items-center justify-center gap-2 group"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))",
                    }}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                    <span>Initiate Secure Session</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2.5}
                    />
                  </button>
                </form>

                {/* Divider with moving shine animation */}
                <div className="flex items-center gap-2.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 font-space relative overflow-hidden">
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[oklch(0.85_0.03_270/0.4)]" />
                  <span>Cloud Gateway</span>
                  <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[oklch(0.85_0.03_270/0.4)]" />
                </div>

                {/* Google Sign In with hover spotlight */}
                <button
                  type="button"
                  className="w-full h-11 flex items-center justify-center gap-2.5 rounded-full bg-white border border-[oklch(0.88_0.02_95)] text-xs font-extrabold text-[oklch(0.24_0.04_270)] hover:bg-[oklch(0.98_0.01_95)] hover:border-[oklch(0.62_0.18_295/0.3)] hover:shadow-[0_4px_12px_rgba(98,0,185,0.08)] active:scale-[0.99] transition-all duration-200 cursor-pointer font-space shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c6.9 0 9.6-4.8 9.6-9.2 0-.6-.1-1-.2-1.6H12z"
                    />
                  </svg>
                  <span>Verify Identity via Google</span>
                </button>

                {/* Signup redirect */}
                <p className="text-center text-xs font-medium text-muted-foreground font-sans">
                  New to ScamSniff?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-[oklch(0.62_0.18_295)] hover:text-[oklch(0.55_0.2_305)] hover:underline transition-colors"
                  >
                    Deploy new account
                  </Link>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-5 pt-3.5 border-t border-[oklch(0.92_0.02_95)] flex items-center justify-between text-[9px] font-bold text-muted-foreground/80 font-space tracking-wider uppercase">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-emerald-500 animate-[pulse_2s_infinite]" />{" "}
                  AES-256 Verified
                </span>
                <span className="flex items-center gap-1">
                  <Radio className="h-3 w-3 text-purple-400 animate-pulse" /> SSL Secure Connection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for special effects */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        svg path.animate-\\[dash_3s_ease-in-out_infinite\\] {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 4s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
