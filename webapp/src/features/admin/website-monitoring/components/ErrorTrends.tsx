import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, XCircle, WifiOff } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function ErrorTrends() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load error trends");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading error trends..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const errorTrendData = websiteData?.errorTrends || [
    { date: "2024-01-01", jsErrors: 45, apiFailures: 28, networkErrors: 12 },
    { date: "2024-01-08", jsErrors: 38, apiFailures: 22, networkErrors: 8 },
    { date: "2024-01-15", jsErrors: 32, apiFailures: 18, networkErrors: 6 },
    { date: "2024-01-22", jsErrors: 28, apiFailures: 15, networkErrors: 5 },
    { date: "2024-01-29", jsErrors: 25, apiFailures: 12, networkErrors: 4 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-red)" }}>
          <TrendingUp className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Error Trends</h2>
          <p className="text-sm text-muted-foreground">Last 30 days by error type</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={errorTrendData}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="jsErrors"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 3 }}
              name="JS Errors"
            />
            <Line
              type="monotone"
              dataKey="apiFailures"
              stroke="oklch(0.72 0.16 155)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.72 0.16 155)", r: 3 }}
              name="API Failures"
            />
            <Line
              type="monotone"
              dataKey="networkErrors"
              stroke="oklch(0.66 0.22 22)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.66 0.22 22)", r: 3 }}
              name="Network Errors"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
