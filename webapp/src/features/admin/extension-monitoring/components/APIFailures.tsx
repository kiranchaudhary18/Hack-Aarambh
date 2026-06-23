import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function APIFailures() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load API failure data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading API failures..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const apiFailures = extensionData?.apiFailures || [
    { endpoint: "/api/scan", failures: 45, errorRate: 0.8 },
    { endpoint: "/api/analyze", failures: 28, errorRate: 1.2 },
    { endpoint: "/api/report", failures: 15, errorRate: 0.5 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">API Failures</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
          <XCircle className="h-5 w-5 text-orange-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {apiFailures.map((failure: any) => (
          <div key={failure.endpoint} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{failure.endpoint}</p>
              <p className="text-xs text-muted-foreground">{failure.failures} failures</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{failure.errorRate}%</p>
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
