import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function VersionDistribution() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load version data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading version distribution..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const versionDistribution = extensionData?.versions || [
    { version: "v2.1.0", count: 28450, percentage: 49.2, status: "stable" },
    { version: "v2.0.5", count: 18230, percentage: 31.6, status: "stable" },
    { version: "v2.2.0-beta", count: 11000, percentage: 19.2, status: "beta" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Version Distribution</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Tag className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {versionDistribution.map((version: any) => (
          <div key={version.version} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{version.version}</p>
              <p className="text-xs text-muted-foreground">
                {version.count.toLocaleString()} users
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{version.percentage}%</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  version.status === "stable"
                    ? "bg-green-500/20 text-green-500"
                    : version.status === "beta"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-gray-500/20 text-gray-500"
                }`}
              >
                {version.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
