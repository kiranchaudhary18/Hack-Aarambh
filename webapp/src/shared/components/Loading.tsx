import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScanSearch, ShieldCheck, Sparkles } from "lucide-react";

export function LoadingScreen({
  label = "Analyzing job offer…",
  hint = "Scanning red flags, sender domain, urgency, and 30+ signals.",
}: {
  label?: string;
  hint?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      gsap.from(".lp-dot", {
        y: -6,
        duration: 0.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="grid place-items-center py-16">
      <div className="relative">
        <div className="lp-ring absolute inset-0 grid place-items-center">
          <div className="h-40 w-40 rounded-full border-4 border-dashed border-[color:var(--clay-purple)]" />
        </div>
        <div className="lp-pulse grid h-40 w-40 place-items-center rounded-full clay-primary">
          <ScanSearch className="h-12 w-12" strokeWidth={2.2} />
        </div>
      </div>
      <p className="mt-8 font-display text-2xl font-bold">{label}</p>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">{hint}</p>
      <div className="mt-6 flex items-center gap-2">
        {[ShieldCheck, Sparkles, ScanSearch].map((I, i) => (
          <span key={i} className="lp-dot clay-sm grid h-9 w-9 place-items-center">
            <I className="h-4 w-4" />
          </span>
        ))}
      </div>
    </div>
  );
}
