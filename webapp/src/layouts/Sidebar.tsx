import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  BookOpen,
  User,
  ShieldCheck,
  LogOut,
  Settings,
} from "lucide-react";
import { api } from "@/shared/lib/api";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/awareness", label: "Awareness", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const [user, setUser] = useState<{ name: string; email: string; avatar: string | null }>({
    name: "User",
    email: "user@example.com",
    avatar: null,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await api.getProfile();
        setUser({
          name: data.name || "User",
          email: data.email || "user@example.com",
          avatar: data.avatar || null,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    fetchUser();
  }, []);

  function initials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div className="clay flex h-full flex-col gap-2 p-5">
        <Link to="/" className="mb-4 flex items-center gap-2 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl clay-primary">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold">
            Scam<span className="text-gradient">Sniff</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "clay-primary"
                    : "text-muted-foreground hover:text-foreground hover:clay-sm"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <Link
            to="/profile"
            className="clay-inset flex items-center gap-3 p-3 transition hover:-translate-y-0.5"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl font-display text-sm font-bold"
              style={{
                background: user.avatar
                  ? undefined
                  : "linear-gradient(145deg, var(--clay-purple), var(--clay-pink))",
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(user.name)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>
            <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--success)]" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </div>
    </aside>
  );
}
