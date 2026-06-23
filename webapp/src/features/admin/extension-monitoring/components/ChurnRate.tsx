import { TrendingDown } from "lucide-react";
import { churnRate } from "../data/retentionData";

export function ChurnRate() {
  const stats = [
    { label: "Daily", value: `${churnRate.daily}%` },
    { label: "Weekly", value: `${churnRate.weekly}%` },
    { label: "Monthly", value: `${churnRate.monthly}%` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Churn Rate
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/20">
          <TrendingDown className="h-5 w-5 text-red-500" />
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
          churnRate.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {churnRate.change} from last month
      </p>
    </div>
  );
}
