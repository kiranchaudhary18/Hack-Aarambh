import { useEffect, useState } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Puzzle, Users, Zap, Star } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function ExtensionMonitoring() {
  const [installs, setInstalls] = useState(1480);

  useEffect(() => {
    document.title = "Extension Monitoring — ScamSniff";
    const interval = setInterval(() => {
      setInstalls(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const extensionData = [
    { day: "Mon", scans: 432, users: 1200 },
    { day: "Tue", scans: 512, users: 1250 },
    { day: "Wed", scans: 489, users: 1290 },
    { day: "Thu", scans: 610, users: 1350 },
    { day: "Fri", scans: 742, users: 1410 },
    { day: "Sat", scans: 890, users: 1480 },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin / Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Extension Monitoring</h1>
        <p className="mt-2 text-muted-foreground">
          Analyze Chrome/Edge extension installations, active background page message counts, and client reviews.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0.05}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Installs</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20"><Users className="h-5 w-5 text-green-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{installs.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">Weekly increase: +18%</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extension Scans</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20"><Puzzle className="h-5 w-5 text-blue-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">14,230</p>
            <p className="mt-1 text-xs text-muted-foreground">Captured from background scripts</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active WebSockets</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20"><Zap className="h-5 w-5 text-orange-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">412</p>
            <p className="mt-1 text-xs text-muted-foreground">Live notifications enabled</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store Rating</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-pink-500/20"><Star className="h-5 w-5 text-pink-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">4.8 / 5</p>
            <p className="mt-1 text-xs text-muted-foreground">Based on 98 reviews</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Extension Activity Trend</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <AreaChart data={extensionData}>
                <defs>
                  <linearGradient id="scansV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--clay-green)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--clay-green)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "none", borderRadius: 16, boxShadow: "var(--shadow-clay-sm)" }} />
                <Area type="monotone" dataKey="scans" name="Daily Scans" stroke="var(--clay-green)" fillOpacity={1} fill="url(#scansV)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
