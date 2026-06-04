import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

export function VerifyCode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    document.title = "Verify Code — ScamSniff";
  }, []);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error("Email and code are required");
      return;
    }

    setIsLoading(true);
    try {
      await api.verifyCode(email, code);
      toast.success("Code verified successfully");
      navigate(`/reset-password?email=${email}&code=${code}`);
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-md place-items-center p-6">
        <FadeIn className="w-full">
          <Link
            to={`/forgot-password?email=${email}`}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="clay-lg p-8">
            <div className="mb-6 flex items-center justify-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl clay-primary">
                <ShieldCheck className="h-8 w-8" strokeWidth={2.5} />
              </span>
            </div>
            <h1 className="font-display text-center text-3xl font-bold">Verify Code</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-primary">
                {email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "your email"}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground pl-1.5 tracking-wider uppercase">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="1D2S54"
                  maxLength={6}
                  className="w-full h-14 px-4 bg-background border border-input rounded-2xl outline-none text-center text-2xl font-bold tracking-widest placeholder:text-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all uppercase"
                />
                <p className="text-[10px] text-center text-muted-foreground">
                  Code expires in 1 minute
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Verify Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Didn't receive code?{" "}
              <Link
                to={`/forgot-password?email=${email}`}
                className="font-semibold text-primary hover:underline"
              >
                Resend
              </Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
