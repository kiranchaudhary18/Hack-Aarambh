import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { cohortData } from "../data/retentionData";

export function CohortAnalysis() {
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
