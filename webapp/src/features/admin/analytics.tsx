import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
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

export function AdminAnalytics() {
  const [scamTypes, setScamTypes] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Analytics — ScamSniff Admin";
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const analytics = await api.getAnalytics();
        setScamTypes(analytics?.scamTypes || []);
        setTrendData(analytics?.trendData || []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }
  const conversion = trendData.map((d) => ({
    month: d.month,
    rate: Math.round((d.scams / (d.scams + d.safe)) * 100),
  }));
  return (
    <div className="space-y-6">
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
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
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
            <p className="text-sm text-muted-foreground">% of scans flagged as scam, per month</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <LineChart data={conversion}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
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
    </div>
  );
}
