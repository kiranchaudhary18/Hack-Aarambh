import { useEffect, useState } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Activity, Globe, Eye, Zap, AlertCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function WebsiteMonitoring() {
  const [latency, setLatency] = useState(142);
  const [activeUsers, setActiveUsers] = useState(384);

  useEffect(() => {
    document.title = "Website Monitoring — ScamSniff";
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setLatency(prev => Math.max(100, Math.min(250, prev + Math.floor(Math.random() * 30) - 15)));
      setActiveUsers(prev => Math.max(300, Math.min(500, prev + Math.floor(Math.random() * 10) - 5)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const trafficData = [
    { time: "00:00", pageViews: 1200, loadTime: 180 },
    { time: "04:00", pageViews: 800, loadTime: 160 },
    { time: "08:00", pageViews: 2300, loadTime: 195 },
    { time: "12:00", pageViews: 4500, loadTime: 210 },
    { time: "16:00", pageViews: 3800, loadTime: 190 },
    { time: "20:00", pageViews: 2900, loadTime: 175 },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin / Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Website Monitoring</h1>
        <p className="mt-2 text-muted-foreground">
          Track web application traffic, loading speeds, and JS console health.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0.05}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Sessions</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20"><Globe className="h-5 w-5 text-blue-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{activeUsers}</p>
            <p className="mt-1 text-xs text-muted-foreground">Real-time active users</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Page Load</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20"><Zap className="h-5 w-5 text-green-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{latency}ms</p>
            <p className="mt-1 text-xs text-muted-foreground">Core Web Vital: Good</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Page Views Today</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20"><Eye className="h-5 w-5 text-purple-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">18,524</p>
            <p className="mt-1 text-xs text-muted-foreground">+14% vs yesterday</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">JS Error Rate</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-pink-500/20"><AlertCircle className="h-5 w-5 text-pink-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">0.04%</p>
            <p className="mt-1 text-xs text-muted-foreground">12 errors captured today</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Traffic & Performance Metrics</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="pViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--clay-blue)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--clay-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "none", borderRadius: 16, boxShadow: "var(--shadow-clay-sm)" }} />
                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="var(--clay-blue)" fillOpacity={1} fill="url(#pViews)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
