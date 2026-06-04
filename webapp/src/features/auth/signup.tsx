import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { Field, GoogleIcon } from "./login";
import { api } from "@/shared/lib/api";
import { useEffect } from "react";

export function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign up — ScamSniff";
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      await api.register(email, password, name);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error instanceof Error ? error.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
        <FadeIn className="w-full">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <Link to="/" className="mb-8 flex items-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-2xl clay-primary">
                  <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <span className="font-display text-2xl font-bold">
                  Scam<span className="text-gradient">Sniff</span>
                </span>
              </Link>
              <h1 className="font-display text-5xl font-bold leading-tight">
                Your free
                <br />
                <span className="text-gradient">scam shield</span>
                <br />
                in 30 seconds.
              </h1>
              <ul className="mt-8 space-y-3 text-muted-foreground">
                {[
                  "20 scans every month, free forever",
                  "PDF + text + URL support",
                  "Private history & exportable reports",
                  "Weekly fraud trend digest",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="clay-lg p-8">
              <h2 className="font-display text-2xl font-bold">Create your account</h2>
              <p className="mt-1 text-sm text-muted-foreground">No card needed. Cancel anytime.</p>
              <form onSubmit={handleSignup} className="mt-6 space-y-4">
                <Field
                  icon={<User className="h-4 w-4" />}
                  label="Full name"
                  placeholder="Aisha Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Field
                  icon={<Lock className="h-4 w-4" />}
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  We'll send a verification link to your inbox. By signing up you accept our terms.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or{" "}
                <span className="h-px flex-1 bg-border" />
              </div>
              <button className="clay-btn flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold">
                <GoogleIcon /> Continue with Google
              </button>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already a member?{" "}
                <Link to="/login" className="font-semibold text-[color:var(--primary)]">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
