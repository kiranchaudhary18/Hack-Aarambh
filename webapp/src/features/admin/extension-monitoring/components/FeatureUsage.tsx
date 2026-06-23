import { Zap } from "lucide-react";
import { featureUsage } from "../data/usageData";

export function FeatureUsage() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Feature Usage</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <Zap className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {featureUsage.map((feature) => (
          <div key={feature.feature} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{feature.feature}</p>
              <p className="text-xs text-muted-foreground">{feature.usage.toLocaleString()} uses</p>
            </div>
            <p
              className={`text-sm font-medium ${
                feature.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {feature.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
