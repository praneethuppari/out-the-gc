/**
 * Type definitions for landing page data structures
 */

export interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
  gradient: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

