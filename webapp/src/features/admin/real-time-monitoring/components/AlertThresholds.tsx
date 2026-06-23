import { Gauge } from "lucide-react";
import { alertThresholds } from "../data/alertsData";

export function AlertThresholds() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Alert Thresholds</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Gauge className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {alertThresholds.map((threshold) => (
          <div key={threshold.metric} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{threshold.metric}</p>
              <p className="text-xs text-muted-foreground">
                Threshold: {threshold.threshold} • Last triggered: {threshold.lastTriggered}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{threshold.currentValue}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  threshold.status === "critical"
                    ? "bg-red-500/20 text-red-500"
                    : threshold.status === "warning"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-green-500/20 text-green-500"
                }`}
              >
                {threshold.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
