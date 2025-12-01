import { useRef } from "react";
import { Link } from "wasp/client/router";
import { useAuth } from "wasp/client/auth";
import { useParallaxScroll } from "../hooks/useParallaxScroll";

/**
 * Hero section with parallax effect and call-to-action
 */
export function HeroSection() {
  const { data: user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollY = useParallaxScroll();

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
      aria-label="Hero section"
    >
      {/* Animated Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Subtle Map Pattern */}
      <div
        className="absolute inset-0 bg-map-pattern opacity-5 [mask-image:linear-gradient(0deg,transparent,black)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 fade-in">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-sm font-medium text-gray-300">Escape the group chat</span>
        </div>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="block text-white mb-2">Plan trips that</span>
          <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            actually happen
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Stop the endless debates. Vote on dates, pick destinations, and turn your travel dreams into reality.
        </p>

        {/* Travel Route Visualization */}
        <div className="flex items-center justify-center gap-3 mb-12 opacity-60" aria-hidden="true">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
          </div>
          <span className="text-2xl">✈️</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {user ? (
            <Link
              to="/trips"
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Go to Dashboard
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Planning Free
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        <p className="text-sm text-gray-500">No credit card • Free forever</p>
      </div>

      {/* Travel Route Illustration */}
      <div className="absolute bottom-32 right-10 hidden lg:block opacity-20" aria-hidden="true">
        <svg
          width="200"
          height="120"
          viewBox="0 0 200 120"
          fill="none"
          className="animate-float"
          style={{ animationDelay: "0s" }}
        >
          <path
            d="M20,60 Q60,20 100,60 T180,60"
            stroke="url(#routeGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          <circle cx="20" cy="60" r="4" fill="#06b6d4" />
          <circle cx="100" cy="60" r="4" fill="#a855f7" />
          <circle cx="180" cy="60" r="4" fill="#ec4899" />
          <text x="20" y="50" fill="#06b6d4" fontSize="10" textAnchor="middle">
            Start
          </text>
          <text x="100" y="50" fill="#a855f7" fontSize="10" textAnchor="middle">
            Plan
          </text>
          <text x="180" y="50" fill="#ec4899" fontSize="10" textAnchor="middle">
            Travel
          </text>
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll" />
        </div>
      </div>
    </section>
  );
}

