import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function Incidents() {
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getServerUptime();
        setServerData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading incidents..." />;

  const incidents = serverData?.incidents || [];

  if (incidents.length === 0) {
    return (
      <div className="clay p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Incident History</h2>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">No incidents recorded</p>
      </div>
    );
  }

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Incident History</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {incidents.map((incident: any) => (
          <div key={incident.id} className="clay-inset rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{incident.type}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      incident.severity === "critical"
                        ? "bg-red-500/20 text-red-500"
                        : incident.severity === "high"
                        ? "bg-orange-500/20 text-orange-500"
                        : incident.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {incident.severity}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{incident.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {incident.startTime} • Duration: {incident.duration}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
