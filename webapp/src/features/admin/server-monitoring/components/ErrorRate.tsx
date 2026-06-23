import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ErrorRate() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerAPI();
        setServerData(data);
      } catch (err) {
        setError("Failed to load error rate data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading error rate..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const apiErrorRate = serverData?.errorRate || [
    { timestamp: "00:00", rate4xx: 0.8, rate5xx: 0.2 },
    { timestamp: "04:00", rate4xx: 0.5, rate5xx: 0.1 },
    { timestamp: "08:00", rate4xx: 1.2, rate5xx: 0.3 },
    { timestamp: "12:00", rate4xx: 1.8, rate5xx: 0.5 },
    { timestamp: "16:00", rate4xx: 1.4, rate5xx: 0.4 },
    { timestamp: "20:00", rate4xx: 0.9, rate5xx: 0.2 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">API Error Rate</h2>
      <p className="text-sm text-muted-foreground">4xx and 5xx error rates over time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={apiErrorRate}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="timestamp"
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
              dataKey="rate4xx"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="4xx Rate %"
            />
            <Line
              type="monotone"
              dataKey="rate5xx"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="5xx Rate %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
