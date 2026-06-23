import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function RequestThroughput() {
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

  if (loading) return <LoadingState message="Loading throughput data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const throughputData = performanceData?.throughputHistory || [
    { time: "00:00", rps: 120 },
    { time: "04:00", rps: 85 },
    { time: "08:00", rps: 200 },
    { time: "12:00", rps: 350 },
    { time: "16:00", rps: 280 },
    { time: "20:00", rps: 150 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Request Throughput</h2>
      <p className="text-sm text-muted-foreground">Requests per second over time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={throughputData}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="time"
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
            <Line
              type="monotone"
              dataKey="rps"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={4}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
