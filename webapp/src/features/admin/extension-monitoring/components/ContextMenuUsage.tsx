import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function ContextMenuUsage() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionUsage();
        setExtensionData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading context menu usage..." />;

  const contextMenuUsage = extensionData?.contextMenu || [];

  const data = contextMenuUsage.map((item: any) => ({
    ...item,
    color:
      item.action === "Scan Selection"
        ? "oklch(0.72 0.16 155)"
        : item.action === "Scan Link"
        ? "oklch(0.62 0.18 295)"
        : item.action === "Scan Image"
        ? "oklch(0.66 0.22 22)"
        : item.action === "Report"
        ? "oklch(0.75 0.12 85)"
        : "oklch(0.68 0.15 45)",
  }));

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Context Menu Usage</h2>
      <p className="text-sm text-muted-foreground">Most used context menu actions</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="action"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--card)" strokeWidth={4} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
