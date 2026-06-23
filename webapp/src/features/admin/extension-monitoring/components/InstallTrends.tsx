import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { installTrends } from "../data/installationData";

export function InstallTrends() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Install Trends</h2>
      <p className="text-sm text-muted-foreground">Daily installs vs uninstalls</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={installTrends}>
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
              dataKey="installs"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="Installs"
            />
            <Line
              type="monotone"
              dataKey="uninstalls"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="Uninstalls"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
