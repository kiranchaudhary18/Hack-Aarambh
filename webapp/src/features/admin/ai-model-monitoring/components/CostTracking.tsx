import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { costBreakdown } from "../data/resourceData";

export function CostTracking() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Cost Breakdown</h2>
      <p className="text-sm text-muted-foreground">Monthly cost distribution by category</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={costBreakdown}
              dataKey="monthly"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {costBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--card)" strokeWidth={4} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
