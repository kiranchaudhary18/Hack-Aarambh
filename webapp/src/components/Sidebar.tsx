import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ScanSearch, History, BookOpen, User, ShieldCheck, LogOut } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/awareness", label: "Awareness", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
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
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active ? "clay-primary" : "text-muted-foreground hover:text-foreground hover:clay-sm"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="clay-inset mb-3 p-4">
            <p className="text-xs font-semibold text-muted-foreground">Plan</p>
            <p className="font-display text-lg font-bold">Free · 12 / 20 checks</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full w-[60%] rounded-full clay-primary" />
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </div>
    </aside>
  );
}
