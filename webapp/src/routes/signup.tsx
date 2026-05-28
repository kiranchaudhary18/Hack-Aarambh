import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Field, GoogleIcon } from "@/routes/login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — ScamSniff" }, { name: "description", content: "Create your free ScamSniff account." }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
        <FadeIn className="w-full">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <Link to="/" className="mb-8 flex items-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-2xl clay-primary">
                  <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <span className="font-display text-2xl font-bold">Scam<span className="text-gradient">Sniff</span></span>
              </Link>
              <h1 className="font-display text-5xl font-bold leading-tight">Your free<br/><span className="text-gradient">scam shield</span><br/>in 30 seconds.</h1>
              <ul className="mt-8 space-y-3 text-muted-foreground">
                {[
                  "20 scans every month, free forever",
                  "PDF + text + URL support",
                  "Private history & exportable reports",
                  "Weekly fraud trend digest",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" /> {t}</li>
                ))}
              </ul>
            </div>

            <div className="clay-lg p-8">
              <h2 className="font-display text-2xl font-bold">Create your account</h2>
              <p className="mt-1 text-sm text-muted-foreground">No card needed. Cancel anytime.</p>
              <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }} className="mt-6 space-y-4">
                <Field icon={<User className="h-4 w-4" />} label="Full name" placeholder="Aisha Khan" />
                <Field icon={<Mail className="h-4 w-4" />} label="Email" type="email" placeholder="you@email.com" />
                <Field icon={<Lock className="h-4 w-4" />} label="Password" type="password" placeholder="At least 8 characters" />
                <p className="text-xs text-muted-foreground">
                  We'll send a verification link to your inbox. By signing up you accept our terms.
                </p>
                <button className="clay-primary mt-2 flex w-full items-center justify-center gap-2 py-3 font-semibold">
                  Create account <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <button className="clay-btn flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold">
                <GoogleIcon /> Continue with Google
              </button>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already a member? <Link to="/login" className="font-semibold text-[color:var(--primary)]">Log in</Link>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
