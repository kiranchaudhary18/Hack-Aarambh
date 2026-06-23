import { Database } from "lucide-react";
import { connectionPool } from "../data/databaseHealthData";

export function ConnectionPool() {
  const stats = [
    { label: "Active", value: connectionPool.active, color: "var(--clay-green)" },
    { label: "Idle", value: connectionPool.idle, color: "var(--clay-blue)" },
    { label: "Waiting", value: connectionPool.waiting, color: "var(--clay-orange)" },
  ];

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
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          Total: {connectionPool.total} / Max: {connectionPool.max}
        </p>
      </div>
    </div>
  );
}
