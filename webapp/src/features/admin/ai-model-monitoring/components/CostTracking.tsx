import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function CostTracking() {
  const [resourceData, setResourceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIResources();
        setResourceData(data);
      } catch (err) {
        setError("Failed to load cost data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading cost data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const costBreakdown = resourceData?.costBreakdown || [
    { category: "API Calls", monthly: 450, color: "oklch(0.72 0.16 155)" },
    { category: "Compute", monthly: 280, color: "oklch(0.62 0.18 295)" },
    { category: "Storage", monthly: 85, color: "oklch(0.66 0.22 22)" },
    { category: "Bandwidth", monthly: 45, color: "oklch(0.75 0.15 45)" },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Cost Breakdown</h2>
      <p className="text-sm text-muted-foreground">Monthly cost distribution by category</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={costBreakdown}
              dataKey="monthly"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {costBreakdown.map((entry: any, index: number) => (
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
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
