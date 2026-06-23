import { MemoryStick } from "lucide-react";
import { memoryUsage } from "../data/resourceData";

export function MemoryUsage() {
  const stats = [
    { label: "Current", value: `${memoryUsage.current}GB` },
    { label: "Average", value: `${memoryUsage.average}GB` },
    { label: "Peak", value: `${memoryUsage.peak}GB` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <MemoryStick className="h-5 w-5 text-blue-500" />
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
      <p className="mt-3 text-xs text-muted-foreground">
        {memoryUsage.perRequest}GB per request
      </p>
      <p
        className={`mt-1 text-xs font-medium ${
          memoryUsage.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {memoryUsage.change} from last week
      </p>
    </div>
  );
}
