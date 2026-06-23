import { ScanSearch } from "lucide-react";
import { scanCompletions } from "../data/eventFeedData";

export function ScanCompletions() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Scan Completions</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <ScanSearch className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {scanCompletions.map((scan) => (
          <div key={scan.scanId} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{scan.scanId}</p>
              <p className="text-xs text-muted-foreground">
                Type: {scan.type} • Duration: {scan.duration}ms
              </p>
            </div>
            <div className="text-right">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  scan.result === "safe"
                    ? "bg-green-500/20 text-green-500"
                    : scan.result === "suspicious"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {scan.result}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{scan.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
