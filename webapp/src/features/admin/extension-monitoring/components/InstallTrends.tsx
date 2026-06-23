import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function InstallTrends() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load install trends");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading install trends..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const installTrends = extensionData?.installTrends || [
    { date: "2024-01-01", installs: 450, uninstalls: 28 },
    { date: "2024-01-02", installs: 520, uninstalls: 35 },
    { date: "2024-01-03", installs: 480, uninstalls: 42 },
    { date: "2024-01-04", installs: 610, uninstalls: 38 },
    { date: "2024-01-05", installs: 550, uninstalls: 45 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Install Trends</h2>
      <p className="text-sm text-muted-foreground">Daily installs vs uninstalls</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={installTrends}>
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
              dataKey="installs"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="Installs"
            />
            <Line
              type="monotone"
              dataKey="uninstalls"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="Uninstalls"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
