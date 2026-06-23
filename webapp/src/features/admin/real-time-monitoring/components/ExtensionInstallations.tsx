import { Puzzle } from "lucide-react";
import { extensionInstalls } from "../data/eventFeedData";

export function ExtensionInstallations() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Extension Installations</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Puzzle className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {extensionInstalls.map((install) => (
          <div key={install.userId} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{install.browser} {install.version}</p>
              <p className="text-xs text-muted-foreground">User: {install.userId}</p>
            </div>
            <p className="text-xs text-muted-foreground">{install.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
