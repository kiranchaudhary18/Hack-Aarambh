import { useState, useEffect } from "react";
import { HeartPulse, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function CoreWebVitals() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteTraffic();
        setWebsiteData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading web vitals..." />;

  const coreWebVitals = websiteData?.coreWebVitals || {
    lcp: { value: 0, status: "good", change: "0%" },
    fid: { value: 0, status: "good", change: "0%" },
    cls: { value: 0, status: "good", change: "0%" },
  };

  const vitals = [
    { key: "lcp", label: "LCP", fullLabel: "Largest Contentful Paint", unit: "s", target: 2.5 },
    { key: "fid", label: "FID", fullLabel: "First Input Delay", unit: "ms", target: 100 },
    { key: "cls", label: "CLS", fullLabel: "Cumulative Layout Shift", unit: "", target: 0.1 },
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
    <div className="grid gap-4 sm:grid-cols-3">
      {vitals.map((vital) => {
        const data = coreWebVitals[vital.key as keyof typeof coreWebVitals];
        const StatusIcon = statusIcons[data.status as keyof typeof statusIcons];
        return (
          <div key={vital.key} className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {vital.fullLabel}
              </span>
              <StatusIcon className="h-5 w-5" style={{ color: statusColors[data.status as keyof typeof statusColors] }} />
            </div>
            <p className="mt-4 font-display text-4xl font-bold">
              {data.value.toFixed(vital.key === "cls" ? 3 : 1)}
              {vital.unit}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Target: {vital.target}{vital.unit}</span>
              <span className="clay-pill text-xs" style={{ background: statusColors[data.status as keyof typeof statusColors] }}>
                {data.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
