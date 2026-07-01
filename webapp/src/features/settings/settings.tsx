import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import {
  Bell,
  Lock,
  KeyRound,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { api } from "@/shared/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TwoFactorSetup } from "@/features/auth/two-factor-setup";

interface NotificationPreferences {
  scamPatternsDigest?: boolean;
  weeklyScanSummary?: boolean;
  productUpdates?: boolean;
  scamAlerts?: boolean;
  securityAlerts?: boolean;
  patternUpdates?: boolean;
  accountUpdates?: boolean;
}

const NOTIFICATION_ITEMS = [
  { key: "scamPatternsDigest", label: "New scam patterns digest" },
  { key: "weeklyScanSummary", label: "Weekly summary of your scans" },
  { key: "productUpdates", label: "Product updates & tips" },
  { key: "scamAlerts", label: "Scam alerts" },
  { key: "securityAlerts", label: "Security alerts" },
  { key: "patternUpdates", label: "Pattern updates" },
  { key: "accountUpdates", label: "Account updates" },
] as const;

export function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>({});
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access settings");
      navigate("/login");
    }
  }, [token]);

  if (!token) {
    return null;
  }

  const { data: preferencesData, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => api.getNotificationPreferences(),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: (preferences: NotificationPreferences) =>
      api.updateNotificationPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      toast.success("Notification preferences updated");
    },
    onError: () => {
      toast.error("Failed to update notification preferences");
    },
  });

  const disableTwoFactorMutation = useMutation({
    mutationFn: (password: string) => api.disableTwoFactor(password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("2FA disabled successfully");
      setShowDisableDialog(false);
      setDisablePassword("");
    },
    onError: () => {
      toast.error("Failed to disable 2FA. Please check your password.");
    },
  });

  // Initialize local preferences when data loads
  if (preferencesData?.notificationPreferences && Object.keys(localPreferences).length === 0) {
    setLocalPreferences(preferencesData.notificationPreferences);
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    const updatedPreferences = {
      ...localPreferences,
      [key]: !localPreferences[key],
    };
    setLocalPreferences(updatedPreferences);
    updateMutation.mutate(updatedPreferences);
  };

  const handleDisableTwoFactor = () => {
    if (!disablePassword) {
      toast.error("Please enter your password");
      return;
    }
    disableTwoFactorMutation.mutate(disablePassword);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <p className="clay-pill inline-block">Settings</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Account settings</h1>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="clay p-6">
              <h3 className="font-display text-xl font-bold">Two-factor authentication</h3>
              <div className="mt-5 space-y-3">
                <div className="clay-inset p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                        style={{
                          background: profile?.twoFactorEnabled
                            ? "var(--clay-green)"
                            : "var(--clay-yellow)",
                        }}
                      >
                        <Lock className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">
                          2FA is {profile?.twoFactorEnabled ? "enabled" : "disabled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {profile?.twoFactorEnabled
                            ? "Your account is protected with 2FA"
                            : "Enable 2FA for extra security"}
                        </p>
                      </div>
                    </div>
                    {profile?.twoFactorEnabled ? (
                      <button
                        onClick={() => setShowDisableDialog(true)}
                        className="clay-btn px-4 py-2 text-xs font-semibold text-[color:var(--destructive)]"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowTwoFactorSetup(true)}
                        className="clay-btn inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                      >
                        Enable <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {showDisableDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="clay p-6 max-w-md w-full mx-4">
                <h3 className="font-display text-xl font-bold mb-4">Disable 2FA</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Are you sure you want to disable two-factor authentication? This will make your account less secure.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Enter your password to confirm
                    </label>
                    <input
                      type="password"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDisableDialog(false);
                        setDisablePassword("");
                      }}
                      className="clay-btn flex-1 py-3 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDisableTwoFactor}
                      disabled={disableTwoFactorMutation.isPending}
                      className="clay-btn flex-1 py-3 text-sm font-semibold text-[color:var(--destructive)]"
                    >
                      {disableTwoFactorMutation.isPending ? "Disabling..." : "Disable 2FA"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showTwoFactorSetup && (
            <FadeIn>
              <TwoFactorSetup onClose={() => setShowTwoFactorSetup(false)} />
            </FadeIn>
          )}

          <FadeIn delay={0.1}>
            <div className="clay p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">API Keys</h3>
                <Link
                  to="/settings/api-tokens"
                  className="clay-btn inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
                >
                  Manage <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-5">
                <div className="clay-inset p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full clay-inset">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Manage your API tokens</p>
                      <p className="text-xs text-muted-foreground">
                        Generate and manage API tokens for the browser extension
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="clay p-6">
              <h3 className="font-display text-xl font-bold">Notifications</h3>
              <div className="mt-5 space-y-3">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Loading preferences...
                  </div>
                ) : (
                  NOTIFICATION_ITEMS.map((item) => (
                    <label key={item.key} className="flex items-center justify-between rounded-2xl py-2">
                      <span className="flex items-center gap-3 text-sm">
                        <Bell className="h-4 w-4 text-muted-foreground" /> {item.label}
                      </span>
                      <Toggle
                        isOn={localPreferences[item.key] ?? true}
                        onToggle={() => handleToggle(item.key)}
                        disabled={updateMutation.isPending}
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="clay p-6">
              <h3 className="font-display text-xl font-bold text-[color:var(--destructive)]">
                Danger zone
              </h3>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="clay-btn flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-[color:var(--destructive)]">
                  <Trash2 className="h-4 w-4" /> Delete history
                </button>
                <Link
                  to="/"
                  className="clay-btn flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </Link>
              </div>
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}

function Toggle({ isOn = false, onToggle, disabled = false }: { isOn?: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative h-7 w-12 rounded-full transition ${isOn ? "is-on" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ boxShadow: "var(--shadow-clay-inset)" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full clay-primary transition-all"
        style={{ left: isOn ? "calc(100% - 1.6rem)" : "0.15rem" }}
      />
    </button>
  );
}
