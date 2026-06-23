import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { predictionDriftData } from "../data/accuracyData";

export function PredictionDrift() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Prediction Drift Over Time</h2>
      <p className="text-sm text-muted-foreground">Model accuracy and error rates trends</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={predictionDriftData}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="Accuracy %"
            />
            <Line
              type="monotone"
              dataKey="falsePositiveRate"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="FPR %"
            />
            <Line
              type="monotone"
              dataKey="falseNegativeRate"
              stroke="oklch(0.66 0.22 22)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.66 0.22 22)", r: 4 }}
              name="FNR %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
