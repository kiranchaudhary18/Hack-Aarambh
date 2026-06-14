import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ScanSearch,
  ShieldCheck,
  Sparkles,
  FileText,
  Search,
  CheckCircle,
  Target,
  Brain,
  TrendingUp,
} from "lucide-react";

const workflowSteps = [
  { label: "Reading input data...", icon: FileText, color: "var(--clay-blue)" },
  { label: "Preprocessing & cleaning...", icon: Target, color: "var(--clay-yellow)" },
  { label: "Scanning for keywords...", icon: Search, color: "var(--clay-purple)" },
  { label: "Running AI model detection...", icon: Brain, color: "var(--clay-pink)" },
  { label: "Analyzing patterns & signals...", icon: TrendingUp, color: "var(--clay-green)" },
  { label: "Generating results...", icon: CheckCircle, color: "var(--clay-purple)" },
];

export function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".lp-ring", {
        rotate: 360,
        duration: 2.4,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      gsap.to(".lp-pulse", {
        scale: 1.08,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
    }, 1200);
    return () => clearInterval(stepInterval);
  }, []);

  const CurrentIcon = workflowSteps[currentStep].icon;

  return (
    <div ref={ref} className="grid place-items-center py-16">
      <div className="relative">
        <div className="lp-ring absolute inset-0 grid place-items-center">
          <div className="h-40 w-40 rounded-full border-4 border-dashed border-[color:var(--clay-purple)]" />
        </div>
        <div className="lp-pulse grid h-40 w-40 place-items-center rounded-full clay-primary">
          <CurrentIcon className="h-12 w-12" strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-8 w-full max-w-lg">
        <p className="font-display text-2xl font-bold text-center">Analyzing job offer…</p>

        <div className="mt-6 space-y-4">
          {workflowSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  isActive ? "clay-primary" : isCompleted ? "clay opacity-70" : "clay opacity-30"
                }`}
              >
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl ${isCompleted ? "opacity-50" : ""}`}
                  style={{ background: step.color }}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${isActive ? "" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <div className="mt-2 flex gap-1">
                      <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                        <div
                          className="h-full bg-white animate-[width_1.2s_ease-in-out_infinite]"
                          style={{ width: "0%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs font-bold">
                  {isActive ? "IN PROGRESS" : isCompleted ? "DONE" : "WAITING"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        {[ShieldCheck, Sparkles, ScanSearch].map((I, i) => (
          <span key={i} className="lp-dot clay-sm grid h-9 w-9 place-items-center">
            <I className="h-4 w-4" />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes width {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
