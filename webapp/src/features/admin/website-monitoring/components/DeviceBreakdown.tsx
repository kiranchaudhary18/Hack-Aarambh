import { Monitor, Smartphone, Tablet, PieChart } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { deviceData, browserData } from "../data/userData";

const deviceColors = ["oklch(0.62 0.18 295)", "oklch(0.72 0.16 155)", "oklch(0.75 0.12 85)"];
const browserColors = ["oklch(0.62 0.18 295)", "oklch(0.72 0.16 155)", "oklch(0.75 0.12 85)", "oklch(0.66 0.22 22)"];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Smartphone,
  Tablet,
};

export function DeviceBreakdown() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="clay p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-purple)" }}>
            <Monitor className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Devices</h2>
            <p className="text-sm text-muted-foreground">By device type</p>
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <RechartsPieChart>
              <Pie
                data={deviceData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={4}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={deviceColors[index]} stroke="var(--card)" strokeWidth={4} />
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

      <div className="clay p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-blue)" }}>
            <PieChart className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Browsers</h2>
            <p className="text-sm text-muted-foreground">By browser</p>
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <RechartsPieChart>
              <Pie
                data={browserData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={4}
              >
                {browserData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={browserColors[index]} stroke="var(--card)" strokeWidth={4} />
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
    </div>
  );
}
