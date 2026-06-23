import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { featureImportance } from "../data/healthData";

export function FeatureImportance() {
  const data = featureImportance.map((f) => ({
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
