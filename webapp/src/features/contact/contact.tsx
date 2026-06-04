import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/shared/components/Animated";
import * as Icons from "lucide-react";
import { BookOpen, ShieldAlert, Sparkles } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Awareness — ScamSniff" },
      {
        name: "description",
        content: "Red flags, scam patterns, and safety tips for job seekers.",
      },
    ],
  }),
  component: Awareness,
});

const tips = [
  {
    title: "Upfront payment requests",
    desc: "Legitimate employers never ask for money for training, equipment, or background checks before you start.",
    icon: "DollarSign",
    color: "clay-pink",
  },
  {
    title: "Urgency pressure tactics",
    desc: "Scammers create false urgency: 'Reply in 2 hours' or 'Only 2 spots left' to prevent you from thinking.",
    icon: "Clock",
    color: "clay-orange",
  },
  {
    title: "Unofficial email domains",
    desc: "Real recruiters use company domains (e.g., @notion.com), not Gmail, Yahoo, or lookalike domains.",
    icon: "Mail",
    color: "clay-yellow",
  },
  {
    title: "Too-good-to-be-true salaries",
    desc: "$80,000/month for entry-level remote work with no experience? That's a scam, not an opportunity.",
    icon: "TrendingUp",
    color: "clay-blue",
  },
  {
    title: "Vague job descriptions",
    desc: "If the posting lacks specific duties, requirements, or company details, proceed with extreme caution.",
    icon: "FileText",
    color: "clay-green",
  },
  {
    title: "Personal communication apps",
    desc: "Real interviews happen on Zoom, Teams, or Google Meet—not WhatsApp, Telegram, or SMS only.",
    icon: "MessageSquare",
    color: "clay-purple",
  },
];

const scamPatterns = [
  {
    name: "Advance-fee fraud",
    desc: "You're asked to pay for 'training,' 'equipment,' or 'background checks' before starting.",
    color: "var(--clay-pink)",
  },
  {
    name: "Brand impersonation",
    desc: "Fake 'recruiters' use lookalike domains (amaz0n.com, g00gle.com) and stolen logos.",
    color: "var(--clay-blue)",
  },
  {
    name: "Overpayment check",
    desc: "They send a fake check for 'supplies,' ask you to wire the difference. Check bounces. You're out.",
    color: "var(--clay-yellow)",
  },
  {
    name: "Reshipping mule",
    desc: "You receive packages, then reship them abroad. You're a money-laundering middleman.",
    color: "var(--clay-green)",
  },
  {
    name: "Crypto wallet activation",
    desc: "Sign-on bonus paid in crypto — but only after you 'activate' your wallet with your own funds.",
    color: "var(--clay-purple)",
  },
  {
    name: "Data-harvesting interview",
    desc: "'Onboarding form' collects SSN, bank, driver's license before any work is offered.",
    color: "var(--clay-orange)",
  },
];

function Awareness() {
  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-10 overflow-y-auto pb-6">
          <FadeIn>
            <p className="clay-pill inline-flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" /> Awareness library
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Know the patterns,
              <br />
              <span className="text-gradient">spot them yourself.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              A growing field guide to the scams targeting job seekers in 2026. Read once, recognize
              forever.
            </p>
          </FadeIn>

          <section>
            <FadeIn>
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ background: "var(--clay-yellow)" }}
                >
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-bold">Six red flags · safety tips</h2>
              </div>
            </FadeIn>
            <StaggerChildren className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tips.map((t) => {
                const Icon =
                  (
                    Icons as unknown as Record<
                      string,
                      React.ComponentType<{ className?: string; strokeWidth?: number }>
                    >
                  )[t.icon] || Sparkles;
                return (
                  <div key={t.title} className="clay p-6">
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl"
                      style={{ background: `var(--${t.color})` }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold">{t.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                );
              })}
            </StaggerChildren>
          </section>

          <section>
            <FadeIn>
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ background: "var(--clay-pink)" }}
                >
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-bold">Common scam types</h2>
              </div>
            </FadeIn>
            <StaggerChildren className="mt-6 grid gap-5 sm:grid-cols-2">
              {scamPatterns.map((p) => (
                <div key={p.name} className="clay flex gap-5 p-6">
                  <span
                    className="h-full w-1.5 shrink-0 rounded-full"
                    style={{ background: p.color }}
                  />
                  <div>
                    <h3 className="font-display text-xl font-bold">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </section>

          <FadeIn>
            <div className="clay-lg grid gap-6 p-10 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold">The 3-second rule</h2>
                <p className="mt-3 text-muted-foreground">
                  Before replying to any offer, ask yourself:
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>1. Does the sender's email match the company's real domain?</li>
                  <li>2. Did I actually apply for this, or did it appear out of nowhere?</li>
                  <li>
                    3. Is anything — money, info, urgency — being demanded before I've even spoken
                    to a human?
                  </li>
                </ul>
              </div>
              <div className="clay-inset grid place-items-center p-8 text-center">
                <p className="font-display text-6xl font-bold text-gradient">3s</p>
                <p className="mt-2 text-sm text-muted-foreground">All it takes to dodge a scam.</p>
              </div>
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
