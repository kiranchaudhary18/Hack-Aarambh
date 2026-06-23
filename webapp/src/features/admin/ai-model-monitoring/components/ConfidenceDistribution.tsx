import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { confidenceDistribution } from "../data/accuracyData";

export function ConfidenceDistribution() {
  const data = confidenceDistribution.buckets.map((b) => ({
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
