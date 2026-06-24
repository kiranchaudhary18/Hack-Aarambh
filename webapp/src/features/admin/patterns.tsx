import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import {
  Search,
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
} from "lucide-react";

interface PatternData {
  id: string;
  name: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  keywords: string[];
  detectionRate: number;
  falsePositiveRate: number;
  status: "active" | "inactive" | "testing";
  lastUpdated: string;
  createdBy: string;
}

export function Patterns() {
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    document.title = "Pattern Management — ScamSniff";
  }, []);

  useEffect(() => {
    async function fetchPatterns() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/patterns`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPatterns(data);
        } else {
          setPatterns([]);
        }
      } catch (error) {
        console.error("Failed to fetch patterns:", error);
        setPatterns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPatterns();
  }, []);

  const filteredPatterns = patterns.filter((pattern) => {
    const matchesSearch =
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || pattern.category === categoryFilter;
    const matchesSeverity = severityFilter === "all" || pattern.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || pattern.status === statusFilter;
    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const togglePatternSelection = (patternId: string) => {
    const newSelection = new Set(selectedPatterns);
    if (newSelection.has(patternId)) {
      newSelection.delete(patternId);
    } else {
      newSelection.add(patternId);
    }
    setSelectedPatterns(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedPatterns.size === filteredPatterns.length) {
      setSelectedPatterns(new Set());
    } else {
      setSelectedPatterns(new Set(filteredPatterns.map((p) => p.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete") {
      if (confirm(`Delete ${selectedPatterns.size} patterns?`)) {
        setPatterns(patterns.filter((p) => !selectedPatterns.has(p.id)));
        setSelectedPatterns(new Set());
      }
    } else if (action === "activate") {
      setPatterns(
        patterns.map((p) =>
          selectedPatterns.has(p.id) ? { ...p, status: "active" as const } : p
        )
      );
      setSelectedPatterns(new Set());
    } else if (action === "deactivate") {
      setPatterns(
        patterns.map((p) =>
          selectedPatterns.has(p.id) ? { ...p, status: "inactive" as const } : p
        )
      );
      setSelectedPatterns(new Set());
    }
  };

  const categories = [...new Set(patterns.map((p) => p.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Pattern Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage scam detection patterns, keywords, and rules.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="clay p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patterns by name, description, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-inset w-full pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
                  showFilters ? "is-on" : ""
                }`}
              >
                <Filter className="h-4 w-4" /> Filters
                <ChevronDown
                  className={`h-4 w-4 transition ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> Add pattern
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border-2 border-dashed p-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Severity
                </label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
            </div>
          )}

          {selectedPatterns.size > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[color:var(--accent)] p-4">
              <span className="text-sm font-semibold">
                {selectedPatterns.size} pattern{selectedPatterns.size !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPatterns(new Set())}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold"
                >
                  Clear selection
                </button>
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold text-[color:var(--destructive)]"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="clay-sm p-5 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePatternSelection(pattern.id)}
                      className="shrink-0"
                    >
                      {selectedPatterns.has(pattern.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-[color:var(--primary)]" />
                      ) : (
                        <div className="h-5 w-5 rounded border-2 border-border" />
                      )}
                    </button>
                    <span
                      className="grid h-10 w-10 place-items-center rounded-xl"
                      style={{
                        background:
                          pattern.severity === "critical"
                            ? "var(--clay-pink)"
                            : pattern.severity === "high"
                            ? "var(--clay-orange)"
                            : pattern.severity === "medium"
                            ? "var(--clay-yellow)"
                            : "var(--clay-blue)",
                      }}
                    >
                      <ShieldAlert className="h-5 w-5" />
                    </span>
                  </div>
                  <span
                    className={`clay-pill text-[10px] uppercase ${
                      pattern.status === "active"
                        ? "bg-[color:var(--success)]"
                        : pattern.status === "testing"
                        ? "bg-[color:var(--warning)]"
                        : "bg-[color:var(--destructive)]"
                    }`}
                  >
                    {pattern.status}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{pattern.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{pattern.category}</p>
                <p className="mt-3 text-sm text-muted-foreground">{pattern.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pattern.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="clay-pill text-[10px]">
                      {keyword}
                    </span>
                  ))}
                  {pattern.keywords.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{pattern.keywords.length - 3} more
                    </span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="clay-inset p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Detection</p>
                    <p className="font-display text-lg font-bold text-[color:var(--success)]">
                      {pattern.detectionRate}%
                    </p>
                  </div>
                  <div className="clay-inset p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">False Positive</p>
                    <p className="font-display text-lg font-bold text-[color:var(--warning)]">
                      {pattern.falsePositiveRate}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated {pattern.lastUpdated}</span>
                  <div className="flex gap-2">
                    <button className="clay-btn p-1.5">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="clay-btn p-1.5">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this pattern?")) {
                          setPatterns(patterns.filter((p) => p.id !== pattern.id));
                        }
                      }}
                      className="clay-btn p-1.5 text-[color:var(--destructive)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="py-12 text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm font-semibold">No patterns found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
