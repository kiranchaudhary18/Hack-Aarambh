import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Mail, ArrowRight, MailCheck, Loader2 } from "lucide-react";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      {
        title: "Reset password — ScamSniff",
      },
      { name: "description", content: "Reset your ScamSniff password via email verification." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      await api.forgotPassword(email);
      toast.success("Verification code sent to your email");
      nav({ to: "/verify-code", search: { email } as any });
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="clay-lg p-8">
            <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Drop your email and we'll send a verification code to reset it.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground pl-1.5 tracking-wider uppercase flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full h-11 pl-11 pr-4 bg-background border border-input rounded-full outline-none text-sm font-semibold placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send verification code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link to="/login" className="font-semibold text-primary">
                Back to login
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
