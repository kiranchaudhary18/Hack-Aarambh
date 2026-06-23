import { FileCode } from "lucide-react";
import { contentScriptErrors } from "../data/errorData";

export function ContentScriptErrors() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Content Script Errors</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <FileCode className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {contentScriptErrors.map((error) => (
          <div key={error.domain} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{error.domain}</p>
              <p className="text-xs text-muted-foreground">{error.type}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{error.errors}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
