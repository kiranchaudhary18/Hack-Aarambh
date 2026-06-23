import { HeartPulse } from "lucide-react";
import { serviceHealth } from "../data/uptimeData";

export function ServiceHealth() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Service Health</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/20">
          <HeartPulse className="h-5 w-5 text-red-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {serviceHealth.map((service) => (
          <div key={service.service} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{service.service}</p>
              <p className="text-xs text-muted-foreground">
                Response: {service.responseTime}ms • Checked: {service.lastCheck}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                service.status === "healthy"
                  ? "bg-green-500/20 text-green-500"
                  : service.status === "degraded"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
