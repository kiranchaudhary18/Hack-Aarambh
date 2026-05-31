import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/components/Animated";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";
import { Flag, AlertTriangle, ShieldOff, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/flagged")({
  head: () => ({
    meta: [
      { title: "Flagged cases — ScamSniff Admin" },
      { name: "description", content: "High-risk job offers needing review." },
    ],
  }),
  component: Flagged,
});

function Flagged() {
  const [flaggedCases, setFlaggedCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getFlaggedCases();
        // Transform API data to match expected format
        const transformedData = data.map((item: any) => ({
          id: item.id,
          title: item.input?.split("\n")[0]?.slice(0, 60) || "Job offer",
          company: "Unknown sender",
          snippet: item.input?.slice(0, 160) || "",
          date: item.createdAt || new Date().toISOString().slice(0, 10),
          score: item.result?.score || 0,
          reasons:
            item.result?.reasons?.map((r: string) => ({
              label: r,
              severity: item.result?.isFake ? "high" : "low",
              detail: r,
            })) || [],
          source: "text",
        }));
        setFlaggedCases(transformedData);
      } catch (error) {
        console.error("Failed to fetch flagged cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[oklch(0.62_0.18_295)] mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">Loading flagged cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <AdminSidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <p
              className="clay-pill inline-flex items-center gap-2"
              style={{ background: "var(--clay-pink)" }}
            >
              <Flag className="h-3.5 w-3.5" /> Flagged queue
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">High-risk offers</h1>
            <p className="mt-2 text-muted-foreground">
              {flaggedCases.length} cases awaiting your verdict.
            </p>
          </FadeIn>

          <StaggerChildren className="grid gap-4">
            {flaggedCases.length === 0 ? (
              <EmptyState
                icon={<Flag className="h-7 w-7" />}
                title="No flagged cases"
                description="All job offers have been reviewed and cleared."
              />
            ) : (
              flaggedCases.map((c) => (
                <div key={c.id} className="clay p-6">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="clay-pill bg-[color:var(--destructive)] text-destructive-foreground">
                          SCORE {c.score}%
                        </span>
                        <span className="clay-pill" style={{ background: "var(--clay-yellow)" }}>
                          {c.reasons.length} red flags
                        </span>
                        <span className="clay-pill">{c.source}</span>
                      </div>
                      <h2 className="mt-3 font-display text-xl font-bold">{c.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {c.company} · reported {c.date}
                      </p>
                      <p className="clay-inset mt-3 p-3 text-sm text-muted-foreground">
                        "{c.snippet}"
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.reasons.slice(0, 3).map((r, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs"
                          >
                            <AlertTriangle className="h-3 w-3 text-[color:var(--destructive)]" />{" "}
                            {r.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 md:flex-col">
                      <Link
                        to="/result"
                        search={{ id: c.id }}
                        className="clay-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                      >
                        Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        className="clay-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                        style={{ color: "var(--destructive)" }}
                      >
                        <ShieldOff className="h-3.5 w-3.5" /> Block
                      </button>
                      <button
                        className="clay-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                        style={{ color: "var(--success)" }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Clear
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </StaggerChildren>
        </main>
      </div>
    </div>
  );
}
