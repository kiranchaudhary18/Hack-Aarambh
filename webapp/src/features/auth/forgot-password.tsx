import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, ArrowRight, MailCheck, Loader2, RefreshCw, ShieldAlert, Clock, KeyRound } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { Field } from "./login";
import { useEffect } from "react";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";

export function ForgotPassword() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Reset password — ScamSniff";
  }, []);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email");
    }

    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
      toast.success("Verification code sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.forgotPassword(email);
      toast.success("Verification code resent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
        <FadeIn className="w-full">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <Link to="/" className="mb-10 flex items-center">
                <span className="grid h-12 w-12 place-items-center">
                  <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
                </span>
                <span className="font-display text-2xl font-bold">
                  Scam<span className="text-gradient">Sniff</span>
                </span>
              </Link>
              <h1 className="font-display text-6xl font-bold leading-tight">
                Reset your
                <br />
                <span className="text-gradient">password</span>
                <br />
                securely.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Quick and secure password recovery process
              </p>
              <div className="mt-10 space-y-4">
                {[
                  { icon: RefreshCw, text: "Quick 6-digit code reset", color: "var(--clay-blue)" },
                  { icon: ShieldAlert, text: "Secure verification process", color: "var(--clay-purple)" },
                  { icon: Clock, text: "Code expires in 1 minute", color: "var(--clay-orange)" },
                  { icon: KeyRound, text: "Encrypted password reset", color: "var(--clay-green)" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="clay-sm flex items-center gap-4 p-4 transition-transform hover:scale-[1.02]"
                  >
                    <div
                      className="grid h-10 w-10 place-items-center rounded-xl"
                      style={{ background: item.color }}
                    >
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {!sent ? (
              <div className="clay-lg p-8">
                <h1 className="font-display text-3xl font-bold">Forgot password?</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drop your email and we'll send a 6-digit code to reset it.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Field
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send code <ArrowRight className="h-4 w-4" />
                      </>
                    )}
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
                  We sent a 6-digit code to your email. It expires in 1 minute.
                </p>
                <button
                  onClick={() => navigate(`/verify?type=resetpassword&email=${email}`)}
                  className="clay-primary mt-4 w-full px-5 py-2.5 text-sm font-semibold"
                >
                  Enter Code
                </button>
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="clay-btn mt-3 w-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="inline h-4 w-4 animate-spin mr-2" /> Resending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
