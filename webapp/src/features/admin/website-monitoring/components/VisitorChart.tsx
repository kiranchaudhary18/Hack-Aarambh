import { Activity, Clock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { visitorData } from "../data/trafficData";

export function VisitorChart() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-purple)" }}>
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Real-time Visitors</h2>
            <p className="text-sm text-muted-foreground">Last 24 hours</p>
          </div>
        </div>
        <span className="clay-pill inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> Live
        </span>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={visitorData}>
            <defs>
              <linearGradient id="visitorGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              interval={3}
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
              dataKey="visitors"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
