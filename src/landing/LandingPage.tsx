import { useEffect, useRef, useState } from "react";
import { Link } from "wasp/client/router";
import { useAuth } from "wasp/client/auth";

export function LandingPage() {
  const { data: user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px 0px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            // Once animated, we can stop observing
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe all elements with scroll animation classes
      const animatedElements = document.querySelectorAll('.scroll-fade-in:not(.animate-in), .scroll-slide-up:not(.animate-in)');
      animatedElements.forEach((el) => {
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          // If already visible, animate immediately
          el.classList.add("animate-in");
        } else {
          // Otherwise, observe for scroll
          observer.observe(el);
        }
      });

      // Also observe section containers
      const sections = [
        featuresRef.current,
        statsRef.current,
        ctaRef.current,
      ].filter(Boolean);

      sections.forEach((el) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isInViewport) {
            // Animate all children immediately
            const children = el.querySelectorAll('.scroll-fade-in:not(.animate-in), .scroll-slide-up:not(.animate-in)');
            children.forEach((child) => child.classList.add("animate-in"));
          } else {
            observer.observe(el);
          }
        }
      });

      return () => {
        observer.disconnect();
      };
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Custom Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
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

      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Subtle Map Pattern */}
        <div className="absolute inset-0 bg-map-pattern opacity-5 [mask-image:linear-gradient(0deg,transparent,black)]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 fade-in">
            <span className="relative flex h-2 w-2">
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
          <div className="flex items-center justify-center gap-3 mb-12 opacity-60">
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
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
        <div className="absolute bottom-32 right-10 hidden lg:block opacity-20">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none" className="animate-float" style={{ animationDelay: "0s" }}>
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
            <text x="20" y="50" fill="#06b6d4" fontSize="10" textAnchor="middle">Start</text>
            <text x="100" y="50" fill="#a855f7" fontSize="10" textAnchor="middle">Plan</text>
            <text x="180" y="50" fill="#ec4899" fontSize="10" textAnchor="middle">Travel</text>
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
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Section with Scroll Animation */}
      <section
        ref={featuresRef}
        className="py-32 px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-4xl">🗺️</span>
              <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Everything you need
              </h2>
              <span className="text-4xl">✈️</span>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stop the back-and-forth. Make decisions together and plan your perfect trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🗓️",
                title: "Vote on Dates",
                desc: "Propose date ranges and see everyone's availability at a glance.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: "🌍",
                title: "Choose Destinations",
                desc: "Pitch destinations and use ranked-choice voting to pick the perfect spot.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "👥",
                title: "Collaborate Together",
                desc: "Share join links, see who's going, and keep everyone in the loop.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: "✅",
                title: "Track Progress",
                desc: "See your trip planning progress. Know what's decided and what's next.",
                gradient: "from-cyan-500 to-teal-500",
              },
              {
                icon: "⚡",
                title: "Quick Decisions",
                desc: "Set deadlines, vote, and move forward. No more waiting weeks.",
                gradient: "from-purple-500 to-indigo-500",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Plan on the go. Works beautifully on your phone, tablet, or desktop.",
                gradient: "from-pink-500 to-purple-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500 scroll-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms`, transitionDelay: `${index * 100}ms` }}
              >
                {/* Subtle travel accent */}
                <div className="absolute top-4 right-4 text-3xl opacity-5 group-hover:opacity-10 transition-opacity">
                  {index === 0 && "🗓️"}
                  {index === 1 && "🌍"}
                  {index === 2 && "👥"}
                  {index === 3 && "📍"}
                  {index === 4 && "⚡"}
                  {index === 5 && "📱"}
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-24 px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20 relative overflow-hidden"
      >
        {/* Subtle Travel Route Line */}
        <div className="absolute inset-0 opacity-5">
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🌎</span>
              <span className="text-gray-500">|</span>
              <span className="text-2xl">✈️</span>
              <span className="text-gray-500">|</span>
              <span className="text-2xl">🗺️</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center scroll-fade-in">
            <div>
              <div className="text-4xl mb-4 opacity-40">🗺️</div>
              <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                10K+
              </div>
              <div className="text-lg text-gray-300">Trips Planned</div>
            </div>
            <div>
              <div className="text-4xl mb-4 opacity-40">✈️</div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                50K+
              </div>
              <div className="text-lg text-gray-300">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl mb-4 opacity-40">🌟</div>
              <div className="text-5xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-3">
                95%
              </div>
              <div className="text-lg text-gray-300">Trips Actually Happen</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-fade-in">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Planning a trip with friends has never been easier. Here's how we make it happen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Trip",
                desc: "Start a new trip, add a title and description. You're automatically the organizer.",
                icon: "✨",
              },
              {
                step: "02",
                title: "Share & Invite",
                desc: "Send your unique join link to friends. They can join and choose their RSVP status.",
                icon: "🔗",
              },
              {
                step: "03",
                title: "Plan Together",
                desc: "Vote on dates, pitch destinations, and make decisions as a group. No more endless chats.",
                icon: "🗳️",
              },
              {
                step: "04",
                title: "Travel & Enjoy",
                desc: "Once everything's decided, confirm your travel and get ready for an amazing trip!",
                icon: "🎉",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative scroll-slide-up"
                style={{ animationDelay: `${index * 150}ms`, transitionDelay: `${index * 150}ms` }}
              >
                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold text-cyan-400 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-2xl text-gray-600 z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-fade-in">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Loved by Travelers
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See what people are saying about planning trips with OutTheGC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                location: "New York",
                text: "Finally! No more 200-message group chats trying to decide on dates. We planned our Tokyo trip in 2 days instead of 2 weeks.",
                rating: 5,
              },
              {
                name: "Mike T.",
                location: "San Francisco",
                text: "The voting system is genius. Everyone could see what dates worked and we made a decision in hours. Best trip planning tool ever.",
                rating: 5,
              },
              {
                name: "Emma L.",
                location: "London",
                text: "Our group of 8 friends used this for our Bali trip. The ranked-choice voting for destinations made it so easy to pick where to go.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all scroll-slide-up"
                style={{ animationDelay: `${index * 100}ms`, transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden bg-black/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 scroll-fade-in">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-400">
              Everything you need to know about planning trips with OutTheGC
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does the voting system work?",
                answer: "Going participants can propose date ranges or destinations. Everyone votes, and the option with the most support wins. For dates, you can vote 'all work', 'partial' (select specific dates), or 'none work'.",
              },
              {
                question: "Can people who aren't going still see the trip?",
                answer: "Yes! People who mark themselves as 'Interested' or 'Not Going' can view the trip planning but can't vote or propose ideas. This keeps everyone in the loop.",
              },
              {
                question: "Is it really free?",
                answer: "Yes, completely free forever. No credit card required, no hidden fees. We believe trip planning should be accessible to everyone.",
              },
              {
                question: "How do I invite friends to my trip?",
                answer: "Each trip gets a unique shareable link. Just copy and send it to your friends via text, email, or any messaging app. They click the link, choose their RSVP status, and they're in!",
              },
              {
                question: "What happens after we decide on dates and destination?",
                answer: "Once dates and destination are chosen, you move to the travel confirmation phase. Everyone marks when they've booked their travel, and then you're ready to go!",
              },
              {
                question: "Can I change my RSVP status?",
                answer: "Absolutely! You can update your RSVP status at any time. If you switch from 'Interested' to 'Going', you'll be able to vote and propose ideas.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scroll-slide-up"
                style={{ animationDelay: `${index * 50}ms`, transitionDelay: `${index * 50}ms` }}
              >
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section
          ref={ctaRef}
          className="py-32 px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />

          <div className="max-w-3xl mx-auto text-center relative z-10 scroll-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl opacity-60">🧳</span>
              <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to escape the group chat?
              </h2>
              <span className="text-3xl opacity-60">✈️</span>
            </div>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of travelers making their trips happen. Your next adventure is just a vote away.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-lg hover:scale-105 transition-transform group"
            >
              <span>Start Planning Free</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required • Free forever • Start planning in seconds
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} OutTheGC. Made for travelers who want to actually travel.
          </p>
        </div>
      </footer>
    </div>
  );
}
