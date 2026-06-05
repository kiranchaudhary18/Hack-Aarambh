import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { Flag, Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";

export function Report() {
  const [jobText, setJobText] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Advance-fee");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "Report a Scam — ScamSniff";
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (jobText.trim().length < 30)
      return toast.error("Please paste at least 30 characters of the offer.");
    if (jobText.length > 5000) return toast.error("Offer text must be under 5000 characters.");
    if (desc.length > 1000) return toast.error("Description must be under 1000 characters.");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setJobText("");
      setDesc("");
      toast.success("Thanks! Your report is queued for review.");
    }, 1200);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(960px,94%)] pt-12">
        <FadeIn>
          <span className="clay-pill inline-block">Report</span>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
            Saw a scam? <span className="text-gradient">Tell us.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Your reports help us train our detection model and warn other job seekers about emerging
            fraud patterns.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={submit} className="clay-lg mt-10 space-y-5 p-8">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: "var(--clay-pink)" }}
              >
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-lg font-bold">Submit suspicious offer</p>
                <p className="text-xs text-muted-foreground">
                  Anonymous · used for ML training only
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Scam type</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Advance-fee",
                  "Fake HR call",
                  "Telegram job",
                  "Brand impersonation",
                  "Crypto wallet",
                  "Other",
                ].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${type === t ? "clay-primary" : "clay-btn"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Full offer text</label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                rows={8}
                maxLength={5000}
                placeholder="Paste the full email, DM, or job posting here..."
                className="clay-inset mt-2 w-full resize-none px-4 py-3 text-sm outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">{jobText.length}/5000</p>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="How did you receive it? Anything else we should know?"
                className="clay-inset mt-2 w-full resize-none px-4 py-3 text-sm outline-none"
              />
            </div>

            <button
              disabled={sending}
              className="clay-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold disabled:opacity-70"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Flag className="h-4 w-4" />
              )}
              {sending ? "Submitting…" : "Submit report"}
            </button>
          </form>
        </FadeIn>
      </section>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
