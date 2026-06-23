import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ResponseTimeByType() {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIPerformance();
        setPerformanceData(data);
      } catch (err) {
        setError("Failed to load performance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading response time data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const responseTimeByType = performanceData?.responseTimeByType || [
    { type: "Text", p50: 45, p95: 120, p99: 180 },
    { type: "PDF", p50: 85, p95: 220, p99: 350 },
    { type: "URL", p50: 35, p95: 95, p99: 150 },
    { type: "Image", p50: 120, p95: 280, p99: 420 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Response Time by Analysis Type</h2>
      <p className="text-sm text-muted-foreground">Latency percentiles by input type</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={responseTimeByType} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="type"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
            <Legend />
            <Bar dataKey="p50" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} name="p50 (ms)" />
            <Bar dataKey="p95" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} name="p95 (ms)" />
            <Bar dataKey="p99" fill="oklch(0.66 0.22 22)" radius={[12, 12, 0, 0]} name="p99 (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
