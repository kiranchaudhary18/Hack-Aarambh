import { Link } from "react-router-dom";
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
  Calendar,
  X,
  ChevronDown,
  Trash2,
  Download,
  Check,
  CheckSquare,
  Square,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

type FilterT = "all" | "scam" | "suspicious" | "safe" | "bookmarked";
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

export function History() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<FilterT>("all");
  const [view, setView] = useState<View>("list");
  const [recentChecks, setRecentChecks] = useState<JobCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [scoreRange, setScoreRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [sourceFilter, setSourceFilter] = useState<"all" | "text" | "pdf" | "url">("all");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleBookmark = (id: string) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
    } else {
      newBookmarks.add(id);
    }
    setBookmarkedItems(newBookmarks);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filtered.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    if (confirm(`Delete ${selectedItems.size} selected items?`)) {
      setRecentChecks(recentChecks.filter((c) => !selectedItems.has(c.id)));
      setSelectedItems(new Set());
    }
  };

  const handleBulkExport = () => {
    if (selectedItems.size === 0) return;
    const selectedData = filtered.filter((c) => selectedItems.has(c.id));
    const csv = [
      ["Title", "Company", "Score", "Verdict", "Date", "Source"],
      ...selectedData.map((c) => [
        c.title,
        c.company,
        c.score,
        c.verdict,
        c.date,
        c.source || "text",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scam-history-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    document.title = "History — ScamSniff";
  }, []);

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

  const filtered = searched.filter((c) => {
    // Bookmark filter (only show bookmarked if f is "bookmarked")
    if (f === "bookmarked" && !bookmarkedItems.has(c.id)) return false;

    // Verdict filter (skip if f is "bookmarked")
    if (f !== "all" && f !== "bookmarked" && c.verdict !== f) return false;

    // Source filter
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false;

    // Score range filter
    if (c.score < scoreRange.min || c.score > scoreRange.max) return false;

    // Date range filter
    if (dateRange.from || dateRange.to) {
      const itemDate = new Date(c.date);
      if (dateRange.from && itemDate < new Date(dateRange.from)) return false;
      if (dateRange.to && itemDate > new Date(dateRange.to)) return false;
    }

    return true;
  });

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
                  <button
                    onClick={toggleSelectAll}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition text-muted-foreground hover:text-foreground"
                  >
                    {selectedItems.size === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="h-3.5 w-3.5" />
                    ) : (
                      <Square className="h-3.5 w-3.5" />
                    )}
                    Select all
                  </button>
                  {(["all", "scam", "suspicious", "safe", "bookmarked"] as FilterT[]).map((opt) => (
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
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`clay-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${showAdvancedFilters ? "clay-primary" : ""}`}
              >
                <Filter className="h-4 w-4" /> Advanced
                <ChevronDown
                  className={`h-4 w-4 transition ${showAdvancedFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </FadeIn>

          {showAdvancedFilters && (
            <FadeIn delay={0.05}>
              <div className="clay p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold">Advanced Filters</h3>
                  <button
                    onClick={() => {
                      setDateRange({ from: "", to: "" });
                      setScoreRange({ min: 0, max: 100 });
                      setSourceFilter("all");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        className="clay-inset flex-1 px-3 py-2 text-sm"
                      />
                      <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        className="clay-inset flex-1 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Score Range ({scoreRange.min}% - {scoreRange.max}%)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scoreRange.min}
                        onChange={(e) =>
                          setScoreRange({ ...scoreRange, min: parseInt(e.target.value) })
                        }
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scoreRange.max}
                        onChange={(e) =>
                          setScoreRange({ ...scoreRange, max: parseInt(e.target.value) })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Source
                    </label>
                    <div className="clay-inset inline-flex gap-1 p-1">
                      {(["all", "text", "pdf", "url"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSourceFilter(opt)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${sourceFilter === opt ? "clay-primary" : "text-muted-foreground"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {selectedItems.size > 0 && (
            <FadeIn delay={0.05}>
              <div className="clay p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{selectedItems.size} selected</span>
                    <button
                      onClick={() => setSelectedItems(new Set())}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkExport}
                      className="clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                    >
                      <Download className="h-4 w-4" /> Export
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[color:var(--destructive)]"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

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
                <ListRow
                  key={c.id}
                  c={c}
                  isSelected={selectedItems.has(c.id)}
                  onToggle={() => toggleSelection(c.id)}
                  isBookmarked={bookmarkedItems.has(c.id)}
                  onBookmark={() => toggleBookmark(c.id)}
                />
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

function ListRow({ c, isSelected, onToggle, isBookmarked, onBookmark }: { c: JobCheck; isSelected: boolean; onToggle: () => void; isBookmarked: boolean; onBookmark: () => void }) {
  const tone = toneFor(c.verdict);
  return (
    <div className="clay flex items-center gap-4 p-5 transition hover:-translate-y-0.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="shrink-0"
      >
        {isSelected ? (
          <CheckSquare className="h-5 w-5 text-[color:var(--primary)]" />
        ) : (
          <Square className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <Link to={`/result?id=${c.id}`} className="flex min-w-0 flex-1 items-center gap-4">
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookmark();
        }}
        className="shrink-0"
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-5 w-5 text-[color:var(--primary)]" />
        ) : (
          <Bookmark className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    </div>
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

function KanbanCol({verdict, items }: { verdict: "scam" | "suspicious" | "safe"; items: JobCheck[] }) {
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
            to={`/result?id=${c.id}`}
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
