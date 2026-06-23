import { Layout, Grid } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { pageViewData } from "../data/trafficData";

const heatColors = {
  high: "oklch(0.62 0.18 295)",
  medium: "oklch(0.72 0.16 155)",
  low: "oklch(0.75 0.12 85)",
};

export function PageViewsChart() {
  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-blue)" }}>
          <Layout className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Page Views</h2>
          <p className="text-sm text-muted-foreground">By page path with heatmap intensity</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={pageViewData} layout="vertical" barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" horizontal={false} />
            <XAxis type="number" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="page" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={80} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
            <Bar dataKey="views" radius={[0, 8, 8, 0]}>
              {pageViewData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={heatColors[entry.heat]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
