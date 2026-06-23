import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { apiResponseTime } from "../data/apiPerformanceData";

export function ResponseTime() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">API Response Time</h2>
      <p className="text-sm text-muted-foreground">Latency percentiles by endpoint</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={apiResponseTime} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="endpoint"
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
            <Bar dataKey="p50" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} name="p50 (ms)" />
            <Bar dataKey="p95" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} name="p95 (ms)" />
            <Bar dataKey="p99" fill="oklch(0.66 0.22 22)" radius={[12, 12, 0, 0]} name="p99 (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
