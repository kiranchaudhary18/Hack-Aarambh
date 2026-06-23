import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ProcessingTime() {
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

  if (loading) return <LoadingState message="Loading processing time data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const processingTimeData = performanceData?.processingTime || [
    { inputSize: "<1KB", avgTime: 25, p95: 45 },
    { inputSize: "1-10KB", avgTime: 42, p95: 85 },
    { inputSize: "10-100KB", avgTime: 78, p95: 150 },
    { inputSize: ">100KB", avgTime: 120, p95: 220 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Processing Time by Input Size</h2>
      <p className="text-sm text-muted-foreground">Average and p95 processing time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={processingTimeData} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="inputSize"
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
            <Bar dataKey="avgTime" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} name="Avg (ms)" />
            <Bar dataKey="p95" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} name="p95 (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
