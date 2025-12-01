import { useEffect, useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animationDelay?: number;
}

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver
 * Handles fade-in and slide-up animations for elements with scroll animation classes
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.05,
    rootMargin = "0px 0px 0px 0px",
    animationDelay = 200,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observerOptions = {
        threshold,
        rootMargin,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observerRef.current = observer;

      // Observe all elements with scroll animation classes
      const animatedElements = document.querySelectorAll(
        ".scroll-fade-in:not(.animate-in), .scroll-slide-up:not(.animate-in)"
      );

      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport =
          rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          // If already visible, animate immediately
          el.classList.add("animate-in");
        } else {
          // Otherwise, observe for scroll
          observer.observe(el);
        }
      });
    }, animationDelay);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, animationDelay]);
}

