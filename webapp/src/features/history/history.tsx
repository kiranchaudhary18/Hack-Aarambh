import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import {
  Search,
  Filter,
  FileText,
  Link2,
  ScanSearch,
  LayoutList,
  LayoutGrid,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — ScamSniff" },
      { name: "description", content: "Every offer you've scanned, sorted and searchable." },
    ],
  }),
  component: History,
});

type FilterT = "all" | "scam" | "suspicious" | "safe";
type View = "list" | "kanban";

interface JobCheck {
  id: string;
  title: string;
  company: string;
  snippet: string;
  verdict: "scam" | "suspicious" | "safe";
  score: number;
  date: string;
  source?: "text" | "pdf" | "url";
}

function History() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<FilterT>("all");
  const [view, setView] = useState<View>("list");
  const [recentChecks, setRecentChecks] = useState<JobCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching history from API...");
        const data = await api.getHistory();
        console.log("History data received:", data);
        setRecentChecks(data || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        setRecentChecks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const searched = recentChecks.filter((c) => {
    const searchText = `${c.title || ""} ${c.company || ""} ${c.snippet || ""}`.toLowerCase();
    return searchText.includes(q.toLowerCase());
  });
  const filtered = searched.filter((c) => (f === "all" ? true : c.verdict === f));

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <p className="clay-pill inline-block">History</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Every offer you've sniffed
            </h1>
            <p className="mt-2 text-muted-foreground">
              Search, filter, revisit. Nothing leaves your account.
            </p>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="clay flex flex-wrap items-center gap-3 p-4">
              <div className="clay-inset flex flex-1 items-center gap-2 px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by company, title, or content"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              {view === "list" && (
                <div className="clay-inset inline-flex gap-1 p-1">
                  {(["all", "scam", "suspicious", "safe"] as FilterT[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setF(opt)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${f === opt ? "clay-primary" : "text-muted-foreground"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <div className="clay-inset inline-flex gap-1 p-1">
                <button
                  onClick={() => setView("list")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === "list" ? "clay-primary" : "text-muted-foreground"}`}
                >
                  <LayoutList className="h-3.5 w-3.5" /> List
                </button>
                <button
                  onClick={() => setView("kanban")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === "kanban" ? "clay-primary" : "text-muted-foreground"}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Kanban
                </button>
              </div>
              <button className="clay-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold">
                <Filter className="h-4 w-4" /> Date
              </button>
            </div>
          </FadeIn>

          {loading ? (
            <div className="clay p-12 text-center">
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : recentChecks.length === 0 ? (
            <div className="clay p-12 text-center">
              <p className="font-display text-2xl font-bold">No history yet</p>
              <p className="text-muted-foreground">Start scanning job offers to see them here.</p>
              <Link
                to="/analyze"
                className="mt-4 inline-flex items-center gap-2 clay-primary px-4 py-2 text-sm font-semibold"
              >
                <ScanSearch className="h-4 w-4" /> Scan an offer
              </Link>
            </div>
          ) : view === "list" ? (
            <StaggerChildren className="grid gap-4">
              {filtered.length === 0 && <EmptyState />}
              {filtered.map((c) => (
                <ListRow key={c.id} c={c} />
              ))}
            </StaggerChildren>
          ) : (
            <FadeIn delay={0.05}>
              <div className="grid gap-4 md:grid-cols-3">
                <KanbanCol verdict="scam" items={searched.filter((c) => c.verdict === "scam")} />
                <KanbanCol
                  verdict="suspicious"
                  items={searched.filter((c) => c.verdict === "suspicious")}
                />
                <KanbanCol verdict="safe" items={searched.filter((c) => c.verdict === "safe")} />
              </div>
            </FadeIn>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="clay p-12 text-center">
      <p className="font-display text-2xl font-bold">No matches</p>
      <p className="text-muted-foreground">Try a different keyword.</p>
    </div>
  );
}

function toneFor(v: "scam" | "suspicious" | "safe") {
  return v === "scam"
    ? "var(--clay-pink)"
    : v === "suspicious"
      ? "var(--clay-yellow)"
      : "var(--clay-green)";
}

function ListRow({ c }: { c: JobCheck }) {
  const tone = toneFor(c.verdict);
  return (
    <Link
      to="/result"
      search={{ id: c.id }}
      className="clay flex items-center gap-4 p-5 transition hover:-translate-y-0.5"
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
        style={{ background: tone }}
      >
        {c.source === "pdf" ? (
          <FileText className="h-6 w-6" />
        ) : c.source === "url" ? (
          <Link2 className="h-6 w-6" />
        ) : (
          <ScanSearch className="h-6 w-6" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-bold">{c.title}</h3>
          <span className="clay-pill text-[10px] uppercase">{c.source}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {c.company} · {c.date}
        </p>
        <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">{c.snippet}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-3xl font-bold">
          {c.score}
          <span className="text-base text-muted-foreground">%</span>
        </p>
        <span
          className="clay-pill mt-1 inline-block text-[10px] uppercase"
          style={{ background: tone }}
        >
          {c.verdict}
        </span>
      </div>
    </Link>
  );
}

const colMeta: Record<
  "scam" | "suspicious" | "safe",
  { label: string; icon: React.ComponentType<{ className?: string }>; desc: string }
> = {
  scam: { label: "Confirmed scam", icon: ShieldAlert, desc: "High-risk offers — do not reply." },
  suspicious: {
    label: "Suspicious",
    icon: AlertTriangle,
    desc: "Mixed signals — verify before engaging.",
  },
  safe: {
    label: "Likely safe",
    icon: ShieldCheck,
    desc: "Clean signals, proceed with normal care.",
  },
};

function KanbanCol({ verdict, items }: { verdict: "scam" | "suspicious" | "safe"; items: JobCheck[] }) {
  const meta = colMeta[verdict];
  const Icon = meta.icon;
  const tone = toneFor(verdict);
  return (
    <div className="clay flex max-h-[calc(100vh-18rem)] flex-col p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: tone }}>
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider">{meta.label}</p>
            <p className="text-[11px] text-muted-foreground">{meta.desc}</p>
          </div>
        </div>
        <span className="clay-pill text-[10px]">{items.length}</span>
      </div>

      <div className="hide-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 && (
          <div className="clay-inset p-4 text-center text-xs text-muted-foreground">
            Nothing here yet.
          </div>
        )}
        {items.map((c) => (
          <Link
            to="/result"
            search={{ id: c.id }}
            key={c.id}
            className="clay-sm block p-4 transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-2">
              {c.source && <span className="clay-pill text-[10px] uppercase">{c.source}</span>}
              <span className="font-display text-lg font-bold">{c.score}%</span>
            </div>
            <h4 className="mt-2 line-clamp-2 font-display text-sm font-bold leading-snug">
              {c.title}
            </h4>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              {c.company} · {c.date}
            </p>
            <div className="clay-inset mt-3 h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full"
                style={{ width: `${c.score}%`, background: tone }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
