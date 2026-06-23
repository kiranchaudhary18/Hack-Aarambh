import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { dataDriftMetrics } from "../data/healthData";

export function TrainingDataDrift() {
  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Training Data Drift</h2>
      <p className="text-sm text-muted-foreground">Feature distribution changes over time</p>
      <div className="mt-4 space-y-3">
        {dataDriftMetrics.map((metric) => {
          const Icon =
            metric.status === "normal"
              ? CheckCircle
              : metric.status === "warning"
              ? AlertTriangle
              : XCircle;
          const color =
            metric.status === "normal"
              ? "text-green-500"
              : metric.status === "warning"
              ? "text-yellow-500"
              : "text-red-500";
          return (
            <div
              key={metric.feature}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <p className="font-semibold">{metric.feature}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold">{metric.driftScore.toFixed(2)}</p>
                <p className={`text-xs font-medium ${color}`}>{metric.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
