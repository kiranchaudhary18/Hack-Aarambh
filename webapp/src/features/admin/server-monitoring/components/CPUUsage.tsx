import { Cpu } from "lucide-react";
import { cpuUsage } from "../data/systemResourcesData";

export function CPUUsage() {
  const stats = [
    { label: "Current", value: `${cpuUsage.current}%` },
    { label: "Average", value: `${cpuUsage.average}%` },
    { label: "Steal Time", value: `${cpuUsage.stealTime}%` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          CPU Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Cpu className="h-5 w-5 text-blue-500" />
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
        <p className="text-xs text-muted-foreground">Load Average: {cpuUsage.loadAverage.join(", ")}</p>
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          cpuUsage.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {cpuUsage.change} from last hour
      </p>
    </div>
  );
}
