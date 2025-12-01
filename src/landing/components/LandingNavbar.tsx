import { Link } from "wasp/client/router";
import { useAuth } from "wasp/client/auth";

/**
 * Navigation bar for the landing page
 */
export function LandingNavbar() {
  const { data: user } = useAuth();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group" aria-label="OutTheGC Home">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-black font-bold text-xl">O</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              OutTheGC
            </span>
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <Link
                to="/trips"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

