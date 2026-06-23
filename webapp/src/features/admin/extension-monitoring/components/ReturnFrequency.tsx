import { RefreshCw } from "lucide-react";
import { returnFrequency } from "../data/retentionData";

export function ReturnFrequency() {
  const stats = [
    { label: "Once", value: `${returnFrequency.once}%` },
    { label: "Daily", value: `${returnFrequency.daily}%` },
    { label: "Weekly", value: `${returnFrequency.weekly}%` },
    { label: "Monthly", value: `${returnFrequency.monthly}%` },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Return Frequency</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <RefreshCw className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="clay-inset rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
