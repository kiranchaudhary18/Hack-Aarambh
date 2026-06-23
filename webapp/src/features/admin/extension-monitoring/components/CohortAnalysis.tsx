import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function CohortAnalysis() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load cohort data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading cohort analysis..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const cohortData = extensionData?.cohorts || [
    { cohortDate: "2024-01", d1Retention: 82, d7Retention: 58, d30Retention: 38 },
    { cohortDate: "2024-02", d1Retention: 78, d7Retention: 52, d30Retention: 34 },
    { cohortDate: "2024-03", d1Retention: 75, d7Retention: 48, d30Retention: 31 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Cohort Analysis</h2>
      <p className="text-sm text-muted-foreground">Retention by install cohort</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={cohortData} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="cohortDate"
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
            <Bar dataKey="d1Retention" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} name="D1 %" />
            <Bar dataKey="d7Retention" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} name="D7 %" />
            <Bar dataKey="d30Retention" fill="oklch(0.66 0.22 22)" radius={[12, 12, 0, 0]} name="D30 %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
