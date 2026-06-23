import { Clock, Timer, Gauge, CheckCircle2, AlertTriangle } from "lucide-react";
import { pageLoadPercentiles } from "../data/performanceData";

export function PageLoadTimes() {
  const statusIcons = {
    good: CheckCircle2,
    warning: AlertTriangle,
    bad: AlertTriangle,
  };

  const statusColors = {
    good: "var(--clay-green)",
    warning: "var(--clay-yellow)",
    bad: "var(--clay-red)",
  };

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-blue)" }}>
          <Clock className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Page Load Times</h2>
          <p className="text-sm text-muted-foreground">Percentile breakdown</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {pageLoadPercentiles.map((item) => {
          const StatusIcon = statusIcons[item.status];
          return (
            <div key={item.percentile} className="clay-inset flex items-center gap-4 p-4">
              <span className="font-display text-lg font-bold text-muted-foreground">{item.percentile}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Load Time</span>
                  <span className="font-display text-lg font-bold">{item.time.toFixed(1)}s</span>
                </div>
                <div className="clay-inset mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.time / 5) * 100}%`, background: statusColors[item.status] }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" style={{ color: statusColors[item.status] }} />
                <span className="text-xs text-muted-foreground">Target: {item.target}s</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
