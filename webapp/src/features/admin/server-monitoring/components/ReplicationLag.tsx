import { RefreshCw } from "lucide-react";
import { replicationLag } from "../data/databaseHealthData";

export function ReplicationLag() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Replication Lag</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <RefreshCw className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 clay-inset rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Primary</p>
            <p className="font-semibold">{replicationLag.primary}</p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Replica</p>
            <p className="font-semibold">{replicationLag.replica}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Lag</p>
            <p className="font-display text-4xl font-bold">{replicationLag.lag}s</p>
          </div>
          <div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                replicationLag.status === "synced"
                  ? "bg-green-500/20 text-green-500"
                  : replicationLag.status === "lagging"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {replicationLag.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
