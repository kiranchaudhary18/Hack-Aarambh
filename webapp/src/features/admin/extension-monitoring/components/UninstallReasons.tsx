import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function UninstallReasons() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load uninstall reasons");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading uninstall reasons..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const uninstallReasons = extensionData?.uninstallReasons || [
    { reason: "Not needed anymore", count: 45 },
    { reason: "Performance issues", count: 28 },
    { reason: "Found alternative", count: 22 },
    { reason: "Too many permissions", count: 15 },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Uninstall Reasons</h2>
      <p className="text-sm text-muted-foreground">Why users are uninstalling</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={uninstallReasons} barGap={6}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="reason"
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
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
            <Bar dataKey="count" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
