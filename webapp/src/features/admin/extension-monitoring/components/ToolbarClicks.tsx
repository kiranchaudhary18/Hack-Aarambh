import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toolbarClicks } from "../data/usageData";

export function ToolbarClicks() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Toolbar Clicks</h2>
      <p className="text-sm text-muted-foreground">Daily toolbar button clicks</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={toolbarClicks}>
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
              dataKey="clicks"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={4}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
