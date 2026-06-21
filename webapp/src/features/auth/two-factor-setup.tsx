import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Shield, ArrowLeft, Copy, Check, AlertTriangle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";

export function TwoFactorSetup() {
  const [step, setStep] = useState<"setup" | "verify" | "backup" | "success">("setup");
  const [token, setToken] = useState("");
  const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const setupMutation = useMutation({
    mutationFn: () => api.setupTwoFactor(),
    onSuccess: (data) => {
      setQrData(data);
      setStep("verify");
    },
    onError: () => {
      toast.error("Failed to setup 2FA");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (token: string) => api.verifyAndEnableTwoFactor(token),
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      setStep("backup");
      toast.success("2FA enabled successfully");
    },
    onError: () => {
      toast.error("Invalid verification code");
    },
  });

  const handleSetup = () => {
    setupMutation.mutate();
  };

  const handleVerify = () => {
    if (token.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    verifyMutation.mutate(token);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("All backup codes copied to clipboard");
  };

  const handleFinish = () => {
    setStep("success");
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <main className="hide-scrollbar min-w-0 flex-1 flex items-center justify-center overflow-y-auto pr-2 pb-6">
          <FadeIn className="w-full max-w-md">
            <div className="mb-6">
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to settings
              </Link>
            </div>

            <div className="clay p-8">
              <div className="flex items-center justify-center mb-6">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
                  style={{ background: "var(--clay-blue)" }}
                >
                  <Shield className="h-8 w-8" />
                </div>
              </div>

              <h1 className="font-display text-2xl font-bold text-center mb-2">
                Two-Factor Authentication
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Add an extra layer of security to your account
              </p>

              {step === "setup" && (
                <div className="space-y-4">
                  <div className="clay-inset p-4 rounded-2xl">
                    <h3 className="font-semibold mb-2">What is 2FA?</h3>
                    <p className="text-sm text-muted-foreground">
                      Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app when you log in.
                    </p>
                  </div>

                  <div className="clay-inset p-4 rounded-2xl">
                    <h3 className="font-semibold mb-2">How it works</h3>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                      <li>Scan the QR code with your app</li>
                      <li>Enter the verification code to enable 2FA</li>
                      <li>Save your backup codes for emergencies</li>
                    </ol>
                  </div>

                  <button
                    onClick={handleSetup}
                    disabled={setupMutation.isPending}
                    className="clay-btn w-full py-3 font-semibold"
                  >
                    {setupMutation.isPending ? "Setting up..." : "Get Started"}
                  </button>
                </div>
              )}

              {step === "verify" && qrData && (
                <div className="space-y-4">
                  <div className="clay-inset p-6 rounded-2xl flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl mb-4">
                      <QRCodeSVG value={qrData.qrCodeUrl} size={200} />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Scan this QR code with your authenticator app
                    </p>
                  </div>

                  <div className="clay-inset p-4 rounded-2xl">
                    <label className="block text-sm font-semibold mb-2">
                      Enter 6-digit code
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-2xl tracking-widest font-mono"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={verifyMutation.isPending || token.length !== 6}
                    className="clay-btn w-full py-3 font-semibold"
                  >
                    {verifyMutation.isPending ? "Verifying..." : "Verify & Enable"}
                  </button>
                </div>
              )}

              {step === "backup" && (
                <div className="space-y-4">
                  <div className="clay-inset p-4 rounded-2xl bg-yellow-500/10 border-yellow-500/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-600 mb-1">
                          Save your backup codes
                        </h3>
                        <p className="text-sm text-yellow-700">
                          These codes can be used to access your account if you lose your authenticator device. Save them in a secure location.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="clay-inset p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Backup Codes</h3>
                      <button
                        onClick={handleCopyAllCodes}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Copy All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-background rounded-lg border border-border/30"
                        >
                          <span className="font-mono text-sm">{code}</span>
                          <button
                            onClick={() => handleCopyCode(code)}
                            className="p-1 hover:bg-primary/10 rounded transition-colors"
                          >
                            {copiedCode === code ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="clay-btn w-full py-3 font-semibold"
                  >
                    I've Saved My Codes
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="space-y-4 text-center">
                  <div className="clay-inset p-6 rounded-2xl">
                    <div
                      className="grid h-16 w-16 place-items-center rounded-full mx-auto mb-4"
                      style={{ background: "var(--clay-green)" }}
                    >
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      2FA Enabled Successfully
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your account is now protected with two-factor authentication.
                    </p>
                  </div>

                  <Link
                    to="/settings"
                    className="clay-btn w-full py-3 font-semibold text-center block"
                  >
                    Return to Settings
                  </Link>
                </div>
              )}
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
