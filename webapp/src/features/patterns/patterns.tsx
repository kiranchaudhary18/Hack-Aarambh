import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn, StaggerChildren } from "@/shared/components/Animated";
import {
  PhoneCall,
  MessageCircle,
  CreditCard,
  Briefcase,
  Link2,
  Mail,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/patterns")({
  head: () => ({
    meta: [
      { title: "Scam Patterns — ScamSniff" },
      {
        name: "description",
        content:
          "Library of common job scam patterns: fake HR calls, Telegram jobs, payment scams, and more.",
      },
      { property: "og:title", content: "Common job scam patterns" },
    ],
  }),
  component: Patterns,
});

const patterns = [
  {
    icon: PhoneCall,
    name: "Fake HR call",
    color: "var(--clay-pink)",
    desc: "Unsolicited call from someone claiming to be an HR recruiter at a known company. They pressure you for personal info or a 'training fee'.",
    signs: [
      "Caller ID hidden or unfamiliar",
      "Asks for SSN/bank info upfront",
      "No record on company's careers page",
    ],
  },
  {
    icon: MessageCircle,
    name: "Telegram / WhatsApp job",
    color: "var(--clay-blue)",
    desc: "Recruitment that moves to encrypted chat. Often 'click tasks' or 'product review' jobs paying daily via crypto.",
    signs: [
      "Recruiter never video calls",
      "Pay sent in USDT/crypto",
      "Refers you to 'mentors' for tasks",
    ],
  },
  {
    icon: CreditCard,
    name: "Payment / fee scam",
    color: "var(--clay-yellow)",
    desc: "Asks for an upfront fee for equipment, training, background check, or 'worker activation'.",
    signs: ["Money via gift cards", "Crypto wallet activation", "'Refundable' deposit"],
  },
  {
    icon: Briefcase,
    name: "Reshipping / mule job",
    color: "var(--clay-green)",
    desc: "You receive packages and forward them — actually re-shipping stolen goods bought with stolen cards.",
    signs: ["No clear employer", "Pays per package shipped", "Uses your home address"],
  },
  {
    icon: Link2,
    name: "Phishing link",
    color: "var(--clay-purple)",
    desc: "'Application form' links to a fake login page that harvests your credentials.",
    signs: ["URL doesn't match company", "Asks for password", "Bit.ly / tinyurl wrappers"],
  },
  {
    icon: Mail,
    name: "Brand impersonation",
    color: "var(--clay-orange)",
    desc: "Email or offer that looks like it's from Amazon, Google, Microsoft, etc. — but uses lookalike domains.",
    signs: ["@gmail.com sender", "Spoofed domain (amaz0n.com)", "Generic greetings"],
  },
];

function Patterns() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(1180px,94%)] pt-12">
        <FadeIn>
          <span className="clay-pill inline-block">Scam patterns</span>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
            Know the <span className="text-gradient">playbook.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Six patterns cover 90% of job scams. Learn them once, spot them forever.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patterns.map(({ icon: I, name, color, desc, signs }) => (
            <div key={name} className="clay flex h-full flex-col p-6">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: color }}
              >
                <I className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <div className="mt-4 space-y-2">
                {signs.map((s) => (
                  <div key={s} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-[color:var(--destructive)]" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.1}>
          <div className="clay-lg mt-14 flex flex-col items-center gap-4 p-10 text-center md:p-14">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Got something suspicious right now?
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Don't reply yet. Drop it in our analyzer and get a verdict in seconds.
            </p>
            <Link to="/analyze" className="clay-primary px-7 py-3.5 font-semibold">
              Analyze it now
            </Link>
          </div>
        </FadeIn>
      </section>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
