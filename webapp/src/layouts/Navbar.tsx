import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/patterns", label: "Patterns" },
    { to: "/about", label: "About" },
    { to: "/help", label: "Help" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-4 z-40 mx-auto w-[min(1180px,94%)]">
      <nav className="clay flex items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center">
            <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Scam<span className="text-gradient">Sniff</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "clay-inset text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-block"
          >
            Login
          </Link>
          <Link to="/signup" className="clay-primary px-5 py-2.5 text-sm font-semibold">
            Get Started
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="clay-btn grid h-10 w-10 place-items-center lg:hidden"
            aria-label="menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="clay mt-2 grid gap-1 p-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-[color:var(--muted)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
