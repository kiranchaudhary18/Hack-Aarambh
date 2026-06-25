import { useState, useEffect } from "react";
import { Code, FileCode, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

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
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteTraffic();
        setWebsiteData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading JS errors..." />;

  const jsErrors = websiteData?.jsErrors || [];

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
        {jsErrors.length > 0 ? (
          jsErrors.map((error: any) => {
            const SeverityIcon = severityIcons[error.severity as keyof typeof severityIcons];
            return (
              <div key={error.id} className="clay-inset p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SeverityIcon className="h-4 w-4" style={{ color: severityColors[error.severity as keyof typeof severityColors] }} />
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
          })
        ) : (
          <div className="text-center py-8">
            <Code className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No JavaScript errors recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}
