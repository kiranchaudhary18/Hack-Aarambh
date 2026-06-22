import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchBar } from "@/features/search/search-bar";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;

      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header
      className={`sticky top-4 z-40 mx-auto w-[min(1180px,94%)] transition-transform duration-300 ease-in-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="clay flex items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center">
            <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Scam<span className="text-gradient">Sniff</span>
          </span>
        </Link>

        <div className="hidden flex-1 lg:block">
          <SearchBar onSearch={handleSearch} />
        </div>

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
        <div className="clay mt-2 p-4 lg:hidden">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}
    </header>
  );
}
