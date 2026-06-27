import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Check, X, Lock, ShieldCheck, Fingerprint, AlertTriangle } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  useEffect(() => {
    document.title = "Reset Password — ScamSniff";
  }, []);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const requirements = [
      { check: password.length >= 8, label: "At least 8 characters" },
      { check: /[A-Z]/.test(password), label: "At least 1 uppercase letter" },
      { check: /[0-9]/.test(password), label: "At least 1 number" },
      {
        check: new Set(password.replace(/[^a-zA-Z]/g, "").split("")).size >= 2,
        label: "At least 2 unique letters",
      },
    ];
    return requirements;
  };

  const requirements = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!requirements.every((r) => r.check)) {
      toast.error("Password does not meet requirements");
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword(email, code, newPassword, confirmPassword);
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
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
                Create a
                <br />
                <span className="text-gradient">strong</span>
                <br />
                password.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Protect your account with secure password practices
              </p>
              <div className="mt-10 space-y-4">
                {[
                  { icon: Lock, text: "8+ characters minimum", color: "var(--clay-purple)" },
                  { icon: ShieldCheck, text: "Uppercase & lowercase letters", color: "var(--clay-blue)" },
                  { icon: Fingerprint, text: "Numbers & special characters", color: "var(--clay-green)" },
                  { icon: AlertTriangle, text: "Never reuse passwords", color: "var(--clay-pink)" },
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
              <Link
                to={`/verify?type=resetpassword&email=${email}`}
                className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>

              <div className="mb-6 flex items-center justify-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl clay-primary">
                  <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
                </span>
              </div>
              <h1 className="font-display text-center text-3xl font-bold">Reset Password</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Create a new secure password for your account
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground pl-1.5 tracking-wider uppercase">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 bg-background border border-input rounded-full outline-none text-sm font-semibold placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground pl-1.5 tracking-wider uppercase">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 bg-background border border-input rounded-full outline-none text-sm font-semibold placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-muted-foreground pl-1.5 tracking-wider uppercase">
                    Password Requirements:
                  </p>
                  <ul className="space-y-1">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        {req.check ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <X className="h-3 w-3 text-rose-500" />
                        )}
                        <span className={req.check ? "text-emerald-600" : "text-muted-foreground"}>
                          {req.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="clay-primary mt-4 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      Update Password <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
