import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function ConfidenceDistribution() {
  const [accuracyData, setAccuracyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIAccuracy();
        setAccuracyData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading confidence distribution..." />;

  const confidenceDistribution = accuracyData?.confidenceDistribution || {
    averageConfidence: 0,
    buckets: [
      { range: "0-0.2", count: 0, accuracy: 0 },
      { range: "0.2-0.4", count: 0, accuracy: 0 },
      { range: "0.4-0.6", count: 0, accuracy: 0 },
      { range: "0.6-0.8", count: 0, accuracy: 0 },
      { range: "0.8-1.0", count: 0, accuracy: 0 },
    ],
  };

  const data = confidenceDistribution.buckets.map((b: any) => ({
    range: b.range,
    count: b.count,
    accuracy: b.accuracy,
  }));

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Confidence Score Distribution</h2>
      <p className="text-sm text-muted-foreground">
        Average confidence: {confidenceDistribution.averageConfidence.toFixed(2)}
      </p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={data} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="range"
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
            <Bar dataKey="count" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
