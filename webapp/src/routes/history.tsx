import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { recentChecks, type JobCheck, type Verdict } from "@/lib/mockData";
import { 
  Search, Filter, FileText, Link2, ScanSearch, LayoutList, LayoutGrid, 
  ShieldAlert, AlertTriangle, ShieldCheck, Sparkles, Calendar, ArrowRight,
  TrendingUp, Terminal, Info, Database, BarChart2
} from "lucide-react";
import { gsap } from "gsap";

export const Route = createFileRoute("/history")({
  head: () => ({ 
    meta: [
      { title: "AI Threat Archive — ScamSniff" }, 
      { name: "description", content: "Every job offer scanned, audited, and catalogued." }
    ] 
  }),
  component: History,
});

type FilterT = "all" | "scam" | "suspicious" | "safe";
type View = "list" | "kanban";

function History() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<FilterT>("all");
  const [view, setView] = useState<View>("list");
  const [activeDateFilter, setActiveDateFilter] = useState("all-time");

  const archiveRef = useRef<HTMLDivElement>(null);
  const bgBlobsRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  // Filter Checks by search and verdict
  const searched = recentChecks.filter((c) =>
    (c.title + c.company + c.snippet).toLowerCase().includes(q.toLowerCase())
  );
  const filtered = searched.filter((c) => (f === "all" ? true : c.verdict === f));

  // Stagger entry layout animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".archive-fade > *", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }
      );

      // Slow float on blobs
      const blobs = bgBlobsRef.current?.children;
      if (blobs) {
        gsap.to(blobs[0], { x: "15vw", y: "12vh", duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(blobs[1], { x: "-12vw", y: "-15vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      // Twinkling stars
      const stars = document.querySelectorAll(".archive-star");
      stars.forEach((star) => {
        gsap.to(star, {
          opacity: "random(0.3, 0.95)",
          scale: "random(0.7, 1.3)",
          duration: "random(2.0, 4.0)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      });
    }, archiveRef);

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

  return (
    <div ref={archiveRef} className="relative h-screen overflow-hidden bg-[oklch(0.97_0.018_95)] font-space">
      
      {/* Background Grids and Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40M40 0L40 40' fill='none' stroke='%236200B9' stroke-width='1'/%3E%3C/svg%3E")`
          }}
        />

        <div ref={bgBlobsRef} className="absolute inset-0 filter blur-[95px] opacity-60">
          <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-[oklch(0.82_0.1_295)] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[15%] right-[15%] w-[360px] h-[360px] bg-[oklch(0.83_0.13_55)] rounded-full mix-blend-screen" />
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
        <main className="hide-scrollbar min-w-0 flex-1 space-y-5 lg:space-y-6 overflow-y-auto pr-1 pb-6 relative">
          
          <div className="archive-fade space-y-5 lg:space-y-6">
            
            {/* Hero Welcome Header */}
            <header className="flex flex-col space-y-2 relative">
              <Sparkles className="archive-star absolute top-[-5px] right-[45%] text-[oklch(0.62_0.18_295/0.4)] w-4 h-4" />
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[10px] font-extrabold uppercase text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.15)] flex items-center gap-1 shadow-sm">
                  <Database className="h-3 w-3" /> Secure Telemetry Vault
                </span>
                
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-500/10">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Database Audited
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight">
                Every offer you've sniffed.
              </h1>
              
              {/* Stats telemetry */}
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground font-sans">
                <span>Total resolved: <strong>{recentChecks.length} cases</strong></span>
                <span className="h-3.5 w-px bg-gray-300" />
                <span>Scams Caught: <strong>3 files</strong></span>
                <span className="h-3.5 w-px bg-gray-300" />
                <span>Protection accuracy: <strong>99.8%</strong></span>
              </div>
            </header>

            {/* Premium Search & Filter Toolbar */}
            <div className="bg-white/75 border border-white/80 rounded-[32px] p-4 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="clay-inset flex flex-1 items-center gap-2.5 px-4 py-2.5 min-w-[240px]">
                <Search className="h-4.5 w-4.5 text-muted-foreground" />
                <input 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)} 
                  placeholder="Search by company, title, or threat reasons..." 
                  className="flex-1 bg-transparent text-xs sm:text-sm font-semibold outline-none text-[oklch(0.24_0.04_270)] placeholder:text-muted-foreground/60 font-sans" 
                />
              </div>

              {/* Layout view controls */}
              <div className="flex items-center gap-3">
                
                {/* List/Kanban toggles */}
                <div className="clay-inset inline-flex gap-1 p-1 rounded-full">
                  <button 
                    onClick={() => setView("list")} 
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-all duration-300 font-space ${
                      view === "list" ? "clay-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutList className="h-3.5 w-3.5" /> <span>List View</span>
                  </button>
                  <button 
                    onClick={() => setView("kanban")} 
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-all duration-300 font-space ${
                      view === "kanban" ? "clay-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" /> <span>Board View</span>
                  </button>
                </div>

                {/* Date Dropdown */}
                <button 
                  onClick={() => {
                    setActiveDateFilter(prev => prev === "all-time" ? "this-week" : "all-time");
                    toast.success(`Active filter: ${activeDateFilter === "all-time" ? "This Week" : "All Time"}`);
                  }}
                  className="h-10 px-4 rounded-full border border-[oklch(0.88_0.02_95)] text-[10px] font-extrabold uppercase tracking-wider text-[oklch(0.3_0.03_270)] bg-white/75 hover:bg-white hover:border-[oklch(0.62_0.18_295/0.2)] hover:shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer font-space flex items-center gap-1.5"
                >
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>{activeDateFilter === "all-time" ? "All Time" : "This Week"}</span>
                </button>

              </div>
            </div>

            {/* Filter segments if List View */}
            {view === "list" && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 max-w-full">
                {([
                  { id: "all", label: "All Audits" },
                  { id: "scam", label: "Scams Caught" },
                  { id: "suspicious", label: "Suspicious Cases" },
                  { id: "safe", label: "Safe Verified" },
                ] as { id: FilterT; label: string }[]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setF(tab.id)}
                    className={`px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-wide border cursor-pointer transition-all duration-300 shrink-0 font-space ${
                      f === tab.id 
                        ? "bg-[oklch(0.24_0.04_270)] text-white border-[oklch(0.24_0.04_270)] shadow-md" 
                        : "bg-white/80 text-muted-foreground border-[oklch(0.9_0.02_95)] hover:bg-white hover:text-foreground hover:shadow-sm"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Results Wrapper */}
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start">
              
              {/* Left Column: List or Kanban board results */}
              <div className="space-y-4">
                {view === "list" ? (
                  <div className="space-y-4">
                    {filtered.length === 0 && <EmptyState />}
                    {filtered.map((c) => (
                      <ListRow key={c.id} c={c} />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4.5 sm:grid-cols-3 items-start">
                    <KanbanCol verdict="scam" items={searched.filter((c) => c.verdict === "scam")} />
                    <KanbanCol verdict="suspicious" items={searched.filter((c) => c.verdict === "suspicious")} />
                    <KanbanCol verdict="safe" items={searched.filter((c) => c.verdict === "safe")} />
                  </div>
                )}
              </div>

              {/* Right Column: AI Insights Side Panel */}
              <div className="space-y-4.5">
                
                {/* AI Safety Metrics Widget */}
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-purple-500/10 text-[oklch(0.62_0.18_295)]">
                      <BarChart2 className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">Telemetry Audit Rates</h4>
                      <p className="text-[9px] text-muted-foreground font-sans">Active threat indices tracked today.</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3.5 font-sans text-[11px] text-[oklch(0.3_0.03_270)]">
                    {[
                      { l: "Scams intercepted", v: "3 cases", c: "text-rose-600" },
                      { l: "Average verification score", v: "92% integrity", c: "text-emerald-600" },
                      { l: "Total audited files size", v: "18.4 MB PDF/text", c: "text-[oklch(0.24_0.04_270)]" },
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between font-semibold">
                        <span className="text-muted-foreground">{row.l}</span>
                        <span className={`font-extrabold ${row.c}`}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations Panel */}
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-purple-500/10 text-[oklch(0.62_0.18_295)]">
                      <Sparkles className="h-4.5 w-4.5 text-[oklch(0.62_0.18_295)]" />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">Neural Recommendations</h4>
                      <p className="text-[9px] text-muted-foreground font-sans">Safety metrics issued by the AI copilot.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/50 rounded-2xl border border-[oklch(0.62_0.18_295/0.1)] flex items-start gap-2.5">
                    <Info className="h-4.5 w-4.5 text-[oklch(0.62_0.18_295)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[oklch(0.3_0.03_270)] font-sans leading-relaxed">
                      <strong>Audit logs verified:</strong> 100% of your safe verified hires have structured process paths. Avoid off-platform WhatsApp requests.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Empty state block
function EmptyState() {
  return (
    <div className="bg-white/75 border border-white/80 rounded-[32px] p-12 text-center shadow-sm backdrop-blur-xl">
      <Info className="h-8 w-8 text-muted-foreground/40 mx-auto" />
      <p className="font-space text-lg font-extrabold text-[oklch(0.24_0.04_270)] mt-3">No matching audit files resolved</p>
      <p className="text-xs text-muted-foreground font-sans mt-1">Try another company name, title, or search criteria.</p>
    </div>
  );
}

// Verdict colors
function toneFor(v: Verdict) {
  return v === "scam" ? "bg-rose-500/10 text-rose-600 border-rose-100/40" : v === "suspicious" ? "bg-amber-500/10 text-amber-600 border-amber-100/40" : "bg-emerald-500/10 text-emerald-600 border-emerald-100/40";
}

// ListRow component with luxury cards and preview section
function ListRow({ c }: { c: JobCheck }) {
  const toneClass = toneFor(c.verdict);
  return (
    <Link 
      to="/result" 
      search={{ id: c.id }} 
      className="bg-white/75 border border-white/80 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:translate-x-1.5 hover:shadow-[0_18px_40px_rgba(180,160,200,0.12)] group cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Source Icon container */}
        <span className={`grid h-12.5 w-12.5 shrink-0 place-items-center rounded-2xl border shadow-sm ${toneClass}`}>
          {c.source === "pdf" ? <FileText className="h-5.5 w-5.5" /> : c.source === "url" ? <Link2 className="h-5.5 w-5.5" /> : <ScanSearch className="h-5.5 w-5.5" />}
        </span>
        
        {/* Title Details */}
        <div className="min-w-0 flex-1 font-sans">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-space text-sm sm:text-base font-extrabold text-[oklch(0.24_0.04_270)] group-hover:text-[oklch(0.62_0.18_295)] transition-colors duration-300">{c.title}</h3>
            <span className="px-2 py-0.5 rounded bg-gray-100 text-[8px] font-bold text-muted-foreground uppercase tracking-wider border border-gray-200 shadow-sm">{c.source}</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{c.company} · {c.date}</p>
          <p className="mt-2 line-clamp-1 text-xs text-[oklch(0.4_0.03_270)] font-medium bg-gray-50/50 p-1.5 px-2.5 rounded-lg border border-gray-100/50">{c.snippet}</p>
        </div>
      </div>

      {/* Score and Verdict pill */}
      <div className="text-right flex items-center md:flex-col gap-3 md:gap-0 justify-between shrink-0 pl-16 md:pl-0">
        <p className="font-space text-3xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight">
          {c.score}<span className="text-sm text-muted-foreground">%</span>
        </p>
        <span 
          className={`clay-pill text-[9px] font-extrabold uppercase font-space px-3 py-1 flex items-center gap-1.5 shadow-sm border mt-1 shrink-0 ${
            c.verdict === "scam" 
              ? "bg-rose-50 border-rose-100 text-rose-600" 
              : c.verdict === "suspicious" 
              ? "bg-amber-50 border-amber-100 text-amber-600" 
              : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full inline-block ${
            c.verdict === "scam" 
              ? "bg-rose-500 animate-ping" 
              : c.verdict === "suspicious" 
              ? "bg-amber-500" 
              : "bg-emerald-500"
          }`} />
          <span>{c.verdict}</span>
        </span>
      </div>
    </Link>
  );
}

// KanbanColumn metadata
const colMeta: Record<Verdict, { label: string; icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  scam: { label: "Confirmed scam", icon: ShieldAlert, desc: "High-risk offers — do not reply." },
  suspicious: { label: "Suspicious", icon: AlertTriangle, desc: "Mixed signals — verify first." },
  safe: { label: "Likely safe", icon: ShieldCheck, desc: "Clean signals, proceed normally." },
};

// Kanban Column component
function KanbanCol({ verdict, items }: { verdict: Verdict; items: JobCheck[] }) {
  const meta = colMeta[verdict];
  const Icon = meta.icon;
  const toneClass = toneFor(verdict);
  return (
    <div className="bg-white/75 border border-white/80 rounded-[32px] p-4 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col max-h-[calc(100vh-17.5rem)] relative overflow-hidden">
      
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[oklch(0.95_0.01_95)]">
        <div className="flex items-center gap-2">
          <span className={`grid h-8.5 w-8.5 place-items-center rounded-xl border ${toneClass}`}>
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-space text-xs font-extrabold uppercase text-[oklch(0.24_0.04_270)] tracking-wide">{meta.label}</p>
            <p className="text-[9px] text-muted-foreground font-sans font-semibold leading-tight">{meta.desc}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-gray-100 text-[9px] font-bold text-muted-foreground font-space border border-gray-200 shadow-sm">{items.length}</span>
      </div>

      {/* Cards inside Kanban column */}
      <div className="hide-scrollbar mt-4 flex-1 space-y-3.5 overflow-y-auto pr-0.5">
        {items.length === 0 && (
          <div className="clay-inset p-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-space">
            Clean telemetries
          </div>
        )}
        {items.map((c) => (
          <Link 
            to="/result" 
            search={{ id: c.id }} 
            key={c.id} 
            className="bg-white border border-[oklch(0.88_0.02_95)] rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-[oklch(0.62_0.18_295/0.25)] block cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded bg-gray-100 text-[8px] font-bold text-muted-foreground uppercase tracking-wider border border-gray-200 shadow-sm">{c.source}</span>
              <span className="font-space text-base font-extrabold text-[oklch(0.24_0.04_270)]">{c.score}%</span>
            </div>
            
            <h4 className="mt-2.5 line-clamp-2 font-space text-xs font-bold leading-relaxed text-[oklch(0.24_0.04_270)] group-hover:text-[oklch(0.62_0.18_295)] transition-colors duration-300">{c.title}</h4>
            <p className="mt-1 truncate text-[9.5px] text-muted-foreground font-semibold font-sans">{c.company} · {c.date}</p>
            
            {/* Custom linear progress bar representing risk index */}
            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-3 overflow-hidden relative">
              <div 
                className={`h-full rounded-full ${
                  verdict === "scam" ? "bg-rose-500" : verdict === "suspicious" ? "bg-amber-500" : "bg-emerald-500"
                }`} 
                style={{ width: `${c.score}%` }} 
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
