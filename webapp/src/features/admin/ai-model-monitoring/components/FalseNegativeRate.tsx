import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { predictionDriftData } from "../data/accuracyData";

export function FalseNegativeRate() {
  const data = predictionDriftData.map((d) => ({
    date: d.date,
    rate: d.falseNegativeRate,
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
