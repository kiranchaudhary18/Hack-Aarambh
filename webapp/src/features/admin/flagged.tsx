import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import { Flag, AlertTriangle, ShieldOff, CheckCircle2, ArrowRight } from "lucide-react";

export function AdminFlagged() {
  const [flaggedCases, setFlaggedCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo data fallback
  const demoFlaggedCases = [
    {
      id: "1",
      score: 96,
      reasons: [
        { label: "Urgent payment required" },
        { label: "No company website" },
        { label: "Generic email domain" },
      ],
      source: "LinkedIn",
      title: "Remote Data Entry Specialist - $500/week",
      company: "TechCorp Solutions",
      date: "2 hours ago",
      snippet: "We are looking for motivated individuals to join our team. No experience needed. Start earning immediately!",
    },
    {
      id: "2",
      score: 89,
      reasons: [
        { label: "Too good to be true salary" },
        { label: "Vague job description" },
      ],
      source: "Indeed",
      title: "Customer Service Representative - $80/hour",
      company: "Global Services Inc",
      date: "5 hours ago",
      snippet: "Work from home, flexible hours, instant hiring process. Apply now!",
    },
    {
      id: "3",
      score: 92,
      reasons: [
        { label: "Request for personal info" },
        { label: "Unverified company" },
        { label: "Suspicious contact method" },
      ],
      source: "Email",
      title: "Personal Assistant Needed - $2000/month",
      company: "Private Employer",
      date: "1 day ago",
      snippet: "I need a trustworthy personal assistant to handle my finances. Send your bank details for direct deposit.",
    },
  ];

  useEffect(() => {
    document.title = "Flagged cases — ScamSniff Admin";
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getFlaggedCases();
        setFlaggedCases(data || demoFlaggedCases);
      } catch (error) {
        console.error("Failed to fetch flagged cases:", error);
        // Use demo data when API fails
        setFlaggedCases(demoFlaggedCases);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading flagged cases...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4">
        {flaggedCases.map((c, index) => (
          <FadeIn key={c.id} delay={index * 0.05}>
            <div className="clay p-6">
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
                  <p className="clay-inset mt-3 p-3 text-sm text-muted-foreground">"{c.snippet}"</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.reasons.slice(0, 3).map((r: any, i: number) => (
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
                    to={`/result?id=${c.id}`}
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
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
