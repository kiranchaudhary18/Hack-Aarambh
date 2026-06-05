import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShieldCheck, MailCheck, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";

export function VerifyEmailUpdate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    document.title = "Verify Email Update — ScamSniff";
  }, []);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verifyEmailUpdate = async () => {
      try {
        await api.verifyEmailUpdate(token);
        setStatus("success");
        setMessage(
          "Your email has been updated successfully! Please verify your new email address.",
        );
      } catch (error: unknown) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Invalid or expired verification link");
      }
    };

    verifyEmailUpdate();
  }, [token]);

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

          <div className="clay-lg p-8 text-center">
            {status === "loading" && (
              <>
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl clay-primary">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold">Verifying email update</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please wait while we verify your email update...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div
                  className="mx-auto grid h-20 w-20 place-items-center rounded-3xl"
                  style={{ background: "var(--clay-green)" }}
                >
                  <MailCheck className="h-10 w-10" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold">Email Updated!</h1>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="clay-primary mt-6 flex w-full items-center justify-center gap-2 py-3 font-semibold"
                >
                  Continue to Login <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}

            {status === "error" && (
              <>
                <div
                  className="mx-auto grid h-20 w-20 place-items-center rounded-3xl"
                  style={{ background: "var(--clay-red)" }}
                >
                  <AlertCircle className="h-10 w-10" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold">Verification Failed</h1>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                <div className="mt-6 space-y-3">
                  <Link
                    to="/login"
                    className="clay-primary flex w-full items-center justify-center gap-2 py-3 font-semibold"
                  >
                    Go to Login <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/profile"
                    className="clay-btn flex w-full items-center justify-center gap-2 py-3 font-semibold"
                  >
                    Go to Profile
                  </Link>
                </div>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
