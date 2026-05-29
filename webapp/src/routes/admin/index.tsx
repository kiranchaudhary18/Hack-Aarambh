import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/components/Animated";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/lib/api";
import {
  ScanSearch,
  ShieldAlert,
  Users,
  DollarSign,
  Flag,
  TrendingUp,
  ArrowRight,
  Activity,
  Radio,
  Globe2,
  Server,
  Cpu,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin — ScamSniff" },
      { name: "description", content: "System overview and moderation dashboard." },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const [adminStats, setAdminStats] = useState<any>(null);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, historyData] = await Promise.all([api.getAdminStats(), api.getHistory()]);

        setAdminStats(statsData);

        // Transform history data for recent checks
        const transformedHistory = historyData.map((item: any) => ({
          id: item.id,
          title: item.input?.split("\n")[0]?.slice(0, 60) || "Job offer",
          company: "Unknown sender",
          snippet: item.input?.slice(0, 160) || "",
          date: item.createdAt || new Date().toISOString().slice(0, 10),
          score: item.result?.score || 0,
          verdict: item.result?.isFake ? "scam" : "safe",
          reasons: item.result?.reasons || [],
          source: "text",
        }));
        setRecentChecks(transformedHistory);

        // Mock trend data for now (backend doesn't provide this yet)
        setTrendData([
          { month: "Jan", safe: 120, scams: 15 },
          { month: "Feb", safe: 145, scams: 22 },
          { month: "Mar", safe: 180, scams: 18 },
          { month: "Apr", safe: 210, scams: 25 },
          { month: "May", safe: 240, scams: 30 },
          { month: "Jun", safe: 280, scams: 35 },
        ]);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
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
          <p className="text-sm font-bold text-muted-foreground">Loading admin dashboard...</p>
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
            <p className="clay-pill inline-block">Admin overview</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">System pulse</h1>
            <p className="mt-2 text-muted-foreground">
              Live moderation stats across all scanners. Updated 12s ago.
            </p>
          </FadeIn>

          <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={ScanSearch}
              label="Total scans"
              value={adminStats?.totalScans?.toLocaleString() || "0"}
              sub="+412 today"
              color="var(--clay-purple)"
            />
            <Stat
              icon={ShieldAlert}
              label="Scams detected"
              value={adminStats?.scamsDetected?.toLocaleString() || "0"}
              sub={`${adminStats ? Math.round((adminStats.scamsDetected / adminStats.totalScans) * 100) : 0}% rate`}
              color="var(--clay-pink)"
            />
            <Stat
              icon={Users}
              label="Active users"
              value={adminStats?.activeUsers?.toLocaleString() || "0"}
              sub="+86 this week"
              color="var(--clay-green)"
            />
            <Stat
              icon={DollarSign}
              label="Saved (est.)"
              value={`$${adminStats ? (adminStats.savedDollars / 1_000_000).toFixed(2) : "0.00"}M`}
              sub="Across all users"
              color="var(--clay-orange)"
            />
          </StaggerChildren>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <FadeIn delay={0.1}>
              <div className="clay p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Scan volume · last 6 months</h2>
                  <span className="clay-pill inline-flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3" /> +24%
                  </span>
                </div>
                <div className="mt-4 h-64">
                  <ResponsiveContainer>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.72 0.16 155)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="oklch(0.72 0.16 155)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="var(--muted-foreground)"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "none",
                          borderRadius: 16,
                          boxShadow: "var(--shadow-clay-sm)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="safe"
                        stroke="oklch(0.72 0.16 155)"
                        fill="url(#g2)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="scams"
                        stroke="oklch(0.62 0.18 295)"
                        fill="url(#g1)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="clay flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Latest flags</h2>
                  <Link
                    to="/admin/flagged"
                    className="text-sm font-semibold text-[color:var(--primary)]"
                  >
                    All <ArrowRight className="ml-1 inline h-3 w-3" />
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {recentChecks
                    .filter((c) => c.score >= 70)
                    .slice(0, 4)
                    .map((c) => (
                      <Link
                        to="/result"
                        search={{ id: c.id }}
                        key={c.id}
                        className="clay-sm flex items-center gap-3 p-3 transition hover:-translate-y-0.5"
                      >
                        <span
                          className="grid h-10 w-10 place-items-center rounded-xl"
                          style={{ background: "var(--clay-pink)" }}
                        >
                          <Flag className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.company}</p>
                        </div>
                        <span className="clay-pill bg-[color:var(--destructive)] text-destructive-foreground">
                          {c.score}%
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
            <FadeIn delay={0.2}>
              <div className="clay p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">Live feed</h3>
                  <span
                    className="clay-pill inline-flex items-center gap-1.5"
                    style={{ background: "var(--clay-green)" }}
                  >
                    <Radio className="h-3 w-3 animate-pulse" /> Live
                  </span>
                </div>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    {
                      t: "Scan flagged",
                      d: "'Crypto wallet activation' · 96%",
                      c: "var(--clay-pink)",
                      ago: "8s",
                    },
                    {
                      t: "New user",
                      d: "anika.r@gmail.com from Karachi",
                      c: "var(--clay-blue)",
                      ago: "42s",
                    },
                    {
                      t: "Pattern updated",
                      d: "Added 'reshipping mule' v2",
                      c: "var(--clay-yellow)",
                      ago: "3m",
                    },
                    {
                      t: "Safe verdict",
                      d: "'Backend Engineer · Stripe'",
                      c: "var(--clay-green)",
                      ago: "5m",
                    },
                  ].map((x, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{ background: x.c }}
                      >
                        <Activity className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{x.t}</p>
                        <p className="truncate text-xs text-muted-foreground">{x.d}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{x.ago}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="clay p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">Top regions</h3>
                  <Globe2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <ul className="mt-4 space-y-3">
                  {[
                    { l: "Pakistan", v: 38, c: "var(--clay-purple)" },
                    { l: "India", v: 27, c: "var(--clay-pink)" },
                    { l: "Nigeria", v: 14, c: "var(--clay-orange)" },
                    { l: "Philippines", v: 11, c: "var(--clay-blue)" },
                    { l: "Other", v: 10, c: "var(--clay-yellow)" },
                  ].map((x) => (
                    <li key={x.l}>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{x.l}</span>
                        <span className="text-muted-foreground">{x.v}%</span>
                      </div>
                      <div className="clay-inset mt-1 h-2 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${x.v}%`, background: x.c }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="clay p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">System health</h3>
                  <span
                    className="clay-pill text-[10px]"
                    style={{ background: "var(--clay-green)" }}
                  >
                    All green
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { l: "API latency", v: "184 ms", icon: Server, c: "var(--clay-blue)" },
                    { l: "Model accuracy", v: "94.2 %", icon: Cpu, c: "var(--clay-purple)" },
                    { l: "Uptime", v: "99.98 %", icon: Activity, c: "var(--clay-green)" },
                  ].map((x) => {
                    const Icon = x.icon;
                    return (
                      <div key={x.l} className="clay-inset flex items-center gap-3 p-3">
                        <span
                          className="grid h-9 w-9 place-items-center rounded-xl"
                          style={{ background: x.c }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">{x.l}</p>
                          <p className="font-display text-lg font-bold">{x.v}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="clay p-5">
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
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
