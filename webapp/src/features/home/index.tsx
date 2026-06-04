import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ShieldCheck,
  ScanSearch,
  Sparkles,
  ArrowRight,
  Quote,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Clock,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/shared/components/Animated";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScamSniff — Spot job scams in seconds" },
      {
        name: "description",
        content:
          "Paste any job offer. Get an instant scam score, red-flag breakdown, and safety tips. Free, friendly, and built to protect job seekers.",
      },
      { property: "og:title", content: "ScamSniff — Spot job scams in seconds" },
      { property: "og:description", content: "Instant scam detection for job offers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title > *", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
      });
      gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.8, delay: 0.4, ease: "power3.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.7, delay: 0.6, ease: "power3.out" });
      gsap.from(".float-card", {
        scale: 0.85,
        opacity: 0,
        rotate: -6,
        duration: 1,
        delay: 0.5,
        ease: "elastic.out(1, 0.7)",
      });

      gsap.to(".floaty", {
        y: -14,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3, from: "random" },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative mx-auto mt-12 grid w-[min(1180px,94%)] gap-12 pb-24 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
      >
        <div>
          <span className="clay-pill inline-flex items-center gap-2 text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--clay-purple)]" />
            New · GPT-powered fraud signals
          </span>
          <h1 className="hero-title mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">Spot job</span>
            <span className="block text-gradient">scams in seconds.</span>
            <span className="block">Keep your hustle safe.</span>
          </h1>
          <p className="hero-sub mt-6 max-w-xl text-lg text-muted-foreground">
            Paste any suspicious offer, upload a PDF, or drop a link. ScamSniff scores the message,
            highlights the red flags, and tells you exactly why — before you reply.
          </p>

          <div className="hero-cta mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/analyze"
              className="clay-primary inline-flex items-center gap-2 px-7 py-4 text-base font-semibold"
            >
              <ScanSearch className="h-5 w-5" /> Check a Job Offer
            </Link>
            <Link
              to="/awareness"
              className="clay-btn inline-flex items-center gap-2 px-6 py-4 text-base font-semibold"
            >
              See common red flags <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" /> 18,400+ offers
              scanned
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" /> 6,100+ scams blocked
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" /> Free for everyone
            </span>
          </div>
        </div>

        {/* Floating result card mockup */}
        <div ref={cardRef} className="relative h-[520px]">
          <div className="floaty absolute right-4 top-0 clay-lg w-[320px] p-6">
            <div className="flex items-center justify-between">
              <span className="clay-pill bg-[color:var(--destructive)] text-destructive-foreground">
                SCAM · 92%
              </span>
              <AlertTriangle className="h-5 w-5 text-[color:var(--destructive)]" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">Remote Data Entry</h3>
            <p className="text-xs text-muted-foreground">GlobalHire Solutions · today</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full clay-inset">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[color:var(--clay-orange)] to-[color:var(--destructive)]" />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <DollarSign className="mt-0.5 h-4 w-4 text-[color:var(--destructive)]" /> Asks for
                $50 fee
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-[color:var(--warning)]" /> "Reply in 2 hours"
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-[color:var(--warning)]" /> Gmail sender domain
              </li>
            </ul>
          </div>

          <div className="floaty absolute left-0 top-40 clay w-[280px] p-5">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: "var(--clay-green)" }}
              >
                <ShieldCheck className="h-6 w-6 text-[color:var(--success-foreground)]" />
              </div>
              <div>
                <p className="font-display text-lg font-bold">Likely Safe</p>
                <p className="text-xs text-muted-foreground">8% risk · Linear</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Verified corporate domain + structured interview process detected.
            </p>
          </div>

          <div className="floaty absolute bottom-4 right-12 clay-sm flex items-center gap-3 px-5 py-4">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl"
              style={{ background: "var(--clay-yellow)" }}
            >
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Tip of the day</p>
              <p className="text-sm font-semibold">Hover before you click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto w-[min(1180px,94%)] py-20">
        <FadeIn>
          <p className="clay-pill inline-block">How it works</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Three claps, one verdict.
          </h2>
        </FadeIn>
        <StaggerChildren className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Paste or upload",
              d: "Drop the offer text, attach the PDF, or share the URL. We never store the raw content.",
              c: "var(--clay-pink)",
            },
            {
              n: "02",
              t: "We sniff",
              d: "GPT-powered models scan tone, sender, salary, urgency, domain age, and 30+ other signals.",
              c: "var(--clay-blue)",
            },
            {
              n: "03",
              t: "You decide",
              d: "Get a scam score, line-by-line red flags, and a plain-English verdict in under 4 seconds.",
              c: "var(--clay-green)",
            },
          ].map((s) => (
            <div key={s.n} className="clay p-8">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-bold"
                style={{ background: s.c }}
              >
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </StaggerChildren>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto w-[min(1180px,94%)] py-20">
        <FadeIn>
          <p className="clay-pill inline-block">Why ScamSniff</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Built like a friend, <br />
            not a security product.
          </h2>
        </FadeIn>
        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: ScanSearch,
              t: "Multi-input scanning",
              d: "Text, PDF, or URL — all the formats scammers actually use.",
              c: "var(--clay-purple)",
            },
            {
              icon: AlertTriangle,
              t: "Explainable verdicts",
              d: "Every flag comes with a reason. No black-box magic.",
              c: "var(--clay-orange)",
            },
            {
              icon: ShieldCheck,
              t: "Privacy-first",
              d: "Offers are scored locally where possible. Nothing sold, ever.",
              c: "var(--clay-green)",
            },
            {
              icon: Mail,
              t: "Domain forensics",
              d: "We inspect SPF, DKIM, registrar age, and lookalike domains.",
              c: "var(--clay-blue)",
            },
            {
              icon: Clock,
              t: "Real-time history",
              d: "Every scan saved to your private dashboard for easy reference.",
              c: "var(--clay-yellow)",
            },
            {
              icon: Sparkles,
              t: "Awareness library",
              d: "Bite-sized lessons on the latest fraud patterns, updated weekly.",
              c: "var(--clay-pink)",
            },
          ].map(({ icon: Icon, t, d, c }) => (
            <div key={t} className="clay p-6">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: c }}
              >
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </StaggerChildren>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative mx-auto w-[min(1180px,94%)] py-20">
        <FadeIn>
          <div className="clay-lg relative overflow-hidden p-10 md:p-14">
            <Quote className="absolute -right-4 -top-4 h-40 w-40 text-[color:var(--clay-purple)] opacity-40" />
            <p className="relative font-display text-2xl font-medium leading-snug sm:text-3xl md:text-4xl">
              "I got a 'Google recruiter' offer too good to be true. ScamSniff caught the spoofed
              domain and saved me from a $400 'equipment fee.' Now I scan everything."
            </p>
            <div className="relative mt-8 flex items-center gap-4">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold"
                style={{ background: "var(--clay-orange)" }}
              >
                AK
              </div>
              <div>
                <p className="font-bold">Aisha Khan</p>
                <p className="text-sm text-muted-foreground">UX designer · Lahore</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="relative mx-auto w-[min(1180px,94%)] pb-24">
        <FadeIn>
          <div className="clay-lg flex flex-col items-center gap-6 p-12 text-center md:p-16">
            <span className="clay-pill">Free · No card needed</span>
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Don't reply to that offer yet.
              <br />
              <span className="text-gradient">Sniff it first.</span>
            </h2>
            <p className="max-w-xl text-muted-foreground">
              You get 20 free scans every month. Takes 4 seconds. Could save you four figures.
            </p>
            <Link
              to="/signup"
              className="clay-primary inline-flex items-center gap-2 px-8 py-4 text-base font-semibold"
            >
              Start sniffing free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
