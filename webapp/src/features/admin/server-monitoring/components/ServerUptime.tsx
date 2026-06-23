import { Clock } from "lucide-react";
import { serverUptime } from "../data/uptimeData";

export function ServerUptime() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Server Uptime</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <Clock className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 clay-inset rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Current Uptime</p>
        <p className="mt-2 font-display text-4xl font-bold">{serverUptime.current}</p>
      </div>
    </div>
  );
}
