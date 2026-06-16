import { Link } from "react-router-dom";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import {
  Bell,
  ShieldCheck,
  Smartphone,
  Lock,
  KeyRound,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react";

export function Settings() {
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
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                      style={{ background: "var(--clay-yellow)" }}
                    >
                      <Lock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">2FA is disabled</p>
                      <p className="text-xs text-muted-foreground">Enable 2FA for extra security</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

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
                {[
                  { t: "New scam patterns digest", on: true },
                  { t: "Weekly summary of your scans", on: true },
                  { t: "Product updates & tips", on: false },
                ].map((n) => (
                  <label key={n.t} className="flex items-center justify-between rounded-2xl py-2">
                    <span className="flex items-center gap-3 text-sm">
                      <Bell className="h-4 w-4 text-muted-foreground" /> {n.t}
                    </span>
                    <Toggle defaultOn={n.on} />
                  </label>
                ))}
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

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  return (
    <button
      onClick={(e) => e.currentTarget.classList.toggle("is-on")}
      className={`relative h-7 w-12 rounded-full transition ${defaultOn ? "is-on" : ""}`}
      style={{ boxShadow: "var(--shadow-clay-inset)" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full clay-primary transition-all"
        style={{ left: defaultOn ? "calc(100% - 1.6rem)" : "0.15rem" }}
      />
    </button>
  );
}
