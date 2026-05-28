import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/components/Animated";
import { ShieldCheck, Target, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — ScamSniff" },
    { name: "description", content: "ScamSniff helps job seekers detect scam offers in seconds with AI-powered red flag analysis." },
    { property: "og:title", content: "About ScamSniff" },
    { property: "og:description", content: "Our mission: protect every job seeker from fraud." },
  ]}),
  component: About,
});

function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(1180px,94%)] pt-12">
        <FadeIn>
          <span className="clay-pill inline-block">About us</span>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">We protect <span className="text-gradient">first-time job seekers</span> from scams.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every year, millions of students and freshers lose money to fake recruiters, advance-fee fraud, and brand impersonation. ScamSniff is a free tool that puts AI-powered fraud detection in their pocket.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, t: "The problem", d: "Job scams cost victims $367M+ in 2024 alone. Most look identical to real offers.", c: "var(--clay-pink)" },
            { icon: ShieldCheck, t: "Our solution", d: "Paste any offer — text, PDF, or URL. Get a scam score and red-flag breakdown in 4 seconds.", c: "var(--clay-green)" },
            { icon: Sparkles, t: "Our vision", d: "A world where no one has to learn about scams the hard way. Free education + free protection.", c: "var(--clay-purple)" },
          ].map(({ icon: I, t, d, c }) => (
            <div key={t} className="clay p-7">
              <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: c }}>
                <I className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.1}>
          <div className="clay-lg mt-14 p-10">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "var(--clay-yellow)" }}>
                <Users className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold">The team</h2>
            </div>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              ScamSniff started as a hackathon weekend in 2026. Today it's maintained by a small team of designers, ML engineers, and cybersecurity researchers who care deeply about consumer safety.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
              {[
                { n: "Aisha K.", r: "Product · Design", c: "var(--clay-pink)" },
                { n: "Daniel R.", r: "ML engineering", c: "var(--clay-blue)" },
                { n: "Priya S.", r: "Security research", c: "var(--clay-green)" },
                { n: "Marco V.", r: "Frontend", c: "var(--clay-orange)" },
              ].map((m) => (
                <div key={m.n} className="clay-sm p-5 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl font-bold" style={{ background: m.c }}>
                    {m.n.split(" ").map((x) => x[0]).join("")}
                  </div>
                  <p className="mt-3 font-bold">{m.n}</p>
                  <p className="text-xs text-muted-foreground">{m.r}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>
      <div className="mt-20"><Footer /></div>
    </div>
  );
}
