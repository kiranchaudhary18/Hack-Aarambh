import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { Field } from "./login";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const result = await api.register(email, password, name);
      toast.success(
        result.message ||
          "Account created successfully! Please check your email to verify your account.",
      );
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
              <Link to="/" className="mb-10 flex items-center">
                <span className="grid h-12 w-12 place-items-center">
                  <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
                </span>
                <span className="font-display text-2xl font-bold">
                  Scam<span className="text-gradient">Sniff</span>
                </span>
              </Link>
              <h1 className="font-display text-6xl font-bold leading-tight">
                Your free
                <br />
                <span className="text-gradient">scam shield</span>
                <br />
                in 30 seconds.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Protect yourself from job scams with AI-powered detection
              </p>
              <div className="mt-10 space-y-4">
                {[
                  { icon: CheckCircle2, text: "20 scans every month, free forever", color: "var(--clay-green)" },
                  { icon: CheckCircle2, text: "PDF + text + URL support", color: "var(--clay-blue)" },
                  { icon: CheckCircle2, text: "Private history & exportable reports", color: "var(--clay-purple)" },
                  { icon: CheckCircle2, text: "Weekly fraud trend digest", color: "var(--clay-pink)" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="clay flex items-center gap-4 p-4 transition-transform hover:scale-[1.02]"
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

            <div className="clay-lg p-8">
              <h2 className="font-display text-2xl font-bold">Create your account</h2>
              <p className="mt-1 text-sm text-muted-foreground">No card needed. Cancel anytime.</p>
              <form onSubmit={handleSignup} className="mt-6 space-y-4">
                <Field
                  icon={<User className="h-4 w-4" />}
                  label="Full name"
                  placeholder="Enter you full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Field
                  icon={<Lock className="h-4 w-4" />}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
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
