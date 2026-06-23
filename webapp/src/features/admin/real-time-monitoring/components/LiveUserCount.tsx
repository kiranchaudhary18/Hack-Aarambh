import { Users } from "lucide-react";
import { liveUserCount } from "../data/webSocketData";

export function LiveUserCount() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live User Count
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Users className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="mt-1 font-display text-2xl font-bold">{liveUserCount.current.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Peak</p>
          <p className="mt-1 font-display text-2xl font-bold">{liveUserCount.peak.toLocaleString()}</p>
        </div>
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          liveUserCount.change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {liveUserCount.change} from last hour
      </p>
    </div>
  );
}
