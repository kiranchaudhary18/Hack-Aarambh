import { GitBranch } from "lucide-react";
import { modelVersions } from "../data/healthData";

export function ModelVersion() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Model Versions</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <GitBranch className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {modelVersions.map((version) => (
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
