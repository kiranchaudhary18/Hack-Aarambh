import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Mail, ArrowRight, MailCheck } from "lucide-react";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Field } from "@/routes/login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — ScamSniff" },
      { name: "description", content: "Reset your ScamSniff password via email verification." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-md place-items-center p-6">
        <FadeIn className="w-full">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl clay-primary">
              <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <span className="font-display text-2xl font-bold">
              Scam<span className="text-gradient">Sniff</span>
            </span>
          </Link>

          {!sent ? (
            <div className="clay-lg p-8">
              <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Drop your email and we'll send a verification link to reset it.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-6 space-y-4"
              >
                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                />
                <button className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold">
                  Send reset link <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remembered it?{" "}
                <Link to="/login" className="font-semibold text-[color:var(--primary)]">
                  Back to login
                </Link>
              </p>
            </div>
          ) : (
            <div className="clay-lg p-8 text-center">
              <div
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl"
                style={{ background: "var(--clay-green)" }}
              >
                <MailCheck className="h-10 w-10" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a verification link. It expires in 30 minutes. Don't see it? Check spam —
                ironic, we know.
              </p>
              <button
                onClick={() => setSent(false)}
                className="clay-btn mt-6 px-5 py-2.5 text-sm font-semibold"
              >
                Resend
              </button>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
