import { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ConnectionPool() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerDatabase();
        setServerData(data);
      } catch (err) {
        setError("Failed to load connection pool data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading connection pool..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const connectionPool = serverData?.connectionPool || { active: 18, idle: 12, waiting: 2, total: 32, max: 50 };
  const stats = [
    { label: "Active", value: connectionPool.active, color: "var(--clay-green)" },
    { label: "Idle", value: connectionPool.idle, color: "var(--clay-blue)" },
    { label: "Waiting", value: connectionPool.waiting, color: "var(--clay-orange)" },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Connection Pool
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Database className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          Total: {connectionPool.total} / Max: {connectionPool.max}
        </p>
      </div>
    </div>
  );
}
