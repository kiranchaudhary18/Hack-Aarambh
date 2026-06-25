import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function QueueDepth() {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIPerformance();
        setPerformanceData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading queue data..." />;

  const queueDepthData = performanceData?.queueDepth || [
    { time: "00:00", queueSize: 0, processingRate: 0 },
    { time: "04:00", queueSize: 0, processingRate: 0 },
    { time: "08:00", queueSize: 0, processingRate: 0 },
    { time: "12:00", queueSize: 0, processingRate: 0 },
    { time: "16:00", queueSize: 0, processingRate: 0 },
    { time: "20:00", queueSize: 0, processingRate: 0 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Queue Depth & Processing Rate</h2>
      <p className="text-sm text-muted-foreground">Pending analyses and processing speed</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={queueDepthData}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="queueSize"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="Queue Size"
            />
            <Line
              type="monotone"
              dataKey="processingRate"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="Processing Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
