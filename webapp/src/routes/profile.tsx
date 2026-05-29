import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Camera,
  X,
  Mail,
  Bell,
  Trash2,
  LogOut,
  ShieldCheck,
  KeyRound,
  CreditCard,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile Workspace — ScamSniff" },
      {
        name: "description",
        content: "Manage your ScamSniff neural protection profile parameters.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const bgBlobsRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
        if (data.avatar) {
          setPhoto(data.avatar);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Stagger entry layout animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".profile-fade > *",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" },
      );

      // Slow float on blobs
      const blobs = bgBlobsRef.current?.children;
      if (blobs) {
        gsap.to(blobs[0], {
          x: "15vw",
          y: "10vh",
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(blobs[1], {
          x: "-10vw",
          y: "-15vh",
          duration: 28,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Twinkling stars
      const stars = document.querySelectorAll(".profile-star");
      stars.forEach((star) => {
        gsap.to(star, {
          opacity: "random(0.3, 0.95)",
          scale: "random(0.7, 1.3)",
          duration: "random(1.8, 3.8)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });
    }, profileRef);

    // Mouse Spotlight Follow
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseGlowRef.current) {
        gsap.to(mouseGlowRef.current, {
          x: e.clientX - 100,
          y: e.clientY - 100,
          duration: 0.7,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (f.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = String(reader.result);
      setPhoto(base64);
      toast.success("Profile photo synchronized successfully!");

      // Save to backend
      try {
        await api.updateProfile({ avatar: base64 });
      } catch (error) {
        console.error("Failed to update avatar:", error);
        toast.error("Failed to save avatar to server");
      }
    };
    reader.readAsDataURL(f);
  }

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[oklch(0.62_0.18_295)] mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={profileRef}
      className="relative h-screen overflow-hidden bg-[oklch(0.97_0.018_95)] font-space"
    >
      {/* Background Grids and Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40M40 0L40 40' fill='none' stroke='%236200B9' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div ref={bgBlobsRef} className="absolute inset-0 filter blur-[95px] opacity-60">
          <div className="absolute top-[12%] left-[18%] w-[420px] h-[420px] bg-[oklch(0.82_0.1_295)] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[18%] right-[12%] w-[380px] h-[380px] bg-[oklch(0.83_0.13_55)] rounded-full mix-blend-screen" />
        </div>

        <div
          ref={mouseGlowRef}
          className="absolute w-[200px] h-[200px] rounded-full pointer-events-none bg-gradient-to-r from-[oklch(0.82_0.1_295/0.4)] to-[oklch(0.83_0.13_55/0.4)] filter blur-[50px] mix-blend-screen z-10"
          style={{ transform: "translate3d(0px, 0px, 0)" }}
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1440px] gap-6 p-4 sm:p-5 lg:p-6 z-10">
        {/* Floating Sidebar */}
        <Sidebar />

        {/* Workspace core */}
        <main className="hide-scrollbar min-w-0 flex-1 space-y-5 lg:space-y-6 overflow-y-auto pr-1 pb-6 relative z-10">
          <div className="profile-fade space-y-5 lg:space-y-6">
            {/* Hero Welcome Header */}
            <header className="flex flex-col space-y-2 relative">
              <Sparkles className="profile-star absolute top-[-5px] right-[40%] text-[oklch(0.62_0.18_295/0.4)] w-4 h-4" />

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[10px] font-extrabold uppercase text-[oklch(0.62_0.18_295)] border border-[oklch(0.62_0.18_295/0.15)] flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-3 w-3" /> User Profile Config
                </span>

                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-500/10 animate-[pulse_3s_infinite]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Neural Identity Online
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[oklch(0.24_0.04_270)] tracking-tight">
                Your account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl leading-relaxed">
                Manage your profile parameters, billing details, active plan restrictions, and live
                security warnings.
              </p>
            </header>

            {/* 2-Column Profile layout */}
            <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr] items-start">
              {/* Left Column: Luxurious Profile Centerpiece Card */}
              <div className="bg-white/75 border border-white/80 rounded-[40px] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(150,130,180,0.15),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.18_295)] to-transparent opacity-40" />

                {/* Avatar container with hover glow effects */}
                <div className="group relative transition-transform duration-300 hover:scale-[1.03] select-none">
                  <div
                    className="grid h-32 w-32 place-items-center overflow-hidden rounded-[2.5rem] font-space text-4xl font-extrabold text-white shadow-md relative z-10 border border-white/60"
                    style={{
                      background: photo
                        ? undefined
                        : "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))",
                    }}
                  >
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span>AK</span>
                    )}
                  </div>

                  {/* Camera change trigger */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Change profile photo"
                    className="clay-primary absolute -bottom-1 -right-1 grid h-10 w-10 place-items-center rounded-2xl z-20 cursor-pointer shadow-md hover:scale-105 transition-transform"
                  >
                    <Camera className="h-4.5 w-4.5 text-white" />
                  </button>

                  {/* Remove camera trigger */}
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      aria-label="Remove profile photo"
                      className="clay-btn absolute -top-1 -right-1 grid h-8 w-8 place-items-center rounded-xl z-20 cursor-pointer shadow-sm hover:scale-105 transition-transform"
                    >
                      <X className="h-3.5 w-3.5 text-rose-500" />
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
                  className="mt-4 text-[10.5px] font-extrabold uppercase tracking-widest text-[oklch(0.62_0.18_295)] hover:underline font-space"
                >
                  {photo ? "Change Custom Photo" : "Upload Custom Avatar"}
                </button>

                <h2 className="mt-5 font-space text-xl sm:text-2xl font-extrabold text-[oklch(0.24_0.04_270)]">
                  {profile?.name || "User"}
                </h2>
                <p className="text-xs text-muted-foreground font-sans font-semibold mt-0.5">
                  {profile?.email || "user@example.com"}
                </p>

                {/* Verified plan badges */}
                <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-[10px] font-extrabold uppercase text-emerald-700 border border-emerald-500/10 flex items-center gap-1 mt-4 shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Verified Member ·{" "}
                  {profile?.plan || "Free"} plan
                </span>

                {/* Plan Scans usage visual block */}
                <div className="clay-inset mt-6 w-full p-4.5 text-left border border-white/60 relative">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-space">
                    Audit telemetry scope
                  </p>
                  <p className="mt-1 font-space text-2xl font-extrabold text-[oklch(0.24_0.04_270)]">
                    {profile?.scansUsed || 0}{" "}
                    <span className="text-xs text-muted-foreground font-sans font-semibold">
                      / {profile?.scansLimit || 20} scans this month
                    </span>
                  </p>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gray-200/80 p-[1.5px] relative">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${((profile?.scansUsed || 0) / (profile?.scansLimit || 20)) * 100}%`,
                        background:
                          "linear-gradient(90deg, oklch(0.68 0.16 295), oklch(0.83 0.13 55))",
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground font-sans font-semibold mt-2.5">
                    Sync cycle resets on{" "}
                    {new Date(profile?.createdAt || Date.now()).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    .
                  </p>
                </div>

                {/* Luxurious Upgrade Pro Banner */}
                <button
                  onClick={() => toast.success("Redirecting to Premium Payments Platform...")}
                  className="w-full h-11 mt-5 flex items-center justify-center gap-2 rounded-full font-space text-xs font-extrabold tracking-wide uppercase text-white shadow-[0_8px_16px_-4px_rgba(120,80,200,0.22),_inset_0_2px_4px_rgba(255,255,255,0.4)] transition-shadow duration-300 hover:shadow-[0_12px_22px_rgba(120,80,200,0.38)] cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305))",
                  }}
                >
                  <Zap className="h-4.5 w-4.5 text-white animate-pulse" />
                  <span>Upgrade to Premium Pro</span>
                </button>
              </div>

              {/* Right Column: Account Details, Notifications, and Danger zone */}
              <div className="space-y-5">
                {/* Profile Details card */}
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50">
                      <User className="h-4 w-4 text-[oklch(0.62_0.18_295)]" />
                    </span>
                    <h3 className="text-sm font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">
                      Security parameters
                    </h3>
                  </div>

                  <div className="mt-5 space-y-4">
                    <Row icon={User} label="Full name" value="Aisha Khan" />
                    <Row icon={Mail} label="Email address" value="aisha@scamsniff.ai" />
                    <Row
                      icon={KeyRound}
                      label="Password status"
                      value="••••••••••"
                      action="Update Credentials"
                    />
                    <Row
                      icon={CreditCard}
                      label="Billing methods"
                      value="No credit card active"
                      action="Add Credit Card"
                    />
                  </div>
                </div>

                {/* Notifications triggers */}
                <div className="bg-white/75 border border-white/80 rounded-[32px] p-5 sm:p-6 shadow-[0_15px_35px_rgba(180,160,200,0.06),_inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-[oklch(0.95_0.01_95)]">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50">
                      <Bell className="h-4 w-4 text-[oklch(0.62_0.18_295)]" />
                    </span>
                    <h3 className="text-sm font-extrabold uppercase text-[oklch(0.24_0.04_270)] font-space">
                      Intelligence logs alerts
                    </h3>
                  </div>

                  <div className="mt-4 space-y-2">
                    {[
                      { t: "New scam patterns digests", on: true },
                      { t: "Weekly summary of audited offers", on: true },
                      { t: "Security telemetry updates", on: false },
                    ].map((n, idx) => (
                      <label
                        key={idx}
                        className="flex items-center justify-between rounded-2xl py-2 cursor-pointer group"
                      >
                        <span className="flex items-center gap-2.5 font-sans text-xs font-semibold text-[oklch(0.3_0.03_270)] group-hover:text-[oklch(0.24_0.04_270)] transition-colors">
                          <Bell className="h-4 w-4 text-purple-400" /> {n.t}
                        </span>
                        <Toggle defaultOn={n.on} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Danger zone details */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-[32px] p-5 shadow-[0_15px_35px_rgba(254,226,226,0.1),_inset_0_2px_4px_rgba(255,255,255,0.9)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-rose-100/60">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500/10">
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </span>
                    <h3 className="text-sm font-extrabold uppercase text-rose-800 font-space">
                      Danger center
                    </h3>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => toast.error("Scam records archive cleared")}
                      className="flex-1 h-10 px-4 rounded-full border border-rose-200 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-white/70 hover:bg-rose-100/50 active:scale-[0.98] transition-all duration-200 cursor-pointer font-space flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="h-4 w-4" /> <span>Purge Audit History</span>
                    </button>

                    <Link
                      to="/"
                      className="flex-1 h-10 px-4 rounded-full border border-[oklch(0.88_0.02_95)] text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white/70 hover:bg-white active:scale-[0.98] transition-all duration-200 font-space flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="h-4 w-4 text-purple-400" /> <span>Sign Out Profile</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Row component for list items
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
    <div className="flex items-center justify-between py-2 border-b border-[oklch(0.95_0.01_95/0.5)] last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gray-50 border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
          <Icon className="h-4 w-4 text-slate-500" />
        </span>
        <div className="font-sans">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xs sm:text-sm font-bold text-[oklch(0.24_0.04_270)]">{value}</p>
        </div>
      </div>

      {action && (
        <button
          onClick={() => toast.success(`Prompt: ${action}`)}
          className="h-8 px-3 rounded-xl border border-[oklch(0.88_0.02_95)] text-[9.5px] font-extrabold uppercase tracking-wider text-[oklch(0.3_0.03_270)] bg-white/80 hover:bg-white hover:border-[oklch(0.62_0.18_295/0.2)] hover:shadow-xs active:scale-[0.97] transition-all duration-200 cursor-pointer font-space"
        >
          {action}
        </button>
      )}
    </div>
  );
}

// Toggle component
function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <button
      onClick={() => {
        setIsOn(!isOn);
        toast.success(`Notifications ${!isOn ? "Active" : "Disabled"}`);
      }}
      className={`relative h-6.5 w-11 rounded-full transition-colors duration-300 cursor-pointer p-[1.5px] ${
        isOn
          ? "bg-[oklch(0.62_0.18_295)]"
          : "bg-gray-200/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
      }`}
    >
      <span
        className="h-5.5 w-5.5 rounded-full bg-white shadow-sm block transition-transform duration-300"
        style={{ transform: isOn ? "translateX(16px)" : "translateX(0px)" }}
      />
    </button>
  );
}
