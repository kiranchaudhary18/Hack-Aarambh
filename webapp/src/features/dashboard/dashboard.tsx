import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
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

const spark = (seed: number, value: number = 0) =>
  Array.from({ length: 12 }).map((_, i) => ({
    x: i,
    v: value,
  }));

interface AnalyticsData {
  scamPatterns: Array<{ name: string; value: number; color: string }>;
}

interface HistoryItem {
  id: string;
  title: string;
  company: string;
  date: string;
  verdict: "scam" | "suspicious" | "safe";
  score: number;
  source: "text" | "pdf" | "url";
  snippet: string;
  reasons: Array<{ label: string; severity: string; detail: string }>;
}

interface ProfileData {
  name: string;
  scansUsed: number;
}

export function Dashboard() {
  const [recentChecks, setRecentChecks] = useState<HistoryItem[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard — ScamSniff";
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [historyData, profileData, analyticsData] = await Promise.all([
          api.getHistory(),
          api.getProfile(),
          api.getAnalytics(),
        ]);
        setRecentChecks(historyData || []);
        setProfile(profileData);
        setAnalytics(analyticsData);
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
  const avgScore =
    totalScans > 0
      ? Math.round(recentChecks.reduce((sum, c) => sum + (c.score || 0), 0) / totalScans)
      : 0;

  // Calculate money saved (assuming each scam would cost $416 on average)
  const moneySaved = scamCount * 416;

  // Generate risk trend data from actual history
  const riskTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName =
      i === 0
        ? "Today"
        : i === 1
          ? "Yesterday"
          : date.toLocaleDateString("en-US", { weekday: "short" });

    // Get records for this day
    const dayRecords = recentChecks.filter((c) => {
      const recordDate = new Date(c.date);
      const diffTime = Math.abs(date.getTime() - recordDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 1;
    });

    const dayAvgScore =
      dayRecords.length > 0
        ? Math.round(dayRecords.reduce((sum, c) => sum + (c.score || 0), 0) / dayRecords.length)
        : 0;

    return { day: dayName, avgScore: dayAvgScore };
  }).reverse();

  // Use real analytics data for scam patterns
  const scamPatternData = analytics?.scamPatterns || [];

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
                <p className="clay-pill inline-block">
                  Welcome back, {profile?.name?.split(" ")[0]}
                </p>
                <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                  Your scam dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {profile?.scansUsed || 0} scans this month · {scamCount} scams blocked. Nice
                  instincts.
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
              value={String(profile?.scansUsed)}
              sub="This month"
              color="var(--clay-purple)"
              line="oklch(0.62 0.18 295)"
              data={spark(1, profile?.scansUsed)}
              trend="+18%"
            />
            <StatCard
              icon={ShieldAlert}
              label="Scams caught"
              value={String(scamCount)}
              sub={`-$${moneySaved.toLocaleString()} saved`}
              color="var(--clay-pink)"
              line="oklch(0.65 0.22 15)"
              data={spark(4, scamCount)}
              trend="+3"
            />
            <StatCard
              icon={ShieldCheck}
              label="Safe offers"
              value={String(safeCount)}
              sub="Verified hires"
              color="var(--clay-green)"
              line="oklch(0.72 0.16 155)"
              data={spark(7, safeCount)}
              trend="+9%"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg risk score"
              value={`${avgScore}%`}
              sub="Trending down"
              color="var(--clay-orange)"
              line="oklch(0.74 0.16 60)"
              data={spark(11, avgScore)}
              trend="−6%"
            />
          </StaggerChildren>

          <FadeIn delay={0.05}>
            <div className="clay p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Risk trend (7 days)</h2>
                <span className="clay-pill text-[10px]">Your average scam score</span>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskTrendData}>
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                    />
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
                      dataKey="avgScore"
                      stroke="oklch(0.62 0.18 295)"
                      strokeWidth={3}
                      dot={{ fill: "oklch(0.62 0.18 295)", r: 5, strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="clay p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Scam pattern breakdown</h2>
                <span className="clay-pill text-[10px]">Types detected in your scans</span>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scamPatternData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={4}
                      >
                        {scamPatternData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="var(--card)"
                            strokeWidth={3}
                          />
                        ))}
                      </Pie>
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
                </div>
                <div className="space-y-3">
                  {scamPatternData.length > 0 ? (
                    scamPatternData.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ background: pattern.color }}
                          />
                          <span className="text-sm font-semibold">{pattern.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{pattern.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No scam patterns detected yet.</p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

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
                      to={`/result?id=${c.id}`}
                      key={c.id}
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
                    {(() => {
                      const urgentCount = recentChecks.filter((c) =>
                        c.reasons?.some(
                          (r) =>
                            r.label?.toLowerCase().includes("urgent") ||
                            r.label?.toLowerCase().includes("immediate"),
                        ),
                      ).length;
                      return urgentCount > 0
                        ? `${urgentCount} of your recent offers contained urgency tactics. Slow down before replying.`
                        : "No urgency tactics detected in your recent offers. Keep being cautious!";
                    })()}
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
                  <p className="font-display text-2xl font-bold">
                    {safeCount > 0 ? `${safeCount} days` : "0 days"}
                  </p>
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
                {14 - safeCount > 0
                  ? `${14 - safeCount} days from a personal best.`
                  : "Personal best!"}
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
                {(() => {
                  // Calculate real red flags from history
                  const allReasons = recentChecks.flatMap(
                    (c) => c.reasons?.map((r) => r.label) || [],
                  );
                  const reasonCounts = allReasons.reduce(
                    (acc: Record<string, number>, reason: string) => {
                      acc[reason] = (acc[reason] || 0) + 1;
                      return acc;
                    },
                    {},
                  );

                  const topReasons = Object.entries(reasonCounts)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([reason, count]) => ({
                      l: reason,
                      v: Math.round(((count as number) / totalScans) * 100) || 0,
                      c:
                        reason.toLowerCase().includes("fee") ||
                        reason.toLowerCase().includes("payment")
                          ? "var(--destructive)"
                          : reason.toLowerCase().includes("urgent")
                            ? "var(--clay-orange)"
                            : "var(--clay-yellow)",
                    }));

                  if (topReasons.length === 0) {
                    return (
                      <li className="text-sm text-muted-foreground">No red flags detected yet.</li>
                    );
                  }

                  return topReasons.map((x, i) => (
                    <li key={i}>
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
                  ));
                })()}
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
