import { useState, useEffect } from "react";
import { MemoryStick } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function MemoryUsage() {
  const [resourceData, setResourceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIResources();
        setResourceData(data);
      } catch (err) {
        setError("Failed to load memory data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading memory data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const memory = resourceData?.memory || { current: 12.5, average: 10.2, peak: 16.8 };
  const stats = [
    { label: "Current", value: `${memory.current}GB` },
    { label: "Average", value: `${memory.average}GB` },
    { label: "Peak", value: `${memory.peak}GB` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <MemoryStick className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {memory.perRequest || 0.5}GB per request
      </p>
      <p
        className={`mt-1 text-xs font-medium ${
          resourceData?.memory?.status === 'healthy' ? "text-green-500" : resourceData?.memory?.status === 'warning' ? "text-yellow-500" : "text-red-500"
        }`}
      >
        Status: {resourceData?.memory?.status || 'unknown'}
      </p>
    </div>
  );
}
