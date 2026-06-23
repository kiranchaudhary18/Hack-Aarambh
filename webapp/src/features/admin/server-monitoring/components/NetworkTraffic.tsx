import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { networkTraffic } from "../data/systemResourcesData";

export function NetworkTraffic() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Network Traffic</h2>
      <p className="text-sm text-muted-foreground">Bandwidth and connection metrics over time</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={networkTraffic}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="timestamp"
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
              dataKey="bandwidthIn"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 4 }}
              name="Bandwidth In (MB/s)"
            />
            <Line
              type="monotone"
              dataKey="bandwidthOut"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              name="Bandwidth Out (MB/s)"
            />
            <Line
              type="monotone"
              dataKey="connections"
              stroke="oklch(0.66 0.22 22)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.66 0.22 22)", r: 4 }}
              name="Connections"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
