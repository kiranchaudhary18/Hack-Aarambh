import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Camera, X, Pencil } from "lucide-react";
import { User, Mail, Bell, Trash2, LogOut, ShieldCheck, KeyRound, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — ScamSniff" },
      { name: "description", content: "Manage your account, plan, and data." },
    ],
  }),
  component: Profile,
});

interface ProfileData {
  name?: string;
  email?: string;
  avatar?: string;
  plan?: string;
  scansUsed?: number;
  scansLimit?: number;
}

function Profile() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.getProfile();
        setProfile(data);
        if (data?.avatar) {
          setPhoto(data.avatar);
        }
        if (data?.name) setEditedName(data.name);
        if (data?.email) setEditedEmail(data.email);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await api.updateProfile({ name: editedName, email: editedEmail });
      if (result.error) {
        console.error("Update failed:", result.error);
        return;
      }
      setProfile(result);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditedName(profile?.name || "");
    setEditedEmail(profile?.email || "");
    setIsEditing(false);
  }

  function handleEdit() {
    setEditedName(profile?.name || "");
    setEditedEmail(profile?.email || "");
    setIsEditing(true);
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 5 * 1024 * 1024) return;

    try {
      // Upload to server
      const result = await api.uploadAvatar(f);
      if (result.error) {
        console.error("Upload failed:", result.error);
        return;
      }
      // Update local state with the returned avatar
      if (result.avatar) {
        setPhoto(result.avatar);
        setProfile(result);
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  }

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden">
        <ClayBlobs />
        <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
          <Sidebar />
          <main className="min-w-0 flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </main>
        </div>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";
  const scansPercentage = profile?.scansLimit
    ? Math.min(100, ((profile.scansUsed || 0) / profile.scansLimit) * 100)
    : 0;

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
                    style={{
                      background: photo
                        ? undefined
                        : "linear-gradient(145deg, var(--clay-purple), var(--clay-pink))",
                    }}
                  >
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span>{initials}</span>
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
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPick}
                  />
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 text-xs font-semibold text-[color:var(--primary)] hover:underline"
                >
                  {photo ? "Change photo" : "Upload photo"}
                </button>

                <h2 className="mt-5 font-display text-2xl font-bold">{profile?.name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <span
                  className="clay-pill mt-4 inline-flex items-center gap-1.5"
                  style={{ background: "var(--clay-green)" }}
                >
                  <ShieldCheck className="h-3 w-3" /> Verified · {profile?.plan} plan
                </span>
                <div className="clay-inset mt-6 w-full p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Scans this month
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold">
                    {profile?.scansUsed || 0}
                    <span className="text-sm text-muted-foreground">
                      / {profile?.scansLimit || 20}
                    </span>
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full clay-primary"
                      style={{ width: `${scansPercentage}%` }}
                    />
                  </div>
                </div>
                <button className="clay-primary mt-4 w-full py-2.5 text-sm font-semibold">
                  Upgrade to Pro
                </button>
              </div>
            </FadeIn>

            <div className="space-y-6">
              <FadeIn delay={0.1}>
                <div className="clay p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold">Account details</h3>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="clay-btn flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="clay-btn px-3 py-1.5 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="clay-primary px-3 py-1.5 text-xs font-semibold"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl clay-inset">
                          <User className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Full name</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          ) : (
                            <p className="text-sm font-semibold">{profile?.name || "User"}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl clay-inset">
                          <Mail className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editedEmail}
                              onChange={(e) => setEditedEmail(e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          ) : (
                            <p className="text-sm font-semibold">{profile?.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
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
                      <label
                        key={n.t}
                        className="flex items-center justify-between rounded-2xl py-2"
                      >
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  action?: string;
}) {
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
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full clay-primary transition-all"
        style={{ left: defaultOn ? "calc(100% - 1.6rem)" : "0.15rem" }}
      />
    </button>
  );
}
