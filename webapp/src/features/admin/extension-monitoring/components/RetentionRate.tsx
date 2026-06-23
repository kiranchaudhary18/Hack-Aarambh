import { TrendingUp } from "lucide-react";
import { retentionRate } from "../data/retentionData";

export function RetentionRate() {
  const stats = [
    { label: "D1 Retention", value: `${retentionRate.d1}%` },
    { label: "D7 Retention", value: `${retentionRate.d7}%` },
    { label: "D30 Retention", value: `${retentionRate.d30}%` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Retention Rate
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <TrendingUp className="h-5 w-5 text-green-500" />
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
    </div>
  );
}
