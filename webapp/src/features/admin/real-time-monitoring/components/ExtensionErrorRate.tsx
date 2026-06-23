import { Puzzle } from "lucide-react";
import { extensionErrorRate } from "../data/alertsData";

export function ExtensionErrorRate() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Extension Error Rate
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <Puzzle className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="mt-1 font-display text-2xl font-bold">{extensionErrorRate.currentRate}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Threshold</p>
          <p className="mt-1 font-display text-2xl font-bold">{extensionErrorRate.threshold}%</p>
        </div>
      </div>
      <span
        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
          extensionErrorRate.status === "critical"
            ? "bg-red-500/20 text-red-500"
            : extensionErrorRate.status === "warning"
            ? "bg-yellow-500/20 text-yellow-500"
            : "bg-green-500/20 text-green-500"
        }`}
      >
        {extensionErrorRate.status}
      </span>
    </div>
  );
}
