import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { api } from "@/shared/lib/api";

export function Admin() {
  const [adminStats, setAdminStats] = useState<any>({
    totalScans: 0,
    scamsDetected: 0,
    activeUsers: 0,
    savedDollars: 0,
    todayScans: 0,
    weeklyNewUsers: 0,
    scamRate: 0,
  });
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([
    { month: "Aug", safe: 0, scams: 0 },
    { month: "Sep", safe: 0, scams: 0 },
    { month: "Oct", safe: 0, scams: 0 },
    { month: "Nov", safe: 0, scams: 0 },
    { month: "Dec", safe: 0, scams: 0 },
    { month: "Jan", safe: 0, scams: 0 },
  ]);
  const [scamTypes, setScamTypes] = useState<any[]>([
    { name: "Fake Job Offers", value: 0, color: "oklch(0.62 0.18 295)" },
    { name: "Phishing", value: 0, color: "oklch(0.72 0.16 155)" },
    { name: "Investment Scams", value: 0, color: "oklch(0.66 0.22 22)" },
    { name: "Romance Scams", value: 0, color: "oklch(0.75 0.12 85)" },
    { name: "Other", value: 0, color: "oklch(0.68 0.15 45)" },
  ]);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin — ScamSniff";
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [stats, history, analytics, liveFeedData, regionsData, systemHealthData] = await Promise.all([
          api.getAdminStats(),
          api.getHistory(),
          api.getAdminAnalytics(),
          api.getLiveFeed(),
          api.getRegions(),
          api.getSystemHealth(),
        ]);
        if (stats) {
          setAdminStats(stats);
        }
        if (history) {
          setRecentChecks(history);
        }
        if (analytics?.trendData && analytics.trendData.length > 0) {
          setTrendData(analytics.trendData);
        }
        if (analytics?.scamTypes && analytics.scamTypes.length > 0) {
          setScamTypes(analytics.scamTypes);
        }
        if (liveFeedData) {
          setLiveFeed(liveFeedData);
        }
        if (regionsData) {
          setRegions(regionsData);
        }
        if (systemHealthData) {
          setSystemHealth(systemHealthData);
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin overview</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">System pulse</h1>
        <p className="mt-2 text-muted-foreground">
          Live moderation stats across all scanners. Updated 12s ago.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0.05}>
          <Stat
            icon={ScanSearch}
            label="Total scans"
            value={adminStats.totalScans.toLocaleString()}
            sub="+412 today"
            color="var(--clay-purple)"
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Stat
            icon={ShieldAlert}
            label="Scams detected"
            value={adminStats.scamsDetected.toLocaleString()}
            sub={`${Math.round((adminStats.scamsDetected / adminStats.totalScans) * 100)}% rate`}
            color="var(--clay-pink)"
          />
        </FadeIn>
        <FadeIn delay={0.15}>
          <Stat
            icon={Users}
            label="Active users"
            value={adminStats.activeUsers.toLocaleString()}
            sub="+86 this week"
            color="var(--clay-green)"
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <Stat
            icon={DollarSign}
            label="Saved (est.)"
            value={`$${(adminStats.savedDollars / 1_000_000).toFixed(2)}M`}
            sub="Across all users"
            color="var(--clay-orange)"
          />
        </FadeIn>
      </div>

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
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
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
                .length > 0 ? (
                recentChecks
                  .filter((c) => c.score >= 70)
                  .slice(0, 4)
                  .map((c) => (
                    <Link
                      to={`/result?id=${c.id}`}
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
                  ))
              ) : (
                <div className="text-center py-8">
                  <Flag className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">No flagged cases yet</p>
                </div>
              )}
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
              {liveFeed.length > 0 ? (
                liveFeed.map((x, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                      style={{ background: x.color }}
                    >
                      <Activity className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{x.type}</p>
                      <p className="truncate text-xs text-muted-foreground">{x.description}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{x.ago}</span>
                  </li>
                ))
              ) : (
                <li className="text-center text-sm text-muted-foreground py-4">
                  No recent activity
                </li>
              )}
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
              {regions.length > 0 ? (
                regions.map((x) => (
                  <li key={x.location}>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{x.location}</span>
                      <span className="text-muted-foreground">{x.percentage}%</span>
                    </div>
                    <div className="clay-inset mt-1 h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${x.percentage}%`, background: x.color }}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center text-sm text-muted-foreground py-4">
                  No region data available
                </li>
              )}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="clay p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">System health</h3>
              <span className="clay-pill text-[10px]" style={{ background: "var(--clay-green)" }}>
                All green
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {systemHealth.length > 0 ? (
                systemHealth.map((x) => {
                  const Icon = x.label === "API latency" ? Server : x.label === "Model accuracy" ? Cpu : Activity;
                  const color = x.status === "healthy" ? "var(--clay-green)" : x.status === "warning" ? "var(--clay-yellow)" : "var(--clay-pink)";
                  return (
                    <div key={x.label} className="clay-inset flex items-center gap-3 p-3">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-xl"
                        style={{ background: color }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{x.label}</p>
                        <p className="font-display text-lg font-bold">{x.value}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No system health data available
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn delay={0.35}>
          <div className="clay p-6">
            <h2 className="font-display text-2xl font-bold">Scam vs safe scans</h2>
            <p className="text-sm text-muted-foreground">Last 6 months</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <BarChart data={trendData} barGap={6}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
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
                  <Bar dataKey="safe" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="scams" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="clay p-6">
            <h2 className="font-display text-2xl font-bold">Most common fraud types</h2>
            <p className="text-sm text-muted-foreground">Share of confirmed scams</p>
            <div className="mt-4 h-72">
              {scamTypes.some((s) => s.value > 0) ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={scamTypes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={56}
                      paddingAngle={4}
                    >
                      {scamTypes.map((s, i) => (
                        <Cell key={i} fill={s.color} stroke="var(--card)" strokeWidth={4} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "none",
                        borderRadius: 16,
                        boxShadow: "var(--shadow-clay-sm)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Flag className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No fraud data available</p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.45}>
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Scam rate trend</h2>
          <p className="text-sm text-muted-foreground">% of scans flagged as scam, per month</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={trendData.map((d) => ({
                month: d.month,
                rate: d.scams + d.safe > 0 ? Math.round((d.scams / (d.scams + d.safe)) * 100) : 0,
              }))}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
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
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="oklch(0.66 0.22 22)"
                  strokeWidth={4}
                  dot={{ fill: "oklch(0.66 0.22 22)", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
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
