import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function QueueStatus() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerAPI();
        setServerData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading queue status..." />;

  const queueStatus = serverData?.queues || [];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Queue Status</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
          <Layers className="h-5 w-5 text-orange-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {queueStatus.map((queue: any) => (
          <div key={queue.queueName} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{queue.queueName}</p>
              <p className="text-xs text-muted-foreground">
                Processing: {queue.processingRate}/s • Avg Wait: {queue.avgWaitTime}s
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{queue.depth}</p>
              <p className="text-xs text-muted-foreground">Queue Depth</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
