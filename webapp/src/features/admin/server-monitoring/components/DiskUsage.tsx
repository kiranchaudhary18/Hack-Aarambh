import { useState, useEffect } from "react";
import { HardDrive } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function DiskUsage() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerResources();
        setServerData(data);
      } catch (err) {
        setError("Failed to load disk data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading disk usage..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const diskUsage = serverData?.disk || [
    { mount: "/", used: 120, total: 500, percentage: 24, iops: { read: 450, write: 280 }, throughput: { read: 85, write: 45 } },
    { mount: "/var", used: 85, total: 200, percentage: 42, iops: { read: 320, write: 190 }, throughput: { read: 62, write: 38 } },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Disk Usage</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
          <HardDrive className="h-5 w-5 text-orange-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {diskUsage.map((disk: any) => (
          <div key={disk.mount} className="clay-inset rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{disk.mount}</p>
                <p className="text-xs text-muted-foreground">
                  {disk.used}GB / {disk.total}GB used
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold">{disk.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  IOPS: {disk.iops.read}/{disk.iops.write}
                </p>
              </div>
            </div>
            <div className="clay-inset mt-3 h-2 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${disk.percentage}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span>Read: {disk.throughput.read}MB/s</span>
              <span>Write: {disk.throughput.write}MB/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
