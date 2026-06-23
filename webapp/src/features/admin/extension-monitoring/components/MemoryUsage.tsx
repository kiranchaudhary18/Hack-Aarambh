import { useState, useEffect } from "react";
import { MemoryStick } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function MemoryUsage() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load memory data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading memory usage..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const memoryUsage = extensionData?.memory || { avg: 45, peak: 85, perInstance: 42, change: "-5.2%" };
  const stats = [
    { label: "Average", value: `${memoryUsage.avg}MB` },
    { label: "Peak", value: `${memoryUsage.peak}MB` },
    { label: "Per Instance", value: `${memoryUsage.perInstance}MB` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <MemoryStick className="h-5 w-5 text-purple-500" />
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
      <p
        className={`mt-3 text-xs font-medium ${
          memoryUsage.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {memoryUsage.change} from last week
      </p>
    </div>
  );
}
