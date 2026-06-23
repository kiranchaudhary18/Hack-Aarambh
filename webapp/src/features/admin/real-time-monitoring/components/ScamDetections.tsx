import { AlertTriangle } from "lucide-react";
import { scamDetections } from "../data/eventFeedData";

export function ScamDetections() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Scam Detections</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/20">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {scamDetections.map((detection) => (
          <div key={detection.scanId} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{detection.scamType}</p>
              <p className="text-xs text-muted-foreground">{detection.details}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{detection.confidence}%</p>
              <p className="text-xs text-muted-foreground">{detection.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
