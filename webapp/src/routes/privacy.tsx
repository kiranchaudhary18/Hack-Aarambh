import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ScamSniff" },
      {
        name: "description",
        content: "How ScamSniff handles your data. Spoiler: we don't store sensitive content.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(880px,94%)] pt-12">
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl clay-primary">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <span className="clay-pill inline-block">Legal</span>
              <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: May 27, 2026</p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <article className="clay-lg mt-10 space-y-6 p-8 md:p-10 text-sm leading-relaxed text-foreground/90">
            <Section title="1. What we collect">
              We collect the minimum needed to operate: your email (for account), and metadata about
              your scans (verdict, source type, timestamp). We never sell or share this data.
            </Section>
            <Section title="2. What we DON'T store">
              <strong>Raw offer text is never stored.</strong> When you paste a job offer, it's
              scored in real time and discarded. We keep only the anonymized result.
            </Section>
            <Section title="3. Cookies">
              We use one essential cookie for your session. No tracking, no ad networks, no
              third-party analytics.
            </Section>
            <Section title="4. AI model training">
              By default your scans are NOT used for training. You can opt-in via Settings to
              contribute anonymized samples that help us improve detection for everyone.
            </Section>
            <Section title="5. Your rights">
              You can export or delete all your data at any time from your profile page. Email{" "}
              <a className="text-[color:var(--primary)]" href="mailto:privacy@scamsniff.app">
                privacy@scamsniff.app
              </a>{" "}
              for assistance.
            </Section>
            <Section title="6. Security">
              All traffic is TLS 1.3. Account data sits in encrypted Postgres. We run quarterly
              penetration tests.
            </Section>
            <Section title="7. Contact">
              Questions? Email{" "}
              <a className="text-[color:var(--primary)]" href="mailto:privacy@scamsniff.app">
                privacy@scamsniff.app
              </a>
              .
            </Section>
          </article>
        </FadeIn>
      </section>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{children}</p>
    </div>
  );
}
