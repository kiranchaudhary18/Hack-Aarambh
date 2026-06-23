import { XCircle } from "lucide-react";
import { apiErrors } from "../data/eventFeedData";

export function APIErrors() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">API Errors</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
          <XCircle className="h-5 w-5 text-orange-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {apiErrors.map((error) => (
          <div key={`${error.endpoint}-${error.timestamp}`} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{error.endpoint}</p>
              <p className="text-xs text-muted-foreground">{error.error}</p>
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  error.statusCode >= 500
                    ? "bg-red-500/20 text-red-500"
                    : error.statusCode >= 400
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-gray-500/20 text-gray-500"
                }`}
              >
                {error.statusCode}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{error.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
