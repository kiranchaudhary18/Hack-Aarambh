import { useEffect, useRef, ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";

export function FadeIn({
  children,
  delay = 0,
  y = 18,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, delay, ease: "expo.out" },
    );
  }, [delay, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerChildren({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const kids = ref.current.children;
    gsap.fromTo(
      kids,
      { autoAlpha: 0, y: 26, scale: 0.98, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.72,
        stagger,
        ease: "expo.out",
      },
    );
  }, [stagger]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function FrontendMotion() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const root = document.querySelector<HTMLElement>("[data-gsap-page]");
    if (!root) return;

    const ctx = gsap.context(() => {
      const headlineTargets = gsap.utils.toArray<HTMLElement>(
        "h1, h2, [data-motion='headline']",
        root,
      );
      const contentTargets = gsap.utils.toArray<HTMLElement>(
        [
          "p",
          ".clay",
          ".clay-sm",
          ".clay-lg",
          ".clay-inset",
          ".clay-pill",
          "form",
          "table",
          "[data-motion='item']",
          "[data-motion='card']",
        ].join(","),
        root,
      );
      const actionTargets = gsap.utils.toArray<HTMLElement>(
        "button:not([disabled]), a[href], [role='button']",
        root,
      );

      gsap.fromTo(
        headlineTargets,
        { autoAlpha: 0, y: 34, rotateX: -8, transformOrigin: "50% 80%", filter: "blur(12px)" },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.06,
          ease: "expo.out",
          overwrite: "auto",
        },
      );

      gsap.fromTo(
        contentTargets,
        { autoAlpha: 0, y: 24, scale: 0.985, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: { each: 0.035, from: "start" },
          delay: 0.08,
          ease: "expo.out",
          overwrite: "auto",
        },
      );

      gsap.fromTo(
        actionTargets,
        { autoAlpha: 0, y: 12, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.58,
          stagger: 0.025,
          delay: 0.18,
          ease: "back.out(1.7)",
          overwrite: "auto",
        },
      );

      gsap.to(".blob, [data-float='true']", {
        y: "random(-16, 16)",
        x: "random(-12, 12)",
        rotate: "random(-4, 4)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.18,
      });
    }, root);

    return () => ctx.revert();
  }, [pathname]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const selector =
      ".clay, .clay-sm, .clay-lg, .clay-btn, .clay-primary, button:not([disabled]), a[href], [role='button']";

    const enter = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      gsap.to(target, {
        y: target.classList.contains("clay") || target.classList.contains("clay-lg") ? -5 : -3,
        scale: target.matches("button, a[href], [role='button'], .clay-btn, .clay-primary")
          ? 1.025
          : 1.012,
        duration: 0.28,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const leave = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      gsap.to(target, {
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.45,
        ease: "elastic.out(1, 0.45)",
        overwrite: "auto",
      });
    };

    const bind = () => {
      const nodes = document.querySelectorAll<HTMLElement>(selector);
      nodes.forEach((node) => {
        if (node.dataset.gsapHoverBound === "true") return;
        node.dataset.gsapHoverBound = "true";
        node.addEventListener("mouseenter", enter);
        node.addEventListener("mouseleave", leave);
      });
    };

    bind();
    const observer = new MutationObserver(bind);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll<HTMLElement>("[data-gsap-hover-bound='true']").forEach((node) => {
        node.removeEventListener("mouseenter", enter);
        node.removeEventListener("mouseleave", leave);
        delete node.dataset.gsapHoverBound;
      });
    };
  }, []);

  return null;
}
