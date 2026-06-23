import { WifiOff, AlertCircle } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { networkErrorData } from "../data/errorData";

export function NetworkErrors() {
  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-pink)" }}>
          <WifiOff className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Network Errors</h2>
          <p className="text-sm text-muted-foreground">By error type</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={networkErrorData}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {networkErrorData.map((entry, index) => (
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
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
