import { Activity } from "lucide-react";
import { liveDashboard } from "../data/webSocketData";

export function LiveDashboard() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Dashboard
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <Activity className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Status</p>
          <span
            className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
              liveDashboard.connected
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {liveDashboard.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Updates</p>
          <p className="mt-1 font-display text-2xl font-bold">{liveDashboard.updateCount.toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Last update: {liveDashboard.lastUpdate}</p>
    </div>
  );
}
