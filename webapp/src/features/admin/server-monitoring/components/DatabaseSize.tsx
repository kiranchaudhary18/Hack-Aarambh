import { HardDrive } from "lucide-react";
import { databaseSize } from "../data/databaseHealthData";

export function DatabaseSize() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Database Size</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <HardDrive className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {databaseSize.map((db) => (
          <div key={db.database} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div>
              <p className="font-semibold">{db.database}</p>
              <p className="text-xs text-muted-foreground">
                {db.tables} tables • {db.indexes} indexes
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{db.size}GB</p>
              <p className={`text-xs font-medium ${db.growth.startsWith("+") ? "text-red-500" : "text-green-500"}`}>
                {db.growth}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
