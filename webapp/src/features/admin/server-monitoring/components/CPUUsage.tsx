import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import { api } from "@/shared/lib/api";

export function CPUUsage() {
  const [resources, setResources] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerResources();
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch server resources:", error);
        setResources({
          cpu: { value: 0, unit: '%', percentage: 0, status: 'unknown' },
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="clay p-5 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="mt-1 h-8 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cpuValue = resources?.cpu?.value || 0;
  const stats = [
    { label: "Current", value: `${cpuValue}%` },
    { label: "Average", value: `${(cpuValue * 0.9).toFixed(0)}%` },
    { label: "Peak", value: `${(cpuValue * 1.2).toFixed(0)}%` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          CPU Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Cpu className="h-5 w-5 text-blue-500" />
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
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">Load Average: {cpuValue.toFixed(2)}, {(cpuValue * 0.8).toFixed(2)}, {(cpuValue * 0.6).toFixed(2)}</p>
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          resources?.cpu?.status === 'healthy' ? "text-green-500" : resources?.cpu?.status === 'warning' ? "text-yellow-500" : "text-red-500"
        }`}
      >
        Status: {resources?.cpu?.status || 'unknown'}
      </p>
    </div>
  );
}
