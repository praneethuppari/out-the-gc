import { STATS } from "../constants";

/**
 * Statistics section displaying key metrics
 */
export function StatsSection() {
  return (
    <section
      className="py-24 px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20 relative overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Subtle Travel Route Line */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
          <path
            d="M100,150 Q300,80 500,150 T900,150"
            stroke="url(#gradient)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Travel destinations header */}
        <div className="text-center mb-12 scroll-fade-in">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Travel Stats</p>
          <div className="flex items-center justify-center gap-2 mb-4" aria-hidden="true">
            <span className="text-2xl">🌎</span>
            <span className="text-gray-500">|</span>
            <span className="text-2xl">✈️</span>
            <span className="text-gray-500">|</span>
            <span className="text-2xl">🗺️</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center scroll-fade-in">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl mb-4 opacity-40" aria-hidden="true">
                {stat.icon}
              </div>
              <div
                className={`text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}
              >
                {stat.value}
              </div>
              <div className="text-lg text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

