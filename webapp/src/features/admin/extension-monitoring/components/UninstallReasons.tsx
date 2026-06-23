import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { uninstallReasons } from "../data/installationData";

export function UninstallReasons() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Uninstall Reasons</h2>
      <p className="text-sm text-muted-foreground">Why users are uninstalling</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={uninstallReasons} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="reason"
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
            <Bar dataKey="count" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
