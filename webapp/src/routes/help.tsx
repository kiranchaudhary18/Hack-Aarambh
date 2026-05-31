import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { ChevronDown, LifeBuoy, BookOpen, Zap } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — ScamSniff" },
      {
        name: "description",
        content: "Frequently asked questions about ScamSniff, how detection works, and accuracy.",
      },
    ],
  }),
  component: Help,
});

const faqs = [
  {
    q: "How does scam detection work?",
    a: "ScamSniff combines GPT-powered language analysis with rule-based pattern matching. We score 30+ signals: sender domain reputation, urgency cues, salary outliers, payment requests, brand impersonation, and more.",
  },
  {
    q: "Is ScamSniff 100% accurate?",
    a: "No AI is perfect. Our model is ~94% accurate on benchmarked job-scam datasets, but you should always combine our verdict with common sense and a quick search of the company name.",
  },
  {
    q: "Do you store my pasted offer?",
    a: "We hash and discard raw content immediately after scoring. Only anonymized signals (verdict, source, timestamp) are kept for your history.",
  },
  {
    q: "What file types can I upload?",
    a: "PDF (max 10MB). For images, paste the text after OCR — image upload is on our roadmap.",
  },
  {
    q: "Is ScamSniff free?",
    a: "Yes — 20 free scans per month forever. Pro unlocks unlimited scans, team workspaces, and API access.",
  },
  {
    q: "Can I report a scam I already received?",
    a: "Absolutely — head to the Report page. Your submission helps train the model and protect others.",
  },
  {
    q: "Do you support languages other than English?",
    a: "Currently English, Hindi, and Urdu. French, Spanish, and Tagalog launch Q3 2026.",
  },
];

function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(1080px,94%)] pt-12">
        <FadeIn>
          <span className="clay-pill inline-block">Help center</span>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
            How can we <span className="text-gradient">help?</span>
          </h1>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              t: "Quick start",
              d: "Paste a job offer on /analyze and hit Sniff. Done.",
              c: "var(--clay-blue)",
            },
            {
              icon: Zap,
              t: "Best results",
              d: "Include the sender email, subject, and full body for highest accuracy.",
              c: "var(--clay-yellow)",
            },
            {
              icon: LifeBuoy,
              t: "Still stuck?",
              d: "Email support@scamsniff.app — we reply within 24h.",
              c: "var(--clay-green)",
            },
          ].map(({ icon: I, t, d, c }) => (
            <div key={t} className="clay p-5">
              <div
                className="grid h-10 w-10 place-items-center rounded-2xl"
                style={{ background: c }}
              >
                <I className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-lg font-bold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-3">
          <h2 className="font-display text-3xl font-bold">FAQs</h2>
          {faqs.map((f, i) => (
            <div key={i} className="clay overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="border-t border-border px-6 py-5 text-sm text-muted-foreground">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
