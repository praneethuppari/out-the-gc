import { TESTIMONIALS } from "../constants";

/**
 * Testimonials section displaying user reviews
 */
export function TestimonialsSection() {
  return (
    <section
      className="py-32 px-6 lg:px-8 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 scroll-fade-in">
          <h2
            id="testimonials-heading"
            className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Loved by Travelers
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See what people are saying about planning trips with OutTheGC
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all scroll-slide-up"
              style={{
                animationDelay: `${index * 100}ms`,
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400" aria-hidden="true">
                    ⭐
                  </span>
                ))}
              </div>
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>
              <footer>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.location}</div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

