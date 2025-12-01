/**
 * Landing page constants
 * Centralized data for maintainability
 */

import type { Feature, Stat, HowItWorksStep, Testimonial, FAQItem } from "./types";

export const FEATURES: readonly Feature[] = [
  {
    icon: "🗓️",
    title: "Vote on Dates",
    description: "Propose date ranges and see everyone's availability at a glance.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: "🌍",
    title: "Choose Destinations",
    description: "Pitch destinations and use ranked-choice voting to pick the perfect spot.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "👥",
    title: "Collaborate Together",
    description: "Share join links, see who's going, and keep everyone in the loop.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "✅",
    title: "Track Progress",
    description: "See your trip planning progress. Know what's decided and what's next.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: "⚡",
    title: "Quick Decisions",
    description: "Set deadlines, vote, and move forward. No more waiting weeks.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Plan on the go. Works beautifully on your phone, tablet, or desktop.",
    gradient: "from-pink-500 to-purple-500",
  },
] as const;

export const STATS: readonly Stat[] = [
  {
    icon: "🗺️",
    value: "10K+",
    label: "Trips Planned",
    gradient: "from-cyan-400 to-purple-400",
  },
  {
    icon: "✈️",
    value: "50K+",
    label: "Happy Travelers",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    icon: "🌟",
    value: "95%",
    label: "Trips Actually Happen",
    gradient: "from-pink-400 to-rose-400",
  },
] as const;

export const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  {
    step: "01",
    title: "Create Your Trip",
    description: "Start a new trip, add a title and description. You're automatically the organizer.",
    icon: "✨",
  },
  {
    step: "02",
    title: "Share & Invite",
    description: "Send your unique join link to friends. They can join and choose their RSVP status.",
    icon: "🔗",
  },
  {
    step: "03",
    title: "Plan Together",
    description: "Vote on dates, pitch destinations, and make decisions as a group. No more endless chats.",
    icon: "🗳️",
  },
  {
    step: "04",
    title: "Travel & Enjoy",
    description: "Once everything's decided, confirm your travel and get ready for an amazing trip!",
    icon: "🎉",
  },
] as const;

export const TESTIMONIALS: readonly Testimonial[] = [
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
] as const;

export const FAQ_ITEMS: readonly FAQItem[] = [
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
] as const;

