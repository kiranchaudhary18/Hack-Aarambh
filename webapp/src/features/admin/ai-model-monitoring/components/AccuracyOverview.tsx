import { CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { modelAccuracy, falsePositiveRate, falseNegativeRate } from "../data/accuracyData";

export function AccuracyOverview() {
  const stats = [
    {
      icon: CheckCircle,
      label: "Model Accuracy",
      value: `${modelAccuracy.accuracyRate}%`,
      sub: `${modelAccuracy.totalPredictions.toLocaleString()} predictions`,
      change: modelAccuracy.change,
      color: "var(--clay-green)",
    },
    {
      icon: XCircle,
      label: "False Positive Rate",
      value: `${falsePositiveRate.rate}%`,
      sub: `${falsePositiveRate.falsePositives.toLocaleString()} false positives`,
      change: falsePositiveRate.change,
      color: "var(--clay-orange)",
    },
    {
      icon: TrendingUp,
      label: "False Negative Rate",
      value: `${falseNegativeRate.rate}%`,
      sub: `${falseNegativeRate.falseNegatives.toLocaleString()} missed scams`,
      change: falseNegativeRate.change,
      color: "var(--clay-red)",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change.startsWith("+") || stat.change.startsWith("-");
        return (
          <div key={index} className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl"
                style={{ background: stat.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
            <p
              className={`mt-2 text-xs font-medium ${
                stat.change.startsWith("-") ? "text-green-500" : stat.change.startsWith("+") ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {stat.change} from last week
            </p>
          </div>
        );
      })}
    </div>
  );
}
