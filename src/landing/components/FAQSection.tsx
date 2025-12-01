import { FAQ_ITEMS } from "../constants";

/**
 * FAQ section with frequently asked questions
 */
export function FAQSection() {
  return (
    <section
      className="py-32 px-6 lg:px-8 relative overflow-hidden bg-black/50"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 scroll-fade-in">
          <h2
            id="faq-heading"
            className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about planning trips with OutTheGC
          </p>
        </div>

        <dl className="space-y-6">
          {FAQ_ITEMS.map((faq, index) => (
            <div
              key={faq.question}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scroll-slide-up"
              style={{
                animationDelay: `${index * 50}ms`,
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <dt className="text-lg font-bold text-white mb-3">{faq.question}</dt>
              <dd className="text-gray-400 leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

