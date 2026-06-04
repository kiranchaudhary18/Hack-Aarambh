import { Link, useRouterState } from "@tanstack/react-router";
import { Gauge, Flag, BarChart3, ShieldCheck, ArrowLeft } from "lucide-react";

const items = [
  { to: "/admin", label: "Overview", icon: Gauge },
  { to: "/admin/flagged", label: "Flagged Cases", icon: Flag },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div className="clay flex h-full flex-col gap-2 p-5">
        <Link to="/" className="mb-4 flex items-center gap-2 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl clay-primary">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight">ScamSniff</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Admin
            </p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = path === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
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

        <Link
          to="/dashboard"
          className="mt-auto flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to app
        </Link>
      </div>
    </aside>
  );
}
