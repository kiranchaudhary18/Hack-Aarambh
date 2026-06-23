import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ServerUptime() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerUptime();
        setServerData(data);
      } catch (err) {
        setError("Failed to load uptime data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading uptime..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const serverUptime = serverData?.uptime || { current: "45d 12h 34m" };

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Server Uptime</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <Clock className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 clay-inset rounded-xl p-6">
        <p className="text-sm text-muted-foreground">Current Uptime</p>
        <p className="mt-2 font-display text-4xl font-bold">{serverUptime.current}</p>
      </div>
    </div>
  );
}
