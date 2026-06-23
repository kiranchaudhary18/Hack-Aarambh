import { Zap } from "lucide-react";
import { extensionLoadTime } from "../data/performanceData";

export function ExtensionLoadTime() {
  const stats = [
    { label: "Average", value: `${extensionLoadTime.avg}ms` },
    { label: "p50", value: `${extensionLoadTime.p50}ms` },
    { label: "p95", value: `${extensionLoadTime.p95}ms` },
    { label: "p99", value: `${extensionLoadTime.p99}ms` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Extension Load Time
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <Zap className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          extensionLoadTime.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {extensionLoadTime.change} from last week
      </p>
    </div>
  );
}
