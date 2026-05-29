import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { tips } from "@/lib/mockData";
import * as Icons from "lucide-react";
import {
  ShieldAlert,
  Sparkles,
  GraduationCap,
  Flame,
  ArrowRight,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

export const Route = createFileRoute("/awareness")({
  head: () => ({
    meta: [
      { title: "AI Awareness Hub — ScamSniff" },
      { name: "description", content: "Cybersecurity awareness tips and common scam patterns." },
    ],
  }),
  component: Awareness,
});

const scamPatterns = [
  {
    name: "Advance-fee fraud",
    desc: "You're asked to pay for 'training,' 'equipment,' or 'background checks' before starting.",
    color: "bg-rose-500/10 text-rose-600 border-rose-100/40",
    quote: '"Send $50 setup fee via Bitcoin..."',
  },
  {
    name: "Brand impersonation",
    desc: "Fake 'recruiters' use lookalike domains (amaz0n.com, g00gle.com) and stolen logos.",
    color: "bg-blue-500/10 text-blue-600 border-blue-100/40",
    quote: '"Recruiting from global-apple.hr@gmail.com..."',
  },
  {
    name: "Overpayment check",
    desc: "They send a fake check for 'supplies,' ask you to wire the difference. Check bounces. You're out.",
    color: "bg-amber-500/10 text-amber-600 border-amber-100/40",
    quote: '"We sent you a $3,000 check for Macbooks..."',
  },
  {
    name: "Reshipping mule",
    desc: "You receive packages, then reship them abroad. You're a money-laundering middleman.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-100/40",
    quote: '"Inspect these packages and ship to Turkey..."',
  },
  {
    name: "Crypto wallet activation",
    desc: "Sign-on bonus paid in crypto — but only after you 'activate' your wallet with your own funds.",
    color: "bg-purple-500/10 text-purple-600 border-purple-100/40",
    quote: '"Deposit 0.02 ETH to unlock sign-on reward..."',
  },
  {
    name: "Data-harvesting interview",
    desc: "'Onboarding form' collects SSN, bank, driver's license before any work is offered.",
    color: "bg-orange-500/10 text-orange-600 border-orange-100/40",
    quote: '"Upload SSN and routing bank details to start..."',
  },
];

function Awareness() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const awarenessRef = useRef<HTMLDivElement>(null);
  const bgBlobsRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  // Stagger entry layout animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".awareness-fade > *",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" },
      );

      // Slow float on blobs
      const blobs = bgBlobsRef.current?.children;
      if (blobs) {
        gsap.to(blobs[0], {
          x: "12vw",
          y: "15vh",
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(blobs[1], {
          x: "-15vw",
          y: "-12vh",
          duration: 28,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Twinkling stars
      const stars = document.querySelectorAll(".awareness-star");
      stars.forEach((star) => {
        gsap.to(star, {
          opacity: "random(0.3, 0.95)",
          scale: "random(0.7, 1.3)",
          duration: "random(1.8, 3.8)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });
    }, awarenessRef);

    // Mouse Spotlight Follow
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

  return (
    <div
      ref={awarenessRef}
      className="relative h-screen overflow-hidden bg-[oklch(0.97_0.018_95)] font-space"
    >
      {/* Background Grids and Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40M40 0L40 40' fill='none' stroke='%236200B9' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div ref={bgBlobsRef} className="absolute inset-0 filter blur-[95px] opacity-60">
          <div className="absolute top-[10%] left-[25%] w-[420px] h-[420px] bg-[oklch(0.82_0.1_295)] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[20%] right-[10%] w-[380px] h-[380px] bg-[oklch(0.83_0.13_55)] rounded-full mix-blend-screen" />
        </div>

        <div
          ref={mouseGlowRef}
          className="absolute w-[200px] h-[200px] rounded-full pointer-events-none bg-gradient-to-r from-[oklch(0.82_0.1_295/0.4)] to-[oklch(0.83_0.13_55/0.4)] filter blur-[50px] mix-blend-screen z-10"
          style={{ transform: "translate3d(0px, 0px, 0)" }}
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1440px] gap-6 p-4 sm:p-5 lg:p-6 z-10">
        {/* Floating Sidebar */}
        <Sidebar />

        {/* Workspace core */}
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-1 pb-6 relative z-10">
          <div className="awareness-fade space-y-6">
            {/* Hero Welcome Header */}
            <header className="flex flex-col space-y-2 relative">
              <Sparkles className="awareness-star absolute top-[-5px] right-[42%] text-[oklch(0.62_0.18_295/0.4)] w-4 h-4" />
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[10px] font-extrabold uppercase text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.15)] flex items-center gap-1 shadow-sm">
                  <GraduationCap className="h-3.5 w-3.5" /> Neural Security Academy
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-500/10 animate-[pulse_3s_infinite]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Scam Intel Active
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight leading-tight">
                Know the patterns, <br />
                <span className="text-gradient animate-[pulse_4s_infinite]">
                  spot them yourself.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl leading-relaxed mt-1">
                A growing field guide to the advanced fraud tactics targeting job seekers in 2026.
                Read once, recognize instantly, stay secure forever.
              </p>
            </header>

            {/* Premium Featured Learning Banner */}
            <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.18_295)] to-transparent opacity-40" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                <div className="space-y-2 max-w-xl font-sans">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-[9px] font-bold text-rose-600 uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Flame className="h-3 w-3 text-rose-500 animate-pulse" /> Critical Alert
                      Pattern
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Updated 4 hours ago
                    </span>
                  </div>
                  <h3 className="font-space text-base sm:text-lg font-extrabold text-[oklch(0.24_0.04_270)]">
                    Advanced Hardware Upfront-Fee Scam Models
                  </h3>
                  <p className="text-xs text-[oklch(0.4_0.03_270)] font-medium leading-relaxed">
                    Scammers send realistic PDFs impersonating Figma or Notion labs. They request
                    that you purchase equipment (MacBooks) from a specified "verified corporate
                    vendor link" and promise instant sign-on check reimbursement. The check is
                    counterfeit.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("Upfront fee");
                    toast.success("Navigated to Red Flag Details");
                  }}
                  className="h-10 px-5.5 rounded-full font-space text-[10px] font-extrabold uppercase tracking-wide text-white shadow-[0_8px_16px_-4px_rgba(120,80,200,0.22),_inset_0_2px_4px_rgba(255,255,255,0.4)] transition-shadow duration-300 hover:shadow-[0_12px_22px_rgba(120,80,200,0.38)] cursor-pointer flex items-center gap-1.5 shrink-0 self-start md:self-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))",
                  }}
                >
                  <span>Verify Telemetries</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* 2-Column Grid Layout: Learning Hub on Left, AI Panel on Right */}
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start">
              {/* Left Column: Interactive Six Red Flags Cards */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-amber-500/10 text-amber-500 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                  </span>
                  <h2 className="text-lg font-extrabold text-[oklch(0.24_0.04_270)] font-space">
                    Audit Radar · Six Red Flags
                  </h2>
                </div>

                <div className="grid gap-4.5 sm:grid-cols-2">
                  {tips.map((t) => {
                    const Icon =
                      (
                        Icons as unknown as Record<
                          string,
                          React.ComponentType<{ className?: string; strokeWidth?: number }>
                        >
                      )[t.icon] || Sparkles;
                    const isOpen = activeTab === t.title;

                    return (
                      <div
                        key={t.title}
                        onClick={() => setActiveTab(isOpen ? null : t.title)}
                        className={`bg-white/75 border rounded-[32px] p-5 shadow-[0_12px_30px_rgba(180,160,200,0.05),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_15px_35px_rgba(180,160,200,0.1)] group cursor-pointer ${
                          isOpen ? "border-[oklch(0.62_0.18_295/0.4)]" : "border-white/80"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="grid h-12.5 w-12.5 place-items-center rounded-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]"
                            style={{ background: `var(--${t.color})` }}
                          >
                            <Icon className="h-6 w-6 text-slate-800" strokeWidth={2} />
                          </div>
                          {/* Alert level badge indicator */}
                          <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[8px] font-bold text-muted-foreground uppercase tracking-widest font-space">
                            Scam Level: Med
                          </span>
                        </div>

                        <h3 className="mt-4 font-space text-sm sm:text-base font-extrabold text-[oklch(0.24_0.04_270)] group-hover:text-[oklch(0.62_0.18_295)] transition-colors duration-300">
                          {t.title}
                        </h3>
                        <p className="mt-2 font-sans text-xs text-muted-foreground leading-relaxed">
                          {t.desc}
                        </p>

                        {/* Smooth Expandable real-world examples (Interactive learning) */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[180px] mt-4 pt-3.5 border-t border-[oklch(0.95_0.01_95)]" : "max-h-0"}`}
                        >
                          <div className="space-y-2.5 font-sans text-[11px] text-[oklch(0.3_0.03_270)]">
                            <p className="bg-rose-50/50 p-2 rounded-xl border border-rose-100">
                              <strong>Classic Phrase:</strong> "We require all selected remote
                              recruits to submit fee verifications before Day 1."
                            </p>
                            <p className="text-muted-foreground font-semibold flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span>Safe Path: Legit firms buy and ship equipment.</span>
                            </p>
                          </div>
                        </div>

                        {/* Interactive toggle link */}
                        <div className="mt-4 flex items-center justify-between text-[9px] font-extrabold uppercase font-space tracking-widest text-[oklch(0.62_0.18_295)] pl-0.5">
                          <span>{isOpen ? "Collapse Details" : "Inspect Patterns"}</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90 text-[oklch(0.62_0.18_295)]" : "text-muted-foreground"}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: AI Panel side-widgets & Checklist */}
              <div className="space-y-5">
                {/* Scam Trend Heatmap Widget */}
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-purple-500/10 text-[oklch(0.62_0.18_295)]">
                      <ShieldAlert className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">
                        Security Intel Index
                      </h4>
                      <p className="text-[9px] text-muted-foreground font-sans">
                        Common threat methods targeting talent segments.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 font-sans text-[11px] text-[oklch(0.3_0.03_270)]">
                    {[
                      { name: "Upfront check hardware traps", value: "High risk profile" },
                      { name: "Recruitment spoofing (Linear, Notion)", value: "Rising vectors" },
                      { name: "WhatsApp job link redirects", value: "Constant vectors" },
                    ].map((pattern, idx) => (
                      <div key={idx} className="flex justify-between font-semibold">
                        <span className="text-muted-foreground truncate pr-2">{pattern.name}</span>
                        <span className="font-extrabold text-rose-500 shrink-0">
                          {pattern.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Scam Types List */}
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-purple-500/10 text-[oklch(0.62_0.18_295)]">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">
                        Common Fraud Profiles
                      </h4>
                      <p className="text-[9px] text-muted-foreground font-sans">
                        Visual matrix cataloguing recruiter traps.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {scamPatterns.map((p) => (
                      <div key={p.name} className="flex gap-3">
                        <span className="h-full w-1 shrink-0 rounded-full bg-slate-400 inline-block min-h-[30px]" />
                        <div className="font-sans text-[11px] leading-relaxed text-[oklch(0.3_0.03_270)]">
                          <p className="font-extrabold text-[oklch(0.24_0.04_270)]">{p.name}</p>
                          <p className="text-muted-foreground mt-0.5">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3-Second Cybersecurity Guide Checklist */}
            <div className="bg-white/75 border border-white/80 rounded-[40px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(180,160,200,0.08),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[oklch(0.24_0.04_270)] font-space">
                  The 3-Second Audit Rule
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                  Before replying to any outreach message, click, or invitation, ask yourself three
                  security verification questions:
                </p>

                <ul className="mt-5 space-y-3.5 font-sans text-xs sm:text-[13px] text-[oklch(0.3_0.03_270)] font-semibold">
                  <li className="flex items-start gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-purple-50 text-[10px] font-bold text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.1)]">
                      1
                    </span>
                    <span>
                      Does the sender's email domain match the exact corporate website registry?
                      (Not globalhire@gmail.com)
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-purple-50 text-[10px] font-bold text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.1)]">
                      2
                    </span>
                    <span>
                      Did you initiate an application process, or did this offer appear unprompted?
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-purple-50 text-[10px] font-bold text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.1)]">
                      3
                    </span>
                    <span>
                      Are they demanding upfront payments, crypto, hardware vendor purchases, or
                      sensitive credentials before live interviews?
                    </span>
                  </li>
                </ul>
              </div>

              <div className="clay-inset grid place-items-center p-8 text-center rounded-[32px] border border-white/60 bg-[oklch(0.95_0.01_95)]">
                <p className="font-space text-5xl sm:text-6xl font-extrabold text-gradient leading-none">
                  3s
                </p>
                <p className="mt-2 text-xs font-bold text-[oklch(0.24_0.04_270)] font-space uppercase tracking-wider">
                  All it takes to dodge a scam
                </p>
                <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
                  Protecting assets is seconds away.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
