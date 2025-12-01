import { useAuth } from "wasp/client/auth";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import { LandingNavbar } from "./components/LandingNavbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { StatsSection } from "./components/StatsSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";
import { CTASection } from "./components/CTASection";

/**
 * Main landing page component
 * Composed of modular section components for maintainability
 */
export function LandingPage() {
  const { data: user } = useAuth();

  // Initialize scroll animations
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <LandingNavbar />

      <main>
        <HeroSection />

        <FeaturesSection />

        <StatsSection />

        <HowItWorksSection />

        <TestimonialsSection />

        <FAQSection />

        {!user && <CTASection />}
      </main>

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
