import { useEffect, useState } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Wifi, Radio, Send, Play, Pause } from "lucide-react";

interface LogEvent {
  id: string;
  time: string;
  type: "INFO" | "WARN" | "SCAN" | "ALERT";
  message: string;
}

export function RealTimeMonitoring() {
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.title = "Real-Time Monitoring — ScamSniff";
    if (paused) return;

    const mockMessages = [
      { type: "INFO", msg: "WebSocket handshake initiated by extension client" },
      { type: "SCAN", msg: "Text classification started for Scan ID: 0x9f1a" },
      { type: "INFO", msg: "OCR cache hit for image scan md5: a9f81d" },
      { type: "WARN", msg: "Rate limit warming up for user kiran@scamsniff.com" },
      { type: "SCAN", msg: "Document text extraction complete (Tesseract OCR)" },
      { type: "ALERT", msg: "Urgent scam score (98%) detected on Job board 'FlexTech'" },
      { type: "INFO", msg: "Clean report generated for PDF 'Resume_Kiran.pdf'" },
    ];

    const interval = setInterval(() => {
      const randomMsg = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const newEvent: LogEvent = {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString(),
        type: randomMsg.type as any,
        message: randomMsg.msg,
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    }, 1500);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin / Monitoring</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Real-Time Event Feed</h1>
        <p className="mt-2 text-muted-foreground">
          Live stream of API transactions, detection patterns triggered, and socket connections.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="clay p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${paused ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
              <span className="font-semibold">{paused ? "Stream Paused" : "Listening to Port 5000..."}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPaused(!paused)}
                className="clay-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              >
                {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                {paused ? "Resume" : "Pause"}
              </button>
              <button 
                onClick={() => setEvents([])}
                className="clay-btn px-3 py-1.5 text-xs font-semibold"
              >
                Clear logs
              </button>
            </div>
          </div>

          <div className="mt-6 max-h-[400px] overflow-y-auto font-mono text-xs space-y-2 bg-black/10 dark:bg-black/40 p-4 rounded-2xl clay-inset">
            {events.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                <Wifi className="h-5 w-5 animate-pulse" />
                Waiting for incoming WebSocket events...
              </div>
            ) : (
              events.map(ev => (
                <div key={ev.id} className="flex gap-4 hover:bg-black/5 dark:hover:bg-white/5 py-1 px-2 rounded">
                  <span className="text-muted-foreground shrink-0">{ev.time}</span>
                  <span className={`shrink-0 font-bold ${
                    ev.type === "ALERT" ? "text-rose-500" :
                    ev.type === "WARN" ? "text-amber-500" :
                    ev.type === "SCAN" ? "text-cyan-500" : "text-sky-500"
                  }`}>[{ev.type}]</span>
                  <span className="truncate">{ev.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
