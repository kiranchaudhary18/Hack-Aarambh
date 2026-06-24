import { useState, useEffect } from "react";
import { Server, XCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function APIFailures() {
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

  if (loading) return <LoadingState message="Loading API failures..." />;

  const apiFailureData = websiteData?.apiFailures || [
    { endpoint: "/api/scan", requests: 0, failures: 0, failureRate: 0 },
    { endpoint: "/api/analyze", requests: 0, failures: 0, failureRate: 0 },
    { endpoint: "/api/report", requests: 0, failures: 0, failureRate: 0 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-orange)" }}>
          <Server className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">API Failure Rates</h2>
          <p className="text-sm text-muted-foreground">By endpoint</p>
        </div>
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={apiFailureData} barGap={6}>
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
              formatter={(value: any, name: string) => {
                if (name === "failureRate") return [`${value.toFixed(2)}%`, "Failure Rate"];
                if (name === "requests") return [value.toLocaleString(), "Requests"];
                if (name === "failures") return [value, "Failures"];
                return [value, name];
              }}
            />
            <Bar dataKey="requests" fill="oklch(0.72 0.16 155)" radius={[8, 8, 0, 0]} name="requests" />
            <Bar dataKey="failures" fill="oklch(0.62 0.18 295)" radius={[8, 8, 0, 0]} name="failures" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
