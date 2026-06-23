import { useState, useEffect } from "react";
import { Link, Share2, Globe } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function TrafficSources() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load traffic sources");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading traffic sources..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const trafficSourceData = websiteData?.trafficSources || [
    { source: "Organic Search", count: 45200, color: "oklch(0.72 0.16 155)" },
    { source: "Direct", count: 28450, color: "oklch(0.62 0.18 295)" },
    { source: "Referral", count: 15200, color: "oklch(0.66 0.22 22)" },
    { source: "Social", count: 8200, color: "oklch(0.75 0.12 85)" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-orange)" }}>
          <Globe className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Traffic Sources</h2>
          <p className="text-sm text-muted-foreground">Where users come from</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={trafficSourceData}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={56}
              paddingAngle={4}
            >
              {trafficSourceData.map((entry: any, index: number) => (
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
