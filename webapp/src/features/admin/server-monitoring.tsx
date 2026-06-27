import { useEffect, useState } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Server, Database, Cpu, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function ServerMonitoring() {
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(62);

  useEffect(() => {
    document.title = "Server Monitoring — ScamSniff";
    const interval = setInterval(() => {
      setCpu(prev => Math.max(15, Math.min(85, prev + Math.floor(Math.random() * 10) - 5)));
      setRam(prev => Math.max(55, Math.min(75, prev + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const performanceData = [
    { time: "12:00", cpu: 18, ram: 59 },
    { time: "12:10", cpu: 22, ram: 60 },
    { time: "12:20", cpu: 29, ram: 61 },
    { time: "12:30", cpu: 35, ram: 62 },
    { time: "12:40", cpu: 24, ram: 62 },
    { time: "12:50", cpu: 27, ram: 63 },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin / Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Server Monitoring</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor NestJS container CPU, memory usage, API endpoint response times, and database connections.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0.05}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPU Usage</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/20"><Cpu className="h-5 w-5 text-orange-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{cpu}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Load average: stable</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">RAM Usage</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20"><Server className="h-5 w-5 text-purple-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{ram.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">1.24 GB / 2.0 GB used</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">DB Connection Pool</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20"><Database className="h-5 w-5 text-blue-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">14 / 20</p>
            <p className="mt-1 text-xs text-muted-foreground">Active Prisma client connections</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20"><Activity className="h-5 w-5 text-green-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">99.98%</p>
            <p className="mt-1 text-xs text-muted-foreground">Continuous up for 14 days</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Resource Allocation History</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="cpuV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--clay-orange)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--clay-orange)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "none", borderRadius: 16, boxShadow: "var(--shadow-clay-sm)" }} />
                <Area type="monotone" dataKey="cpu" name="CPU Usage %" stroke="var(--clay-orange)" fillOpacity={1} fill="url(#cpuV)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
