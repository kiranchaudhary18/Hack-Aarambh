import { useState, useEffect } from "react";
import { AlertTriangle, Bug, XCircle, WifiOff } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ErrorMonitoring() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load error data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading error monitoring..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const errorOverview = websiteData?.errorOverview || {
    jsErrors: 45,
    apiFailures: 28,
    pageLoadFailures: 12,
    networkErrors: 8,
  };

  const stats = [
    {
      icon: Bug,
      label: "JavaScript Errors",
      value: errorOverview.jsErrors,
      sub: "Last 24 hours",
      color: "var(--clay-red)",
    },
    {
      icon: XCircle,
      label: "API Failures",
      value: errorOverview.apiFailures,
      sub: "Last 24 hours",
      color: "var(--clay-orange)",
    },
    {
      icon: AlertTriangle,
      label: "Page Load Failures",
      value: errorOverview.pageLoadFailures,
      sub: "Last 24 hours",
      color: "var(--clay-yellow)",
    },
    {
      icon: WifiOff,
      label: "Network Errors",
      value: errorOverview.networkErrors,
      sub: "Last 24 hours",
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
