import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

export function FadeIn({ children, delay = 0, y = 18, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.8, delay, ease: "power3.out" }
    );
  }, [delay, y]);
  return <div ref={ref} className={className}>{children}</div>;
}

export function StaggerChildren({ children, className = "", stagger = 0.08 }: { children: ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const kids = ref.current.children;
    gsap.fromTo(
      kids,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger, ease: "power3.out" }
    );
  }, [stagger]);
  return <div ref={ref} className={className}>{children}</div>;
}
