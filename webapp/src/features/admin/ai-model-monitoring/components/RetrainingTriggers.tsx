import { RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { retrainingTriggers } from "../data/healthData";

export function RetrainingTriggers() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Retraining Triggers</h2>
      <p className="text-sm text-muted-foreground">Automated retraining conditions and status</p>
      <div className="mt-4 space-y-3">
        {retrainingTriggers.map((trigger) => {
          const Icon =
            trigger.status === "active"
              ? RefreshCw
              : trigger.status === "triggered"
              ? AlertCircle
              : CheckCircle2;
          const color =
            trigger.status === "active"
              ? "text-blue-500"
              : trigger.status === "triggered"
              ? "text-red-500"
              : "text-green-500";
          return (
            <div
              key={trigger.trigger}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <div>
                  <p className="font-semibold">{trigger.trigger}</p>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {trigger.threshold} • Current: {trigger.currentValue}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    trigger.status === "active"
                      ? "bg-blue-500/20 text-blue-500"
                      : trigger.status === "triggered"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {trigger.status}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Checked: {trigger.lastChecked}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
