import { Code, FileCode, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { jsErrors } from "../data/errorData";

const severityIcons = {
  high: AlertTriangle,
  medium: AlertCircle,
  low: Info,
};

const severityColors = {
  high: "var(--clay-red)",
  medium: "var(--clay-yellow)",
  low: "var(--clay-blue)",
};

export function JSErrorsList() {
  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-red)" }}>
          <Code className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">JavaScript Errors</h2>
          <p className="text-sm text-muted-foreground">Recent errors with stack traces</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {jsErrors.map((error) => {
          const SeverityIcon = severityIcons[error.severity];
          return (
            <div key={error.id} className="clay-inset p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SeverityIcon className="h-4 w-4" style={{ color: severityColors[error.severity] }} />
                  <span className="font-mono text-sm font-semibold">{error.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{error.count} occurrences</span>
                  <span className="text-xs text-muted-foreground">{error.lastSeen}</span>
                </div>
              </div>
              <p className="text-sm font-medium mb-2">{error.message}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <FileCode className="h-3 w-3" />
                <span className="font-mono">{error.file}:{error.line}</span>
              </div>
              <pre className="clay-sm p-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                {error.stack}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
