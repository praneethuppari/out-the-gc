import { HOW_IT_WORKS_STEPS } from "../constants";

/**
 * How It Works section explaining the process
 */
export function HowItWorksSection() {
  return (
    <section
      className="py-32 px-6 lg:px-8 relative overflow-hidden bg-black/50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 scroll-fade-in">
          <h2
            id="how-it-works-heading"
            className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Planning a trip with friends has never been easier. Here's how we make it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((item, index) => (
            <div
              key={item.step}
              className="relative scroll-slide-up"
              style={{
                animationDelay: `${index * 150}ms`,
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <div className="text-5xl mb-4" aria-hidden="true">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-cyan-400 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-4 text-2xl text-gray-600 z-10"
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

