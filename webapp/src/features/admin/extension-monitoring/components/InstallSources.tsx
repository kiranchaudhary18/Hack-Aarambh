import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { installSources } from "../data/installationData";

export function InstallSources() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Install Sources</h2>
      <p className="text-sm text-muted-foreground">Where users are installing from</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={installSources}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {installSources.map((entry, index) => (
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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
