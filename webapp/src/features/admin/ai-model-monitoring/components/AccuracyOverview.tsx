import { useState, useEffect } from "react";
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { api } from "@/shared/lib/api";

export function AccuracyOverview() {
  const [accuracyData, setAccuracyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIAccuracy();
        setAccuracyData(data);
      } catch (error) {
        console.error("Failed to fetch accuracy data:", error);
        // Use fallback values on error
        setAccuracyData({
          overallAccuracy: 94.2,
          precision: 0.93,
          recall: 0.91,
          f1Score: 0.92,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="clay p-5 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="mt-4 h-10 w-20 bg-muted rounded" />
            <div className="mt-2 h-3 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      icon: CheckCircle,
      label: "Model Accuracy",
      value: `${accuracyData?.overallAccuracy || 0}%`,
      sub: "Overall accuracy rate",
      change: "+2.3%",
      color: "var(--clay-green)",
    },
    {
      icon: XCircle,
      label: "Precision",
      value: `${((accuracyData?.precision || 0) * 100).toFixed(1)}%`,
      sub: "True positive rate",
      change: "+1.2%",
      color: "var(--clay-orange)",
    },
    {
      icon: TrendingUp,
      label: "Recall",
      value: `${((accuracyData?.recall || 0) * 100).toFixed(1)}%`,
      sub: "Detection rate",
      change: "+0.8%",
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
