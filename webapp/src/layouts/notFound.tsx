import { Link } from "react-router-dom";
import { ShieldOff, Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="clay-lg max-w-lg p-10 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl clay-primary">
          <ShieldOff className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-display text-7xl font-bold leading-none tracking-tight">404</h1>
        <h2 className="mt-3 font-display text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Looks like this offer was too good to be true. The page you're looking for doesn't exist.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="clay-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
          >
            <Home className="h-4 w-4" /> Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
