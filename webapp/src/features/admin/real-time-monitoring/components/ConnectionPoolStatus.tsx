import { Database } from "lucide-react";
import { connectionPoolStatus } from "../data/alertsData";

export function ConnectionPoolStatus() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Connection Pool
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Database className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 font-display text-2xl font-bold">{connectionPoolStatus.active}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Max</p>
          <p className="mt-1 font-display text-2xl font-bold">{connectionPoolStatus.max}</p>
        </div>
      </div>
      <div className="clay-inset mt-3 h-2 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${
            connectionPoolStatus.status === "critical"
              ? "bg-red-500"
              : connectionPoolStatus.status === "warning"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${(connectionPoolStatus.active / connectionPoolStatus.max) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Threshold: {connectionPoolStatus.threshold}%</p>
      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
          connectionPoolStatus.status === "critical"
            ? "bg-red-500/20 text-red-500"
            : connectionPoolStatus.status === "warning"
            ? "bg-yellow-500/20 text-yellow-500"
            : "bg-green-500/20 text-green-500"
        }`}
      >
        {connectionPoolStatus.status}
      </span>
    </div>
  );
}
