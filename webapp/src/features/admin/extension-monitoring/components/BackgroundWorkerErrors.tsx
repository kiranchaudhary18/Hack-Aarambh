import { Cpu } from "lucide-react";
import { backgroundWorkerErrors } from "../data/errorData";

export function BackgroundWorkerErrors() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Background Worker Errors</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Cpu className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {backgroundWorkerErrors.map((error) => (
          <div key={error.error} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{error.error}</p>
              <p className="text-xs text-muted-foreground">Last seen: {error.lastSeen}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{error.count}</p>
              <p className="text-xs text-muted-foreground">Count</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
