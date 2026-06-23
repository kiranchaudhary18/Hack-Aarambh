import { Bell } from "lucide-react";
import { realTimeNotifications } from "../data/webSocketData";

export function RealTimeNotifications() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Real-time Notifications</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <Bell className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {realTimeNotifications.map((notification) => (
          <div key={notification.id} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{notification.type}</p>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
            </div>
            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
