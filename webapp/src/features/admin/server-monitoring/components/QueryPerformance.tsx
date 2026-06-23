import { Clock } from "lucide-react";
import { queryPerformance } from "../data/databaseHealthData";

export function QueryPerformance() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Query Performance</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Clock className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {queryPerformance.map((query, index) => (
          <div key={index} className="clay-inset rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-medium truncate">{query.query}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Executed {query.count.toLocaleString()} times
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="font-display text-2xl font-bold">{query.avgTime}ms</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
            </div>
            {query.slowQueries > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">
                  {query.slowQueries} slow queries
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
