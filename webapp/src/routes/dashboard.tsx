import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/components/Animated";
import { api } from "@/lib/api";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  ScanSearch,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  FileText,
  Link2,
  AlertTriangle,
  Flame,
  Target,
  Zap,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ScamSniff" },
      { name: "description", content: "Your scam-detection control center." },
    ],
  }),
  component: Dashboard,
});

const spark = (seed: number) =>
  Array.from({ length: 12 }).map((_, i) => ({
    x: i,
    v: 30 + Math.round(Math.abs(Math.sin((i + seed) * 0.7)) * 60 + (i % 3) * 5),
  }));

function Dashboard() {
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [historyData, profileData] = await Promise.all([
          api.getHistory(),
          api.getProfile(),
        ]);
        setRecentChecks(historyData || []);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const scamCount = recentChecks.filter((c) => c.verdict === "scam").length;
  const suspiciousCount = recentChecks.filter((c) => c.verdict === "suspicious").length;
  const safeCount = recentChecks.filter((c) => c.verdict === "safe").length;
  const totalScans = recentChecks.length;
  
  // Calculate average risk score
  const avgScore = totalScans > 0 
    ? Math.round(recentChecks.reduce((sum, c) => sum + (c.score || 0), 0) / totalScans)
    : 0;
  
  // Calculate money saved (assuming each scam would cost $416 on average)
  const moneySaved = scamCount * 416;

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden">
        <ClayBlobs />
        <div className="relative mx-auto flex h-full max-w-345 gap-6 p-6">
          <Sidebar />
          <main className="min-w-0 flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pb-6">
          <FadeIn>
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="clay-pill inline-block">Welcome back, {profile?.name?.split(' ')[0] || "User"}</p>
                <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                  Your scam dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {profile?.scansUsed || 0} scans this month · {scamCount} scams blocked. Nice instincts.
                </p>
              </div>
              <Link
                to="/analyze"
                className="clay-primary inline-flex items-center gap-2 px-6 py-3.5 font-semibold"
              >
                <ScanSearch className="h-5 w-5" /> Analyze New Offer
              </Link>
            </header>
          </FadeIn>

          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={ScanSearch}
              label="Total scans"
              value={String(profile?.scansUsed || 0)}
              sub="This month"
              color="var(--clay-purple)"
              line="oklch(0.62 0.18 295)"
              data={spark(1)}
              trend="+18%"
            />
            <StatCard
              icon={ShieldAlert}
              label="Scams caught"
              value={String(scamCount)}
              sub={`-$${moneySaved.toLocaleString()} saved`}
              color="var(--clay-pink)"
              line="oklch(0.65 0.22 15)"
              data={spark(4)}
              trend="+3"
            />
            <StatCard
              icon={ShieldCheck}
              label="Safe offers"
              value={String(safeCount)}
              sub="Verified hires"
              color="var(--clay-green)"
              line="oklch(0.72 0.16 155)"
              data={spark(7)}
              trend="+9%"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg risk score"
              value={`${avgScore}%`}
              sub="Trending down"
              color="var(--clay-orange)"
              line="oklch(0.74 0.16 60)"
              data={spark(11)}
              trend="−6%"
            />
          </StaggerChildren>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <FadeIn delay={0.1}>
              <div className="clay p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Recent checks</h2>
                  <Link to="/history" className="text-sm font-semibold text-[color:var(--primary)]">
                    View all <ArrowRight className="ml-1 inline h-3 w-3" />
                  </Link>
                </div>
                <div className="mt-5 divide-y divide-border">
                  {recentChecks.slice(0, 5).map((c) => (
                    <Link
                      to="/result"
                      key={c.id}
                      search={{ id: c.id }}
                      className="flex items-center gap-4 py-4 transition hover:translate-x-1"
                    >
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                        style={{
                          background:
                            c.verdict === "scam"
                              ? "var(--clay-pink)"
                              : c.verdict === "suspicious"
                                ? "var(--clay-yellow)"
                                : "var(--clay-green)",
                        }}
                      >
                        {c.source === "pdf" ? (
                          <FileText className="h-5 w-5" />
                        ) : c.source === "url" ? (
                          <Link2 className="h-5 w-5" />
                        ) : (
                          <ScanSearch className="h-5 w-5" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{c.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.company} · {c.date}
                        </p>
                      </div>
                      <span
                        className={`clay-pill ${c.verdict === "scam" ? "bg-[color:var(--destructive)] text-destructive-foreground" : c.verdict === "suspicious" ? "bg-[color:var(--warning)]" : "bg-[color:var(--success)] text-success-foreground"}`}
                      >
                        {c.score}%
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="clay flex h-full flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl"
                    style={{ background: "var(--clay-yellow)" }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <h2 className="font-display text-2xl font-bold">Tip of the day</h2>
                </div>
                <p className="text-muted-foreground">
                  Legit recruiters <strong className="text-foreground">never</strong> ask you to pay
                  an "activation fee," buy gift cards, or transfer crypto before day one.
                </p>
                <div className="clay-inset mt-auto flex items-start gap-3 p-4">
                  <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[color:var(--warning)]" />
                  <p className="text-sm">
                    3 of your recent offers contained the word <strong>"urgent"</strong>. Slow down
                    before replying.
                  </p>
                </div>
                <Link
                  to="/awareness"
                  className="clay-btn flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
                >
                  Read all tips <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
          </div>

          <StaggerChildren className="grid gap-4 md:grid-cols-3">
            <div className="clay p-5">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ background: "var(--clay-orange)" }}
                >
                  <Flame className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Safety streak
                  </p>
                  <p className="font-display text-2xl font-bold">{safeCount > 0 ? `${safeCount} days` : "0 days"}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: Math.min(safeCount, 14) }).map((_, i) => (
                  <span
                    key={i}
                    className="h-6 flex-1 rounded-md"
                    style={{ background: "var(--clay-orange)" }}
                  />
                ))}
                {Array.from({ length: Math.max(0, 14 - safeCount) }).map((_, i) => (
                  <span
                    key={`empty-${i}`}
                    className="h-6 flex-1 rounded-md"
                    style={{ background: "var(--muted)" }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {14 - safeCount > 0 ? `${14 - safeCount} days from a personal best.` : "Personal best!"}
              </p>
            </div>

            <div className="clay p-5">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ background: "var(--clay-blue)" }}
                >
                  <Target className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Top red flags
                  </p>
                  <p className="font-display text-2xl font-bold">Spotted</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { l: "Upfront fee", v: scamCount > 0 ? 64 : 0, c: "var(--destructive)" },
                  { l: "Urgency pressure", v: suspiciousCount > 0 ? 42 : 0, c: "var(--clay-orange)" },
                  { l: "Gmail recruiter", v: scamCount > 0 ? 28 : 0, c: "var(--clay-yellow)" },
                ].map((x) => (
                  <li key={x.l}>
                    <div className="flex items-center justify-between text-xs">
                      <span>{x.l}</span>
                      <span className="text-muted-foreground">{x.v}%</span>
                    </div>
                    <div className="clay-inset mt-1 h-1.5 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${x.v}%`, background: x.c }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="clay p-5">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ background: "var(--clay-green)" }}
                >
                  <DollarSign className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Money saved
                  </p>
                  <p className="font-display text-2xl font-bold">${moneySaved.toLocaleString()}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Across {scamCount} caught scam{scamCount === 1 ? "" : "s"} since you joined.
              </p>
              <Link
                to="/analyze"
                className="clay-btn mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold"
              >
                <Zap className="h-3.5 w-3.5" /> Scan another offer
              </Link>
            </div>
          </StaggerChildren>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  line,
  data,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
  line: string;
  trend: string;
  data: { x: number; v: number }[];
}) {
  const id = `g-${label.replace(/\s+/g, "")}`;
  return (
    <div className="clay relative overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className="grid h-10 w-10 place-items-center rounded-2xl"
          style={{ background: color }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 font-display text-4xl font-bold">{value}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{sub}</p>
        <span className="clay-pill text-[10px]" style={{ background: color }}>
          {trend}
        </span>
      </div>
      <div className="mt-3 h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={line} stopOpacity={0.45} />
                <stop offset="100%" stopColor={line} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={line}
              strokeWidth={2.2}
              fill={`url(#${id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
