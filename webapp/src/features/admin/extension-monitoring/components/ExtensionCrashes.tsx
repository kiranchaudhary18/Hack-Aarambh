import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ExtensionCrashes() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load crash data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading crash data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const extensionCrashes = extensionData?.crashes || [
    { browser: "Chrome", version: "120", users: 245, crashes: 12 },
    { browser: "Firefox", version: "121", users: 85, crashes: 5 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Extension Crashes</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/20">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {extensionCrashes.map((crash: any) => (
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
