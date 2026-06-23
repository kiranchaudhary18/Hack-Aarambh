import { useState, useEffect } from "react";
import { Clock, Timer, Gauge, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function PageLoadTimes() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load page load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading page load times..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const pageLoadPercentiles = websiteData?.pageLoadPercentiles || [
    { percentile: "p50", time: 1.8, status: "good", target: 2.5 },
    { percentile: "p75", time: 2.4, status: "good", target: 3.0 },
    { percentile: "p90", time: 3.2, status: "warning", target: 3.5 },
    { percentile: "p95", time: 4.1, status: "warning", target: 4.0 },
  ];

  const statusIcons = {
    good: CheckCircle2,
    warning: AlertTriangle,
    bad: AlertTriangle,
  };

  const statusColors = {
    good: "var(--clay-green)",
    warning: "var(--clay-yellow)",
    bad: "var(--clay-red)",
  };

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-blue)" }}>
          <Clock className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Page Load Times</h2>
          <p className="text-sm text-muted-foreground">Percentile breakdown</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {pageLoadPercentiles.map((item) => {
          const StatusIcon = statusIcons[item.status];
          return (
            <div key={item.percentile} className="clay-inset flex items-center gap-4 p-4">
              <span className="font-display text-lg font-bold text-muted-foreground">{item.percentile}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Load Time</span>
                  <span className="font-display text-lg font-bold">{item.time.toFixed(1)}s</span>
                </div>
                <div className="clay-inset mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.time / 5) * 100}%`, background: statusColors[item.status] }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" style={{ color: statusColors[item.status] }} />
                <span className="text-xs text-muted-foreground">Target: {item.target}s</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
