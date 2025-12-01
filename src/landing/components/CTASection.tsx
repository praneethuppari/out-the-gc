import { Link } from "wasp/client/router";

/**
 * Call-to-action section for user signup
 */
export function CTASection() {
  return (
    <section
      className="py-32 px-6 lg:px-8 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="max-w-3xl mx-auto text-center relative z-10 scroll-fade-in">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-3xl opacity-60" aria-hidden="true">🧳</span>
          <h2
            id="cta-heading"
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Ready to escape the group chat?
          </h2>
          <span className="text-3xl opacity-60" aria-hidden="true">✈️</span>
        </div>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Join thousands of travelers making their trips happen. Your next adventure is just a vote away.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-lg hover:scale-105 transition-transform group"
        >
          <span>Start Planning Free</span>
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
        </Link>
        <p className="mt-6 text-sm text-gray-500">
          No credit card required • Free forever • Start planning in seconds
        </p>
      </div>
    </section>
  );
}

