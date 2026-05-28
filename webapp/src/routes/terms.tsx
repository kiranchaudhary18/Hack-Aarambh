import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Scale, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "Terms & Conditions — ScamSniff" },
    { name: "description", content: "Terms of service for using ScamSniff. AI may not be 100% accurate — use judgment." },
  ]}),
  component: Terms,
});

function Terms() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(880px,94%)] pt-12">
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "var(--clay-yellow)" }}>
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <span className="clay-pill inline-block">Legal</span>
              <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Terms & Conditions</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: May 27, 2026</p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="clay-lg mt-8 flex items-start gap-3 p-5 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--warning)]" />
            <p><strong>Disclaimer:</strong> ScamSniff uses AI and heuristics that may not be 100% accurate. Results are advisory — always use your own judgment before responding to or accepting any job offer.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <article className="clay-lg mt-6 space-y-6 p-8 md:p-10 text-sm leading-relaxed">
            <S t="1. Acceptance of terms">By using ScamSniff you agree to these terms. If you don't agree, don't use the service.</S>
            <S t="2. Use of service">You may use ScamSniff for personal, non-commercial scam detection. Don't scrape, abuse, or attempt to reverse-engineer the model.</S>
            <S t="3. Account">You're responsible for keeping your login credentials safe. One account per person.</S>
            <S t="4. No warranty">The service is provided "as is" with no warranties. We do not guarantee accuracy, uptime, or fitness for any particular purpose.</S>
            <S t="5. Limitation of liability">ScamSniff is not liable for any financial loss, damages, or decisions made based on our analysis. The final decision is always yours.</S>
            <S t="6. Prohibited use">Don't use ScamSniff to harass, defame, or harm others. Don't submit illegal content. We may suspend accounts that violate these rules.</S>
            <S t="7. Termination">We may terminate accounts at any time for violations. You may delete your account at any time.</S>
            <S t="8. Changes">We may update these terms occasionally. Continued use after changes constitutes acceptance.</S>
            <S t="9. Governing law">These terms are governed by the laws of Delaware, USA.</S>
          </article>
        </FadeIn>
      </section>
      <div className="mt-20"><Footer /></div>
    </div>
  );
}

function S({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{t}</h2>
      <p className="mt-2 text-muted-foreground">{children}</p>
    </div>
  );
}
