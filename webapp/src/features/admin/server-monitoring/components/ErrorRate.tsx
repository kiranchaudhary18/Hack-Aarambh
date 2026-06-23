import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { apiErrorRate } from "../data/apiPerformanceData";

export function ErrorRate() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">API Error Rate</h2>
      <p className="text-sm text-muted-foreground">4xx and 5xx error rates over time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={apiErrorRate}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="timestamp"
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
              dataKey="rate4xx"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="4xx Rate %"
            />
            <Line
              type="monotone"
              dataKey="rate5xx"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="5xx Rate %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
