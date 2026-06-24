import { useState, useEffect } from "react";
import { Server, Zap } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function APIResponseTimes() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteTraffic();
        setWebsiteData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading API response times..." />;

  const apiResponseTimeData = websiteData?.apiResponseTimes || [
    { endpoint: "/api/scan", p50: 0, p95: 0, p99: 0 },
    { endpoint: "/api/analyze", p50: 0, p95: 0, p99: 0 },
    { endpoint: "/api/report", p50: 0, p95: 0, p99: 0 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-purple)" }}>
          <Server className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">API Response Times</h2>
          <p className="text-sm text-muted-foreground">By endpoint (milliseconds)</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={apiResponseTimeData} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="endpoint"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
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
            <Bar dataKey="p50" fill="oklch(0.72 0.16 155)" radius={[8, 8, 0, 0]} name="p50" />
            <Bar dataKey="p95" fill="oklch(0.62 0.18 295)" radius={[8, 8, 0, 0]} name="p95" />
            <Bar dataKey="p99" fill="oklch(0.66 0.22 22)" radius={[8, 8, 0, 0]} name="p99" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
