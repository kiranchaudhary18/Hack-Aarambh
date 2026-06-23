import { Send } from "lucide-react";
import { alertDelivery } from "../data/webSocketData";

export function AlertDelivery() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Alert Delivery</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Send className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {alertDelivery.map((alert) => (
          <div key={alert.alertId} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{alert.alertId}</p>
              <p className="text-xs text-muted-foreground">
                Recipients: {alert.recipients} • Delivery: {alert.deliveryTime}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                alert.delivered
                  ? "bg-green-500/20 text-green-500"
                  : "bg-yellow-500/20 text-yellow-500"
              }`}
            >
              {alert.delivered ? "Delivered" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
