import { Clock } from "lucide-react";
import { inferenceLatency } from "../data/performanceData";

export function InferenceLatency() {
  const stats = [
    { label: "p50", value: `${inferenceLatency.p50}ms` },
    { label: "p95", value: `${inferenceLatency.p95}ms` },
    { label: "p99", value: `${inferenceLatency.p99}ms` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Inference Latency
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Clock className="h-5 w-5 text-blue-500" />
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
      <p
        className={`mt-3 text-xs font-medium ${
          inferenceLatency.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {inferenceLatency.change} from last week
      </p>
    </div>
  );
}
