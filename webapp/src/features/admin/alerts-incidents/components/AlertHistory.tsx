import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, User } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function AlertHistory() {
  const [alertData, setAlertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/alerts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAlertData(data);
        } else {
          setAlertData(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading alert history..." />;

  const alertStats = alertData?.stats || { total: 0, active: 0, resolved: 0, critical: 0 };
  const alertHistory = alertData?.history || [];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Alert History</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Total Alerts</p>
          <p className="mt-2 font-display text-2xl font-bold">{alertStats.total}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-2 font-display text-2xl font-bold text-yellow-500">{alertStats.active}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="mt-2 font-display text-2xl font-bold text-green-500">{alertStats.resolved}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Critical</p>
          <p className="mt-2 font-display text-2xl font-bold text-red-500">{alertStats.critical}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {alertHistory.map((alert: any) => (
          <div key={alert.id} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex items-center gap-4">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  alert.severity === "critical"
                    ? "bg-red-500/20 text-red-500"
                    : alert.severity === "high"
                    ? "bg-orange-500/20 text-orange-500"
                    : alert.severity === "medium"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-blue-500/20 text-blue-500"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{alert.type}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Severity</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    alert.severity === "critical"
                      ? "bg-red-500/20 text-red-500"
                      : alert.severity === "high"
                      ? "bg-orange-500/20 text-orange-500"
                      : alert.severity === "medium"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-blue-500/20 text-blue-500"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="flex items-center gap-1">
                  {alert.resolved ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-xs">{alert.resolved ? "Resolved" : "Active"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-xs">{alert.assignedTo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-xs">{alert.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
