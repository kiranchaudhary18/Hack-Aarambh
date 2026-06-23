import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ToolbarClicks() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load toolbar data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading toolbar clicks..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const toolbarClicks = extensionData?.toolbarClicks || [
    { date: "2024-01-01", clicks: 12450 },
    { date: "2024-01-02", clicks: 13200 },
    { date: "2024-01-03", clicks: 11800 },
    { date: "2024-01-04", clicks: 14500 },
    { date: "2024-01-05", clicks: 13800 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Toolbar Clicks</h2>
      <p className="text-sm text-muted-foreground">Daily toolbar button clicks</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={toolbarClicks}>
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
            <Line
              type="monotone"
              dataKey="clicks"
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
