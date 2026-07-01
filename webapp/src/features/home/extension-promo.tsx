import { Link } from "react-router-dom";
import { Download, Puzzle, ArrowRight } from "lucide-react";
import { FadeIn } from "@/shared/components/Animated";

export function ExtensionPromo() {
  return (
    <section className="relative mx-auto w-[min(1180px,94%)] py-20">
      <FadeIn>
        <div className="clay-lg p-8 md:p-14 relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background border border-border">
          {/* Animated decorative puzzle background icon */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
            <Puzzle className="h-96 w-96 text-[color:var(--clay-blue)] animate-[spin_60s_linear_infinite]" />
          </div>
          
          <div className="max-w-2xl relative z-10">
            <span className="clay-pill inline-flex items-center gap-1.5 bg-[color:var(--clay-blue)] text-white font-semibold text-xs py-1.5 px-3">
              <Puzzle className="h-3.5 w-3.5" /> Browser Extension
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold sm:text-5xl tracking-tight leading-tight">
              Scan job offers directly from <span className="text-gradient">LinkedIn</span> and <span className="text-gradient">Indeed</span>.
            </h2>
            <p className="mt-4 text-muted-foreground font-medium text-base sm:text-lg">
              Get real-time insights as you browse job sites. Select any job posting, crop it, and analyze it instantly without leaving the page.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="/scamsniff-extension.zip"
                download="scamsniff-extension.zip"
                className="clay-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold shadow-md transition hover:scale-[1.02]"
              >
                <Download className="h-4 w-4" /> Download Extension (.zip)
              </a>
              <Link
                to="/help"
                className="clay-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition hover:scale-[1.02]"
              >
                View Installation Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
