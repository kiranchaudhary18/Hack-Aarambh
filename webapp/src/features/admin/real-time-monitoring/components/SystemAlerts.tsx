import { Bell } from "lucide-react";
import { systemAlerts } from "../data/eventFeedData";

export function SystemAlerts() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">System Alerts</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <Bell className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {systemAlerts.map((alert) => (
          <div key={`${alert.alertType}-${alert.timestamp}`} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{alert.alertType}</p>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  alert.severity === "critical"
                    ? "bg-red-500/20 text-red-500"
                    : alert.severity === "high"
                    ? "bg-orange-500/20 text-orange-500"
                    : alert.severity === "medium"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-blue-500/20 text-blue-500"
                }`}
              >
                {alert.severity}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{alert.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
