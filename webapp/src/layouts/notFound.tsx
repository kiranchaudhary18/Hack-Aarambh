import { Link } from "react-router-dom";
import { useEffect } from "react";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";

export function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found — ScamSniff";
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <ClayBlobs />
      <div className="relative w-full max-w-md text-center">
        <FadeIn>
          <div className="clay-lg p-8 md:p-10 flex flex-col items-center">
            <span
              className="grid h-20 w-20 place-items-center rounded-3xl mb-6 animate-bounce"
              style={{
                background: "linear-gradient(135deg, var(--clay-purple), var(--clay-pink))",
              }}
            >
              <HelpCircle className="h-10 w-10 text-white" />
            </span>
            
            <h1 className="font-display text-7xl font-extrabold tracking-tight">
              404
            </h1>
            
            <h2 className="mt-4 font-display text-2xl font-bold">
              Offer Not Found
            </h2>
            
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              The page or job offer you are trying to access doesn't exist, has been removed, or is a suspected scam we already sniffed out.
            </p>

            <div className="mt-8 w-full">
              <Link
                to="/dashboard"
                className="clay-primary flex w-full items-center justify-center gap-2 py-3.5 font-semibold transition hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
