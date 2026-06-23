import { Brain } from "lucide-react";
import { modelAccuracy } from "../data/alertsData";

export function ModelAccuracy() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Model Accuracy
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-pink-500/20">
          <Brain className="h-5 w-5 text-pink-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="mt-1 font-display text-2xl font-bold">{modelAccuracy.currentAccuracy}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Threshold</p>
          <p className="mt-1 font-display text-2xl font-bold">{modelAccuracy.threshold}%</p>
        </div>
      </div>
      <span
        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
          modelAccuracy.status === "critical"
            ? "bg-red-500/20 text-red-500"
            : modelAccuracy.status === "warning"
            ? "bg-yellow-500/20 text-yellow-500"
            : "bg-green-500/20 text-green-500"
        }`}
      >
        {modelAccuracy.status}
      </span>
    </div>
  );
}
