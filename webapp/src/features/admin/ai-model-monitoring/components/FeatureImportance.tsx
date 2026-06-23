import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function FeatureImportance() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIHealth();
        setHealthData(data);
      } catch (err) {
        setError("Failed to load health data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading feature importance..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const featureImportance = healthData?.featureImportance || [
    { feature: "Job Title", importance: 0.32, change: 0.05 },
    { feature: "Company Name", importance: 0.28, change: -0.02 },
    { feature: "Description", importance: 0.22, change: 0.03 },
    { feature: "Salary", importance: 0.18, change: 0.01 },
  ];

  const data = featureImportance.map((f: any) => ({
    feature: f.feature,
    importance: f.importance,
    change: f.change,
  }));

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Feature Importance</h2>
      <p className="text-sm text-muted-foreground">Most influential features in predictions</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={data} barGap={6} layout="vertical">
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" horizontal={false} />
            <XAxis
              type="number"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
            <Bar dataKey="importance" fill="oklch(0.72 0.16 155)" radius={[0, 12, 12, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
