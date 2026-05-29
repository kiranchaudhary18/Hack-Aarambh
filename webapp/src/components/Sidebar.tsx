import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  BookOpen,
  User,
  ShieldCheck,
  LogOut,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/awareness", label: "Awareness", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stagger entry animation for sidebar elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sidebar-stagger > *",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <aside ref={containerRef} className="hidden w-[270px] shrink-0 lg:block h-full relative z-20">
      {/* Premium Translucent Floating Glass Panel */}
      <div className="sidebar-stagger w-full h-full bg-white/70 backdrop-blur-[24px] rounded-[32px] border border-white/80 shadow-[0_20px_50px_-12px_rgba(150,130,180,0.15),_inset_0_2px_4px_rgba(255,255,255,0.9),_inset_0_-2px_4px_rgba(180,160,200,0.06)] p-5 flex flex-col justify-between overflow-hidden relative group">
        {/* Glow backdrop light behind the logo inside sidebar */}
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 rounded-full bg-[oklch(0.82_0.1_295/0.12)] filter blur-2xl pointer-events-none" />

        {/* TOP: Brand Identity & AI Badge */}
        <div className="space-y-4">
          {/* Logo with interactive scale */}
          <Link to="/" className="group flex items-center gap-2.5 px-2.5 py-1">
            <span className="grid h-10 w-10 place-items-center rounded-2xl clay-primary relative z-10 transition-transform duration-300 group-hover:scale-105 shadow-[0_8px_16px_-4px_rgba(120,80,200,0.25)]">
              <ShieldCheck
                className="h-5.5 w-5.5 text-white animate-[pulse_2.5s_infinite]"
                strokeWidth={2.5}
              />
            </span>
            <div className="flex flex-col">
              <span className="font-space text-lg font-extrabold tracking-tight text-[oklch(0.24_0.04_270)]">
                Scam<span className="text-gradient">Sniff</span>
              </span>
              {/* AI Badge inside logo */}
              <span className="text-[7.5px] font-bold text-[oklch(0.62_0.18_295)] tracking-wider uppercase font-space flex items-center gap-0.5 mt-0.5">
                <Sparkles className="h-2 w-2" /> Neural Active
              </span>
            </div>
          </Link>

          {/* AI Protection Active badge */}
          <div className="mx-2.5 px-3 py-1.5 rounded-2xl bg-emerald-50/50 border border-emerald-500/10 flex items-center justify-between shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9)]">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold text-emerald-800 font-space tracking-wider uppercase">
                Shield: Protected
              </span>
            </div>
            <span className="text-[8px] font-extrabold text-emerald-600 bg-white/80 px-1.5 py-0.5 rounded-md border border-emerald-500/10 shadow-sm">
              99.8%
            </span>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.03_270/0.4)] to-transparent" />

          {/* MIDDLE: Premium Translucent Navigation Tabs */}
          <nav className="flex flex-col gap-1.5">
            {items.map((it) => {
              const Icon = it.icon;
              const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onMouseEnter={() => setHoveredTab(it.to)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[12.5px] font-extrabold tracking-wide uppercase font-space transition-all duration-300 z-10 cursor-pointer ${
                    active
                      ? "text-white shadow-[0_8px_16px_-4px_rgba(120,80,200,0.2),_inset_0_2px_4px_rgba(255,255,255,0.4)]"
                      : "text-muted-foreground hover:text-[oklch(0.24_0.04_270)]"
                  }`}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))",
                        }
                      : undefined
                  }
                >
                  {/* Sliding hover glass background */}
                  {!active && hoveredTab === it.to && (
                    <div className="absolute inset-0 bg-purple-50 rounded-2xl border border-[oklch(0.82_0.1_295/0.15)] shadow-[0_4px_12px_rgba(180,160,200,0.06),_inset_0_1px_2px_rgba(255,255,255,0.8)] -z-10 animate-[fade-in_0.2s_ease-out]" />
                  )}

                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ${hoveredTab === it.to ? "scale-110 rotate-3" : ""}`}
                    strokeWidth={active ? 2.5 : 2.2}
                  />
                  <span>{it.label}</span>

                  {/* Active pulsing glow dot */}
                  {active && (
                    <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM: Plan usage, User profile & support */}
        <div className="space-y-4">
          {/* Plan usage progress card */}
          <div className="mx-1 px-3.5 py-3 rounded-2xl bg-[oklch(0.97_0.01_95)] border border-[oklch(0.9_0.02_95)] shadow-[inset_1px_1px_2px_rgba(180,160,200,0.08),_inset_-1px_-1px_2px_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Guard Scope</span>
              <span className="text-[oklch(0.62_0.18_295)] font-extrabold font-space">
                Premium Free
              </span>
            </div>
            <p className="font-space text-[14.5px] font-extrabold text-[oklch(0.24_0.04_270)] mt-1.5">
              12 / 20 scans
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200/80 p-[1.5px] relative">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: "60%",
                  background: "linear-gradient(90deg, oklch(0.68 0.16 295), oklch(0.83 0.13 55))",
                }}
              />
              {/* Glow peak */}
              <div className="absolute top-0 bottom-0 left-[60%] w-2 h-full bg-white/60 blur-[1px]" />
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.03_270/0.4)] to-transparent" />

          {/* User mini profile and Help block */}
          <div className="space-y-2.5">
            {/* User Mini Profile Section */}
            <div className="flex items-center gap-3 px-2">
              <div className="relative">
                {/* Avatar with luxury clay border */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[oklch(0.82_0.1_295)] to-[oklch(0.85_0.12_70)] p-[2px] shadow-md">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center font-space text-[11px] font-extrabold text-[oklch(0.24_0.04_270)]">
                    AK
                  </div>
                </div>
                {/* Live online dot */}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-space text-xs font-extrabold text-[oklch(0.24_0.04_270)] truncate">
                  Aisha Khan
                </span>
                <span className="text-[9.5px] font-semibold text-muted-foreground truncate">
                  aisha@scamsniff.ai
                </span>
              </div>
            </div>

            {/* Support help button and Sign out */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 h-9 rounded-xl border border-[oklch(0.88_0.02_95)] text-[10px] font-bold uppercase tracking-wider text-[oklch(0.3_0.03_270)] bg-white/75 hover:bg-white hover:border-[oklch(0.62_0.18_295/0.2)] hover:shadow-sm transition-all duration-200 cursor-pointer font-space"
              >
                <HelpCircle className="h-3.5 w-3.5 text-purple-400" /> Help
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-1.5 h-9 rounded-xl border border-transparent text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-200 font-space"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation imports */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </aside>
  );
}
