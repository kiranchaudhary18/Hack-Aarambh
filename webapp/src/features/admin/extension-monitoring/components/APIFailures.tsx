import { XCircle } from "lucide-react";
import { apiFailures } from "../data/errorData";

export function APIFailures() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">API Failures</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
          <XCircle className="h-5 w-5 text-orange-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {apiFailures.map((failure) => (
          <div key={failure.endpoint} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{failure.endpoint}</p>
              <p className="text-xs text-muted-foreground">{failure.failures} failures</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{failure.errorRate}%</p>
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
