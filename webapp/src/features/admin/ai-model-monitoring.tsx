import { useEffect, useState } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Cpu, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function AIModelMonitoring() {
  const [accuracy, setAccuracy] = useState(94.2);

  useEffect(() => {
    document.title = "AI Model Monitoring — ScamSniff";
    const interval = setInterval(() => {
      setAccuracy(prev => Math.max(93.5, Math.min(95.5, prev + (Math.random() - 0.5) * 0.2)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const modelData = [
    { hour: "10:00", textScans: 145, pdfScans: 34, accuracy: 94.1 },
    { hour: "11:00", textScans: 190, pdfScans: 42, accuracy: 94.3 },
    { hour: "12:00", textScans: 230, pdfScans: 55, accuracy: 94.2 },
    { hour: "13:00", textScans: 280, pdfScans: 60, accuracy: 94.5 },
    { hour: "14:00", textScans: 210, pdfScans: 48, accuracy: 94.2 },
    { hour: "15:00", textScans: 245, pdfScans: 52, accuracy: 94.4 },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin / Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">AI Model Monitoring</h1>
        <p className="mt-2 text-muted-foreground">
          Track RoBERTa natural language inference, OCR text extraction confidence, and scam classifier rates.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0.05}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model Accuracy</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20"><ShieldCheck className="h-5 w-5 text-purple-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">{accuracy.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Target validation: &gt;92%</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inference Latency</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20"><Cpu className="h-5 w-5 text-blue-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">210ms</p>
            <p className="mt-1 text-xs text-muted-foreground">RoBERTa + OCR pipeline</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidence Score</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20"><Sparkles className="h-5 w-5 text-green-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">89.4%</p>
            <p className="mt-1 text-xs text-muted-foreground">Average classifier confidence</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="clay p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Low Confidence Flags</span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-pink-500/20"><AlertTriangle className="h-5 w-5 text-pink-500" /></span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold">8</p>
            <p className="mt-1 text-xs text-muted-foreground">Sent for manual review</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Model Request Volumes</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer>
              <AreaChart data={modelData}>
                <defs>
                  <linearGradient id="textV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--clay-purple)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--clay-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "none", borderRadius: 16, boxShadow: "var(--shadow-clay-sm)" }} />
                <Area type="monotone" dataKey="textScans" name="Text Analysis" stroke="var(--clay-purple)" fillOpacity={1} fill="url(#textV)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
