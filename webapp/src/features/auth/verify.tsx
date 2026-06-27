import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MailCheck, AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type VerificationType = "emailverification" | "resetpassword" | "emailupdate";

export function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as VerificationType;
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  useEffect(() => {
    const titleMap: Record<VerificationType, string> = {
      emailverification: "Verify Email — ScamSniff",
      resetpassword: "Verify Code — ScamSniff",
      emailupdate: "Verify Email Update — ScamSniff",
    };
    document.title = titleMap[type] || "Verify — ScamSniff";
  }, [type]);

  const [status, setStatus] = useState<"loading" | "success" | "error" | "input">("loading");
  const [message, setMessage] = useState("");
  const [inputCode, setInputCode] = useState("");

  useEffect(() => {
    if (!type) {
      setStatus("error");
      setMessage("Invalid verification link. No type specified.");
      return;
    }

    // For reset password, we need manual code input
    if (type === "resetpassword") {
      setStatus("input");
      return;
    }

    // For email verification and email update, auto-verify with token
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    verifyToken();
  }, [type, token]);

  const verifyToken = async () => {
    try {
      if (type === "emailverification") {
        await api.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        triggerConfetti();
      } else if (type === "emailupdate") {
        await api.verifyEmailUpdate(token);
        setStatus("success");
        setMessage("Your email has been updated successfully! Please verify your new email address.");
      }
    } catch (error: unknown) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Invalid or expired verification link");
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !inputCode) {
      toast.error("Email and code are required");
      return;
    }

    setStatus("loading");
    try {
      await api.verifyCode(email, inputCode);
      toast.success("Code verified successfully");
      navigate(`/reset-password?email=${email}&code=${inputCode}`);
    } catch (error: any) {
      setStatus("input");
      toast.error(error.message || "Invalid or expired code");
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      );
    }, 250);
  };

  const getTitle = () => {
    switch (type) {
      case "emailverification":
        return "Verifying your email";
      case "resetpassword":
        return "Verify Code";
      case "emailupdate":
        return "Verifying email update";
      default:
        return "Verifying";
    }
  };

  const getSuccessTitle = () => {
    switch (type) {
      case "emailverification":
        return "Email Verified!";
      case "resetpassword":
        return "Code Verified!";
      case "emailupdate":
        return "Email Updated!";
      default:
        return "Success!";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "emailverification":
        return "Please wait while we verify your email address...";
      case "resetpassword":
        return `Enter the 6-digit code sent to ${email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "your email"}`;
      case "emailupdate":
        return "Please wait while we verify your email update...";
      default:
        return "Please wait...";
    }
  };

  const getSuccessActions = () => {
    switch (type) {
      case "emailverification":
        return (
          <button
            onClick={() => navigate("/login")}
            className="clay-primary mt-6 flex w-full items-center justify-center gap-2 py-3 font-semibold"
          >
            Continue to Login <ArrowRight className="h-4 w-4" />
          </button>
        );
      case "resetpassword":
        return null; // Handled by redirect
      case "emailupdate":
        return (
          <button
            onClick={() => navigate("/login")}
            className="clay-primary mt-6 flex w-full items-center justify-center gap-2 py-3 font-semibold"
          >
            Continue to Login <ArrowRight className="h-4 w-4" />
          </button>
        );
      default:
        return null;
    }
  };

  const getErrorActions = () => {
    switch (type) {
      case "emailverification":
        return (
          <div className="mt-6 space-y-3">
            <Link
              to="/login"
              className="clay-primary flex w-full items-center justify-center gap-2 py-3 font-semibold"
            >
              Go to Login <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="clay-btn flex w-full items-center justify-center gap-2 py-3 font-semibold"
            >
              Create New Account
            </Link>
          </div>
        );
      case "resetpassword":
        return (
          <Link
            to={`/forgot-password?email=${email}`}
            className="clay-primary mt-6 flex w-full items-center justify-center gap-2 py-3 font-semibold"
          >
            Go to Login <ArrowRight className="h-4 w-4" />
          </Link>
        );
      case "emailupdate":
        return (
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
        );
      default:
        return null;
    }
  };

  const getBackLink = () => {
    switch (type) {
      case "resetpassword":
        return (
          <Link
            to={`/forgot-password?email=${email}`}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-md place-items-center p-6">
        <FadeIn className="w-full">
          {type !== "resetpassword" && (
            <Link to="/" className="mb-8 flex items-center justify-center gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl clay-primary">
                <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
              </span>
              <span className="font-display text-2xl font-bold">
                Scam<span className="text-gradient">Sniff</span>
              </span>
            </Link>
          )}

          {getBackLink()}

          <div className="clay-lg p-8 text-center">
            {status === "loading" && (
              <>
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl clay-primary">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold">{getTitle()}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{getDescription()}</p>
              </>
            )}

            {status === "input" && type === "resetpassword" && (
              <>
                <div className="mb-6 flex items-center justify-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl clay-primary">
                    <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
                  </span>
                </div>
                <h1 className="font-display text-center text-3xl font-bold">Verify Code</h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-primary">
                    {email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "your email"}
                  </span>
                </p>

                <form onSubmit={handleCodeSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground pl-1.5 tracking-wider uppercase">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
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
                    disabled={status === "loading"}
                    className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold disabled:opacity-50"
                  >
                    {status === "loading" ? (
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
                <h1 className="mt-6 font-display text-3xl font-bold">{getSuccessTitle()}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                {getSuccessActions()}
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
                {getErrorActions()}
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
