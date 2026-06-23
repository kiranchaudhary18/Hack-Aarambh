import { Tag } from "lucide-react";
import { versionDistribution } from "../data/installationData";

export function VersionDistribution() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Version Distribution</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <Tag className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {versionDistribution.map((version) => (
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
