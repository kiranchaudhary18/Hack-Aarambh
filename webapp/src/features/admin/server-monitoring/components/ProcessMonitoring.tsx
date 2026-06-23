import { Activity } from "lucide-react";
import { processStatus } from "../data/systemResourcesData";

export function ProcessMonitoring() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Process Monitoring</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <Activity className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {processStatus.map((process) => (
          <div key={process.pid} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{process.name}</p>
              <p className="text-xs text-muted-foreground">PID: {process.pid} • Uptime: {process.uptime}</p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-xs text-muted-foreground">CPU</p>
                <p className="font-display text-lg font-bold">{process.cpu}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Memory</p>
                <p className="font-display text-lg font-bold">{process.memory}GB</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    process.status === "running"
                      ? "bg-green-500/20 text-green-500"
                      : process.status === "stopped"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {process.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
