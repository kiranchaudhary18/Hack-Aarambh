import { Link } from "@tanstack/react-router";
import { ShieldCheck, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mx-auto w-[min(1180px,94%)] pb-10">
      <div className="clay-lg p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl clay-primary">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div>
                <p className="font-display text-xl font-bold">ScamSniff</p>
                <p className="text-xs text-muted-foreground">Job scams, sniffed in seconds.</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              We help job seekers spot fraud before they reply. Built independently, funded by Pro upgrades — never by your data.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Github, Twitter, Linkedin].map((I, i) => (
                <a key={i} href="#" className="clay-btn grid h-10 w-10 place-items-center" aria-label="social">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Product" links={[
            { l: "Analyze offer", to: "/analyze" },
            { l: "Dashboard", to: "/dashboard" },
            { l: "History", to: "/history" },
            { l: "Awareness", to: "/awareness" },
          ]} />
          <FooterCol title="Company" links={[
            { l: "About", to: "/about" },
            { l: "Contact", to: "/contact" },
            { l: "Help center", to: "/help" },
            { l: "Report a scam", to: "/report" },
          ]} />
          <FooterCol title="Resources" links={[
            { l: "Scam patterns", to: "/patterns" },
            { l: "Privacy policy", to: "/privacy" },
            { l: "Terms & conditions", to: "/terms" },
            { l: "Awareness library", to: "/awareness" },
          ]} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© 2026 ScamSniff Labs · All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[color:var(--success)]" /> All systems normal · 99.98% uptime
          </p>
          <p>Made with care for job seekers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { l: string; to: string }[] }) {
  return (
    <div>
      <p className="font-display text-sm font-bold uppercase tracking-wider">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((x) => (
          <li key={x.l}>
            <Link to={x.to} className="text-sm text-muted-foreground transition hover:text-foreground">{x.l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
