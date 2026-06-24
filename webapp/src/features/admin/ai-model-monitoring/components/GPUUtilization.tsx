import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function GPUUtilization() {
  const [resourceData, setResourceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIResources();
        setResourceData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading GPU data..." />;

  const gpu = resourceData?.gpu || { current: 0, average: 0, peak: 0, status: 'unknown' };
  const stats = [
    { label: "Current", value: `${gpu.current}%` },
    { label: "Average", value: `${gpu.average}%` },
    { label: "Peak", value: `${gpu.peak}%` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          GPU Utilization
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Cpu className="h-5 w-5 text-purple-500" />
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
          resourceData?.gpu?.status === 'healthy' ? "text-green-500" : resourceData?.gpu?.status === 'warning' ? "text-yellow-500" : "text-red-500"
        }`}
      >
        Status: {resourceData?.gpu?.status || 'unknown'}
      </p>
    </div>
  );
}
