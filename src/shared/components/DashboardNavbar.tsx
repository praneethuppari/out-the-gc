import { Link } from "wasp/client/router";
import { useLocation } from "react-router-dom";
import { logout, useAuth } from "wasp/client/auth";
import { useState, useEffect } from "react";

/**
 * Floating navigation bar for dashboard pages
 * Matches landing page style with travel-themed elements
 */
export function DashboardNavbar() {
  const { data: user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-black/90 border-b border-white/20 shadow-lg"
          : "backdrop-blur-sm bg-black/60 border-b border-white/10"
      }`}
      aria-label="Dashboard navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="OutTheGC Home"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <span className="text-black font-bold text-xl">✈️</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              OutTheGC
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                <Link
                  to="/trips"
                  className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    isActive("/trips")
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🗺️</span>
                    <span className="hidden sm:inline">My Trips</span>
                    <span className="sm:hidden">Trips</span>
                  </span>
                  {isActive("/trips") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500" />
                  )}
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300">
                    <span>👤</span>
                    <span>{user.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold flex items-center gap-2"
                  >
                    <span>🚪</span>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Decorative travel route line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
    </nav>
  );
}

