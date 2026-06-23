import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet, PieChart } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

const deviceColors = ["oklch(0.62 0.18 295)", "oklch(0.72 0.16 155)", "oklch(0.75 0.12 85)"];
const browserColors = ["oklch(0.62 0.18 295)", "oklch(0.72 0.16 155)", "oklch(0.75 0.12 85)", "oklch(0.66 0.22 22)"];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Smartphone,
  Tablet,
};

export function DeviceBreakdown() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load device data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading device breakdown..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const deviceData = websiteData?.devices || [
    { type: "Desktop", count: 45200 },
    { type: "Mobile", count: 28450 },
    { type: "Tablet", count: 8200 },
  ];

  const browserData = websiteData?.browsers || [
    { name: "Chrome", count: 45200 },
    { name: "Firefox", count: 18450 },
    { name: "Safari", count: 12200 },
    { name: "Edge", count: 6000 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="clay p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-purple)" }}>
            <Monitor className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Devices</h2>
            <p className="text-sm text-muted-foreground">By device type</p>
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <RechartsPieChart>
              <Pie
                data={deviceData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={4}
              >
                {deviceData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={deviceColors[index]} stroke="var(--card)" strokeWidth={4} />
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

      <div className="clay p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-blue)" }}>
            <PieChart className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Browsers</h2>
            <p className="text-sm text-muted-foreground">By browser</p>
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer>
            <RechartsPieChart>
              <Pie
                data={browserData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={4}
              >
                {browserData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={browserColors[index]} stroke="var(--card)" strokeWidth={4} />
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
    </div>
  );
}
