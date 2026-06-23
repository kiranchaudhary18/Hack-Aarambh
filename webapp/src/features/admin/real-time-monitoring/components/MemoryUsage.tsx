import { MemoryStick } from "lucide-react";
import { memoryUsage } from "../data/alertsData";

export function MemoryUsage() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <MemoryStick className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">Current Usage</p>
        <p className="mt-1 font-display text-4xl font-bold">{memoryUsage.current}%</p>
      </div>
      <div className="clay-inset mt-3 h-2 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${
            memoryUsage.status === "critical"
              ? "bg-red-500"
              : memoryUsage.status === "warning"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${memoryUsage.current}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Threshold: {memoryUsage.threshold}%</p>
      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
          memoryUsage.status === "critical"
            ? "bg-red-500/20 text-red-500"
            : memoryUsage.status === "warning"
            ? "bg-yellow-500/20 text-yellow-500"
            : "bg-green-500/20 text-green-500"
        }`}
      >
        {memoryUsage.status}
      </span>
    </div>
  );
}
