import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import { useEffect } from "react";

export function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login — ScamSniff";
  }, []);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const response = await api.login(email, password);
      // Store the token in localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed. Please try again.";

      // Check if error is due to unverified email
      if (errorMessage.includes("verify your email") || errorMessage.includes("not verified")) {
        toast.error(errorMessage, {
          action: {
            label: "Resend Verification",
            onClick: async () => {
              try {
                await api.resendVerificationEmail(email);
                toast.success("Verification email sent! Please check your inbox.");
              } catch (resendError) {
                toast.error("Failed to resend verification email");
              }
            },
          },
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

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
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Log in to continue scanning offers.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                right={
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[color:var(--primary)]" /> Remember me
                </label>
                <Link to="/forgot-password" className="font-semibold text-[color:var(--primary)]">
                  Forgot?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  <>
                    Log in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or continue with{" "}
              <span className="h-px flex-1 bg-border" />
            </div>
            <button className="clay-btn flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold">
              <GoogleIcon /> Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-[color:var(--primary)]">
                Create an account
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export function Field({
  icon,
  label,
  right,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="clay-inset flex items-center gap-3 px-4 py-3">
        <span className="text-muted-foreground">{icon}</span>
        <input
          {...props}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {right}
      </span>
    </label>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.1 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c6.9 0 9.6-4.8 9.6-9.2 0-.6-.1-1-.2-1.6H12z"
      />
    </svg>
  );
}
