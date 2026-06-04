import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sidebar } from "@/components/Sidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/components/Animated";
import { api } from "@/lib/api";
import { resultStore } from "@/lib/resultStore";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  ScanSearch,
  Share2,
  FileDown,
  Flag,
} from "lucide-react";

export const Route = createFileRoute("/result")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Result — ScamSniff" },
      { name: "description", content: "Scam-detection result with reasoning." },
    ],
  }),
  component: Result,
});

interface Reason {
  label: string;
  severity: "high" | "med" | "low";
  detail: string;
}

interface JobCheck {
  id: string;
  title: string;
  company: string;
  snippet: string;
  verdict: "scam" | "suspicious" | "safe";
  score: number;
  date: string;
  source?: "text" | "pdf" | "url";
  reasons?: Reason[];
}

function Result() {
  const { id } = useSearch({ from: "/result" });
  const [check, setCheck] = useState<JobCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const meterRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          const data = await api.getHistoryById(id);
          setCheck(data);
        } else {
          const stored = resultStore.get();
          if (stored) {
            setCheck(stored);
          } else {
            // Fallback to recent history
            const history = await api.getHistory();
            setCheck(history[0] || null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch result:", error);
        const stored = resultStore.get();
        if (stored) setCheck(stored);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!meterRef.current || !numRef.current || !check) return;
    gsap.fromTo(
      meterRef.current,
      { width: 0 },
      { width: `${check.score}%`, duration: 1.4, ease: "power3.out" },
    );
    const obj = { v: 0 };
    gsap.to(obj, {
      v: check.score,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = Math.round(obj.v).toString();
      },
    });
  }, [check]);

  if (loading || !check) {
    return (
      <div className="relative h-screen overflow-hidden">
        <ClayBlobs />
        <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
          <Sidebar />
          <main className="min-w-0 flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading result...</p>
          </main>
        </div>
      </div>
    );
  }

  const tone =
    check.verdict === "scam"
      ? {
          bg: "var(--destructive)",
          fg: "var(--destructive-foreground)",
          label: "Likely Scam",
          icon: ShieldAlert,
          blob: "var(--clay-pink)",
        }
      : check.verdict === "suspicious"
        ? {
            bg: "var(--warning)",
            fg: "var(--warning-foreground)",
            label: "Suspicious",
            icon: AlertTriangle,
            blob: "var(--clay-yellow)",
          }
        : {
            bg: "var(--success)",
            fg: "var(--success-foreground)",
            label: "Likely Safe",
            icon: ShieldCheck,
            blob: "var(--clay-green)",
          };

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pb-6">
          <FadeIn>
            <Link
              to="/analyze"
              className="clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> New analysis
            </Link>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="clay-lg relative overflow-hidden p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <span
                    className="clay-pill inline-flex items-center gap-2"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    <tone.icon className="h-4 w-4" /> {tone.label}
                  </span>
                  <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
                    {check.title}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {check.company} · scanned {check.date}
                  </p>

                  <div className="clay-inset mt-6 p-4 text-sm leading-relaxed text-muted-foreground">
                    "{check.snippet}"
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button className="clay-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                    <button className="clay-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold">
                      <FileDown className="h-4 w-4" /> PDF report
                    </button>
                    <button className="clay-btn inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold">
                      <Flag className="h-4 w-4" /> Report to admin
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className="absolute inset-0 -z-10 mx-auto my-auto h-64 w-64 rounded-full blur-3xl"
                    style={{ background: tone.blob, opacity: 0.6 }}
                  />
                  <div className="clay grid place-items-center p-10 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Scam score
                    </p>
                    <p className="mt-2 font-display text-7xl font-bold">
                      <span ref={numRef}>0</span>
                      <span className="text-3xl text-muted-foreground">%</span>
                    </p>
                    <div className="mt-4 h-4 w-full overflow-hidden rounded-full clay-inset">
                      <div
                        ref={meterRef}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, var(--clay-green), var(--clay-yellow), ${tone.bg})`,
                        }}
                      />
                    </div>
                    <div className="mt-4 flex w-full justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <span>Safe</span>
                      <span>Suspicious</span>
                      <span>Scam</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl font-bold">Why we flagged it</h2>
              <p className="text-sm text-muted-foreground">
                {check.reasons?.length || 0} signal{(check.reasons?.length || 0) === 1 ? "" : "s"}{" "}
                detected
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid gap-4 md:grid-cols-2">
            {check.reasons && check.reasons.length > 0 ? (
              check.reasons.map((r, i) => {
                const sevColor =
                  r.severity === "high"
                    ? "var(--clay-pink)"
                    : r.severity === "med"
                      ? "var(--clay-yellow)"
                      : "var(--clay-green)";
                const SevIcon = r.severity === "low" ? ShieldCheck : AlertTriangle;
                return (
                  <div key={i} className="clay p-6">
                    <div className="flex items-start gap-4">
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                        style={{ background: sevColor }}
                      >
                        <SevIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-bold">{r.label}</h3>
                          <span className="clay-pill text-[10px] uppercase">{r.severity}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="clay p-12 text-center">
                <p className="text-muted-foreground">
                  No specific signals detected for this analysis.
                </p>
              </div>
            )}
          </StaggerChildren>

          <FadeIn delay={0.2}>
            <div className="clay flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <h3 className="font-display text-xl font-bold">Got another suspicious offer?</h3>
                <p className="text-sm text-muted-foreground">
                  Scan as many as you want. No judgment.
                </p>
              </div>
              <Link
                to="/analyze"
                className="clay-primary inline-flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <ScanSearch className="h-4 w-4" /> Scan another
              </Link>
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
