import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Camera, X } from "lucide-react";

import { User, Mail, Bell, Trash2, LogOut, ShieldCheck, KeyRound, CreditCard } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — ScamSniff" }, { name: "description", content: "Manage your account, plan, and data." }] }),
  component: Profile,
});

function Profile() {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(f);
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <p className="clay-pill inline-block">Profile</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Your account</h1>
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <FadeIn delay={0.05}>
              <div className="clay-lg flex flex-col items-center p-8 text-center">
                <div className="group relative">
                  <div
                    className="grid h-32 w-32 place-items-center overflow-hidden rounded-[2rem] font-display text-4xl font-bold"
                    style={{ background: photo ? undefined : "linear-gradient(145deg, var(--clay-purple), var(--clay-pink))" }}
                  >
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span>AK</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Change profile photo"
                    className="clay-primary absolute -bottom-1 -right-1 grid h-10 w-10 place-items-center rounded-2xl"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      aria-label="Remove profile photo"
                      className="clay-btn absolute -top-1 -right-1 grid h-8 w-8 place-items-center rounded-xl"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
                </div>
                <button onClick={() => fileRef.current?.click()} className="mt-3 text-xs font-semibold text-[color:var(--primary)] hover:underline">
                  {photo ? "Change photo" : "Upload photo"}
                </button>

                <h2 className="mt-5 font-display text-2xl font-bold">Aisha Khan</h2>
                <p className="text-sm text-muted-foreground">aisha@designer.studio</p>
                <span className="clay-pill mt-4 inline-flex items-center gap-1.5" style={{ background: "var(--clay-green)" }}>
                  <ShieldCheck className="h-3 w-3" /> Verified · Free plan
                </span>
                <div className="clay-inset mt-6 w-full p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scans this month</p>
                  <p className="mt-1 font-display text-2xl font-bold">12 <span className="text-sm text-muted-foreground">/ 20</span></p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                    <div className="h-full w-[60%] rounded-full clay-primary" />
                  </div>
                </div>
                <button className="clay-primary mt-4 w-full py-2.5 text-sm font-semibold">Upgrade to Pro</button>
              </div>
            </FadeIn>

            <div className="space-y-6">
              <FadeIn delay={0.1}>
                <div className="clay p-6">
                  <h3 className="font-display text-xl font-bold">Account details</h3>
                  <div className="mt-5 space-y-4">
                    <Row icon={User} label="Full name" value="Aisha Khan" />
                    <Row icon={Mail} label="Email" value="aisha@designer.studio" />
                    <Row icon={KeyRound} label="Password" value="••••••••••" action="Change" />
                    <Row icon={CreditCard} label="Billing" value="No card on file" action="Add" />
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
                  <h3 className="font-display text-xl font-bold text-[color:var(--destructive)]">Danger zone</h3>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button className="clay-btn flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-[color:var(--destructive)]">
                      <Trash2 className="h-4 w-4" /> Delete history
                    </button>
                    <Link to="/" className="clay-btn flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold">
                      <LogOut className="h-4 w-4" /> Sign out
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, action }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; action?: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl clay-inset">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </div>
      {action && <button className="clay-btn px-3 py-1.5 text-xs font-semibold">{action}</button>}
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
      <span className="absolute top-0.5 h-6 w-6 rounded-full clay-primary transition-all" style={{ left: defaultOn ? "calc(100% - 1.6rem)" : "0.15rem" }} />
    </button>
  );
}
