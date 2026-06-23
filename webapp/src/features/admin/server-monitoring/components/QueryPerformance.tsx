import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function QueryPerformance() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerDatabase();
        setServerData(data);
      } catch (err) {
        setError("Failed to load query performance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading query performance..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const queryPerformance = serverData?.queries || [
    { query: "SELECT * FROM history WHERE user_id = ?", count: 15420, avgTime: 12, slowQueries: 0 },
    { query: "SELECT * FROM scam_database WHERE status = ?", count: 8230, avgTime: 28, slowQueries: 5 },
    { query: "INSERT INTO history (...) VALUES (...)", count: 4520, avgTime: 8, slowQueries: 0 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Query Performance</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Clock className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {queryPerformance.map((query: any, index: number) => (
          <div key={index} className="clay-inset rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-medium truncate">{query.query}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Executed {query.count.toLocaleString()} times
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="font-display text-2xl font-bold">{query.avgTime}ms</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
            </div>
            {query.slowQueries > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">
                  {query.slowQueries} slow queries
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
