import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ArrowLeft, ArrowRight, Loader2, Check, X } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      {
        title: "Reset Password — ScamSniff",
      },
      { name: "description", content: "Reset your ScamSniff password." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const nav = useNavigate();
  const search = useSearch({ from: "/reset-password" });
  const email = (search as { email?: string }).email || "";
  const code = (search as { code?: string }).code || "";
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
      nav({ to: "/login" });
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-md place-items-center p-6">
        <FadeIn className="w-full">
          <Link to="/verify-code" search={{ email } as any} className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="clay-lg p-8">
            <div className="mb-6 flex items-center justify-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl clay-primary">
                <ShieldCheck className="h-8 w-8" strokeWidth={2.5} />
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
        </FadeIn>
      </div>
    </div>
  );
}
