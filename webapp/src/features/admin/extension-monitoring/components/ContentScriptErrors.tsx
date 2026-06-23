import { useState, useEffect } from "react";
import { FileCode } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ContentScriptErrors() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load script error data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading script errors..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const contentScriptErrors = extensionData?.scriptErrors || [
    { domain: "linkedin.com", type: "CORS Error", errors: 45 },
    { domain: "indeed.com", type: "DOM Exception", errors: 28 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Content Script Errors</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <FileCode className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {contentScriptErrors.map((error: any) => (
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
