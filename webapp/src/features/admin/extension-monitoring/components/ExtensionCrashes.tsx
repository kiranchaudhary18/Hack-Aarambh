import { AlertTriangle } from "lucide-react";
import { extensionCrashes } from "../data/errorData";

export function ExtensionCrashes() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Extension Crashes</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/20">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {extensionCrashes.map((crash) => (
          <div key={`${crash.browser}-${crash.version}`} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{crash.browser} {crash.version}</p>
              <p className="text-xs text-muted-foreground">{crash.users} users affected</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{crash.crashes}</p>
              <p className="text-xs text-muted-foreground">Crashes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
