import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function SLAMonitoring() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerUptime();
        setServerData(data);
      } catch (err) {
        setError("Failed to load SLA data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading SLA data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const slaMonitoring = serverData?.sla || [
    { service: "API Availability", target: 99.9, period: "30d", current: 99.95, status: "on-track" },
    { service: "Response Time", target: 95, period: "24h", current: 92, status: "at-risk" },
    { service: "Error Rate", target: 99.5, period: "7d", current: 99.8, status: "on-track" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">SLA Monitoring</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Target className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {slaMonitoring.map((sla: any) => (
          <div key={sla.service} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{sla.service}</p>
              <p className="text-xs text-muted-foreground">
                Target: {sla.target}% • Period: {sla.period}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{sla.current}%</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  sla.status === "on-track"
                    ? "bg-green-500/20 text-green-500"
                    : sla.status === "at-risk"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {sla.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
