import { useState, useEffect } from "react";
import { TrendingDown } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function BounceRate() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load bounce rate data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading bounce rate..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const bounceRateData = websiteData?.bounceRate || [
    { date: "2024-01-01", rate: 38.5 },
    { date: "2024-01-08", rate: 37.2 },
    { date: "2024-01-15", rate: 36.8 },
    { date: "2024-01-22", rate: 35.9 },
    { date: "2024-01-29", rate: 35.8 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-pink)" }}>
          <TrendingDown className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Bounce Rate</h2>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <LineChart data={bounceRateData}>
            <defs>
              <linearGradient id="bounceGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.62 0.18 295)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} domain={[30, 40]} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="oklch(0.62 0.18 295)"
              strokeWidth={3}
              dot={{ fill: "oklch(0.62 0.18 295)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
