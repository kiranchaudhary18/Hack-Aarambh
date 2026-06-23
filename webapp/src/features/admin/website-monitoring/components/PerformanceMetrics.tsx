import { Gauge, Zap, Timer, Clock } from "lucide-react";
import { performanceMetrics } from "../data/performanceData";

export function PerformanceMetrics() {
  const stats = [
    {
      icon: Clock,
      label: "Page Load (p50)",
      value: `${performanceMetrics.p50.toFixed(1)}s`,
      sub: performanceMetrics.change,
      color: "var(--clay-blue)",
    },
    {
      icon: Timer,
      label: "Page Load (p95)",
      value: `${performanceMetrics.p95.toFixed(1)}s`,
      sub: "95th percentile",
      color: "var(--clay-purple)",
    },
    {
      icon: Gauge,
      label: "Page Load (p99)",
      value: `${performanceMetrics.p99.toFixed(1)}s`,
      sub: "99th percentile",
      color: "var(--clay-orange)",
    },
    {
      icon: Zap,
      label: "Time to Interactive",
      value: `${performanceMetrics.tti.toFixed(1)}s`,
      sub: performanceMetrics.change,
      color: "var(--clay-green)",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
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
          </div>
        );
      })}
    </div>
  );
}
