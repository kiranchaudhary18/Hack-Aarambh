import { AlertCircle, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { incidents, incidentStats } from "../data/incidentsData";

export function IncidentManagement() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Incident Management</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-5">
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Total Incidents</p>
          <p className="mt-2 font-display text-2xl font-bold">{incidentStats.total}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Open</p>
          <p className="mt-2 font-display text-2xl font-bold text-red-500">{incidentStats.open}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="mt-2 font-display text-2xl font-bold text-yellow-500">{incidentStats.inProgress}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="mt-2 font-display text-2xl font-bold text-green-500">{incidentStats.resolved}</p>
        </div>
        <div className="clay-inset p-4">
          <p className="text-xs text-muted-foreground">Avg Resolution</p>
          <p className="mt-2 font-display text-2xl font-bold">{incidentStats.avgResolutionTime}m</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {incidents.map((incident) => (
          <div key={incident.id} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex items-center gap-4">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  incident.severity === "critical"
                    ? "bg-red-500/20 text-red-500"
                    : incident.severity === "high"
                    ? "bg-orange-500/20 text-orange-500"
                    : incident.severity === "medium"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-blue-500/20 text-blue-500"
                }`}
              >
                <AlertCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{incident.title}</p>
                <p className="text-xs text-muted-foreground">{incident.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Severity</p>
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
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="flex items-center gap-1">
                  {incident.status === "resolved" || incident.status === "closed" ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : incident.status === "in_progress" ? (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-xs capitalize">{incident.status.replace("_", " ")}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Downtime</p>
                <p className="text-xs">{incident.downtime > 0 ? `${incident.downtime}m` : "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-xs">{incident.assignedTo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-xs">{incident.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
