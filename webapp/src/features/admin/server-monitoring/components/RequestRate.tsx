import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function RequestRate() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerAPI();
        setServerData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading request rate..." />;

  const apiRequestRate = serverData?.requestRate || [];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">API Request Rate</h2>
      <p className="text-sm text-muted-foreground">Requests per minute over time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={apiRequestRate}>
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
            <Line
              type="monotone"
              dataKey="rpm"
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
