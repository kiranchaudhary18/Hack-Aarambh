import { useState, useEffect } from "react";
import { WifiOff, AlertCircle } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function NetworkErrors() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load network error data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading network errors..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const networkErrorData = websiteData?.networkErrors || [
    { type: "Timeout", count: 45, color: "oklch(0.62 0.18 295)" },
    { type: "Connection Refused", count: 28, color: "oklch(0.72 0.16 155)" },
    { type: "DNS Error", count: 12, color: "oklch(0.66 0.22 22)" },
    { type: "CORS Error", count: 8, color: "oklch(0.75 0.12 85)" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-pink)" }}>
          <WifiOff className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Network Errors</h2>
          <p className="text-sm text-muted-foreground">By error type</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={networkErrorData}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {networkErrorData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--card)" strokeWidth={4} />
              ))}
            </Pie>
            <Legend />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "none",
                borderRadius: 16,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
