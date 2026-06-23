import { useState, useEffect } from "react";
import { GitBranch } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ModelVersion() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIHealth();
        setHealthData(data);
      } catch (err) {
        setError("Failed to load model health data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading model versions..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const modelVersions = healthData?.modelVersions || [
    { version: "v2.1.0", deployedDate: "2024-01-15", accuracy: 94.2, status: "active" },
    { version: "v2.0.5", deployedDate: "2024-01-01", accuracy: 93.8, status: "testing" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Model Versions</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <GitBranch className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {modelVersions.map((version: any) => (
          <div
            key={version.version}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{version.version}</p>
              <p className="text-xs text-muted-foreground">
                Deployed: {version.deployedDate} • Accuracy: {version.accuracy}%
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                version.status === "active"
                  ? "bg-green-500/20 text-green-500"
                  : version.status === "testing"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-gray-500/20 text-gray-500"
              }`}
            >
              {version.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
