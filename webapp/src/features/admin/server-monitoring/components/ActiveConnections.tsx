import { Link } from "lucide-react";
import { activeConnections } from "../data/apiPerformanceData";

export function ActiveConnections() {
  const stats = [
    { label: "HTTP", value: activeConnections.http, color: "var(--clay-blue)" },
    { label: "WebSocket", value: activeConnections.websocket, color: "var(--clay-purple)" },
    { label: "Total", value: activeConnections.total, color: "var(--clay-green)" },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active Connections
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Link className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
