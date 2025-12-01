import { FEATURES } from "../constants";

/**
 * Features section displaying key product features
 */
export function FeaturesSection() {
  return (
    <section
      className="py-32 px-6 lg:px-8 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 scroll-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-4xl" aria-hidden="true">🗺️</span>
            <h2
              id="features-heading"
              className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              Everything you need
            </h2>
            <span className="text-4xl" aria-hidden="true">✈️</span>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stop the back-and-forth. Make decisions together and plan your perfect trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500 scroll-slide-up overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Subtle travel accent */}
              <div
                className="absolute top-4 right-4 text-3xl opacity-5 group-hover:opacity-10 transition-opacity"
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10`}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm relative z-10">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

