import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function FalseNegativeRate() {
  const [accuracyData, setAccuracyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIAccuracy();
        setAccuracyData(data);
      } catch (err) {
        setError("Failed to load accuracy data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading false negative rate..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const data = accuracyData?.falseNegativeHistory || [
    { date: "2024-01-01", rate: 0.08 },
    { date: "2024-01-02", rate: 0.075 },
    { date: "2024-01-03", rate: 0.07 },
    { date: "2024-01-04", rate: 0.068 },
    { date: "2024-01-05", rate: 0.065 },
  ].map((d) => ({
    date: d.date,
    rate: d.rate,
  }));

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">False Negative Rate Trend</h2>
      <p className="text-sm text-muted-foreground">Scams incorrectly marked as safe</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={data}>
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
              dataKey="rate"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={4}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
