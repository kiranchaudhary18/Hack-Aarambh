import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { api } from "@/lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ScamSniff Admin" },
      { name: "description", content: "Trends and fraud patterns over time." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [scamTypes, setScamTypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await api.getHistory();

        // Calculate trend data from actual history
        const monthlyData = historyData.reduce((acc: any, item: any) => {
          const date = new Date(item.createdAt);
          const monthKey = date.toLocaleString("default", { month: "short" });
          if (!acc[monthKey]) {
            acc[monthKey] = { safe: 0, scams: 0 };
          }
          if (item.result?.isFake) {
            acc[monthKey].scams++;
          } else {
            acc[monthKey].safe++;
          }
          return acc;
        }, {});

        const trend = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
          month,
          safe: data.safe,
          scams: data.scams,
        }));
        setTrendData(trend);

        // Calculate scam types from reasons
        const reasonCounts: any = {};
        historyData.forEach((item: any) => {
          if (item.result?.isFake && item.result?.reasons) {
            item.result.reasons.forEach((reason: string) => {
              reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
            });
          }
        });

        const colors = [
          "oklch(0.62 0.18 295)",
          "oklch(0.72 0.16 155)",
          "oklch(0.66 0.22 22)",
          "oklch(0.75 0.15 45)",
          "oklch(0.68 0.20 280)",
        ];

        const scamTypesData = Object.entries(reasonCounts)
          .map(([name, value]: [string, any]) => ({
            name,
            value,
            color: colors[Object.keys(reasonCounts).indexOf(name) % colors.length],
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setScamTypes(scamTypesData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const conversion = trendData.map((d) => ({
    month: d.month,
    rate: d.scams + d.safe > 0 ? Math.round((d.scams / (d.scams + d.safe)) * 100) : 0,
  }));

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[oklch(0.62_0.18_295)] mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <AdminSidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <p className="clay-pill inline-block">Analytics</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Fraud at a glance</h1>
            <p className="mt-2 text-muted-foreground">
              How scams are trending and which patterns dominate.
            </p>
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeIn delay={0.05}>
              <div className="clay p-6">
                <h2 className="font-display text-2xl font-bold">Scam vs safe scans</h2>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer>
                    <BarChart data={trendData} barGap={6}>
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
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
                      <Bar dataKey="safe" fill="oklch(0.72 0.16 155)" radius={[12, 12, 0, 0]} />
                      <Bar dataKey="scams" fill="oklch(0.62 0.18 295)" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="clay p-6">
                <h2 className="font-display text-2xl font-bold">Most common fraud types</h2>
                <p className="text-sm text-muted-foreground">Share of confirmed scams</p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={scamTypes}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={56}
                        paddingAngle={4}
                      >
                        {scamTypes.map((s, i) => (
                          <Cell key={i} fill={s.color} stroke="var(--card)" strokeWidth={4} />
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="clay p-6 lg:col-span-2">
                <h2 className="font-display text-2xl font-bold">Scam rate trend</h2>
                <p className="text-sm text-muted-foreground">
                  % of scans flagged as scam, per month
                </p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer>
                    <LineChart data={conversion}>
                      <CartesianGrid
                        stroke="var(--border)"
                        strokeDasharray="3 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
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
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="oklch(0.66 0.22 22)"
                        strokeWidth={4}
                        dot={{ fill: "oklch(0.66 0.22 22)", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
}
