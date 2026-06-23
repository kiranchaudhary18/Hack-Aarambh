import { useState, useEffect } from "react";
import { Users, Eye, Activity, TrendingDown } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function TrafficOverview() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load traffic data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading traffic overview..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const trafficOverview = websiteData?.trafficOverview || {
    realTimeVisitors: 1245,
    visitorsChange: "+12.5%",
    pageViewsPerSession: 4.2,
    totalSessionsToday: 8450,
    sessionsChange: "+8.2%",
    bounceRate: 35.8,
    bounceRateChange: "-2.1%",
  };

  const stats = [
    {
      icon: Users,
      label: "Real-time Visitors",
      value: trafficOverview.realTimeVisitors.toLocaleString(),
      sub: trafficOverview.visitorsChange,
      color: "var(--clay-purple)",
    },
    {
      icon: Eye,
      label: "Page Views/Session",
      value: trafficOverview.pageViewsPerSession.toFixed(1),
      sub: "Avg per session",
      color: "var(--clay-blue)",
    },
    {
      icon: Activity,
      label: "Total Sessions Today",
      value: trafficOverview.totalSessionsToday.toLocaleString(),
      sub: trafficOverview.sessionsChange,
      color: "var(--clay-green)",
    },
    {
      icon: TrendingDown,
      label: "Bounce Rate",
      value: `${trafficOverview.bounceRate.toFixed(1)}%`,
      sub: trafficOverview.bounceRateChange,
      color: "var(--clay-pink)",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl"
                style={{ background: stat.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
