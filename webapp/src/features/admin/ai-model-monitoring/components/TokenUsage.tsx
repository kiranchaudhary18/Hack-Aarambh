import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function TokenUsage() {
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

  if (loading) return <LoadingState message="Loading token usage..." />;

  const tokenUsageData = resourceData?.tokenUsageHistory || [
    { date: "2024-01-01", tokens: 0, cost: 0 },
    { date: "2024-01-02", tokens: 0, cost: 0 },
    { date: "2024-01-03", tokens: 0, cost: 0 },
    { date: "2024-01-04", tokens: 0, cost: 0 },
    { date: "2024-01-05", tokens: 0, cost: 0 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Token Usage & Cost</h2>
      <p className="text-sm text-muted-foreground">Daily token consumption and associated costs</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={tokenUsageData}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="date"
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
              dataKey="tokens"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="Tokens"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="Cost ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
