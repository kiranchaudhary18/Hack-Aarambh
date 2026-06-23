import { TrendingUp } from "lucide-react";
import { scamDetectionRate } from "../data/alertsData";

export function ScamDetectionRate() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scam Detection Rate
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/20">
          <TrendingUp className="h-5 w-5 text-red-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="mt-1 font-display text-2xl font-bold">{scamDetectionRate.currentRate}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Threshold</p>
          <p className="mt-1 font-display text-2xl font-bold">{scamDetectionRate.threshold}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Trend</p>
          <p className="mt-1 font-display text-2xl font-bold">{scamDetectionRate.trend}%</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Last updated: {scamDetectionRate.lastUpdated}</p>
    </div>
  );
}
