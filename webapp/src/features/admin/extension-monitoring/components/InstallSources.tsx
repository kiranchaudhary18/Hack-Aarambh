import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function InstallSources() {
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

  if (loading) return <LoadingState message="Loading install sources..." />;

  const installSources = extensionData?.installSources || [];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Install Sources</h2>
      <p className="text-sm text-muted-foreground">Where users are installing from</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={installSources}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {installSources.map((entry: any, index: number) => (
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
