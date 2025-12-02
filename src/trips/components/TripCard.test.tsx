import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TripCard } from './TripCard';
import type { TripWithParticipants } from '../types';

// Mock wasp client/router
vi.mock('wasp/client/router', () => ({
  Link: ({ to, children, className, ...props }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className} data-testid={`link-${to}`} {...props}>
      {children}
    </a>
  ),
}));

const mockTrip: TripWithParticipants = {
  id: 'trip-1',
  title: 'Summer Adventure',
  description: 'A fun summer trip to the beach',
  coverPhoto: 'https://example.com/photo.jpg',
  joinToken: 'token-123',
  phase: 'DATES',
  datePitchDeadline: null,
  votingDeadlineDurationDays: 7,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  organizerId: 'user-1',
  organizer: {
    id: 'user-1',
    username: 'organizer',
  },
  participants: [
    {
      id: 'participant-1',
      tripId: 'trip-1',
      userId: 'user-1',
      rsvpStatus: 'GOING',
      role: 'ORGANIZER',
      joinedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      user: {
        id: 'user-1',
        username: 'organizer',
      },
    },
  ],
};

describe('TripCard', () => {
  it('renders trip title', () => {
    render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    expect(screen.getByText('Summer Adventure')).toBeInTheDocument();
  });

  it('renders trip description when provided', () => {
    render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    expect(screen.getByText('A fun summer trip to the beach')).toBeInTheDocument();
  });

  it('renders cover photo when provided', () => {
    render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    const image = screen.getByAltText('Summer Adventure');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders gradient background when cover photo is not provided', () => {
    const tripWithoutPhoto = { ...mockTrip, coverPhoto: null };
    render(<TripCard trip={tripWithoutPhoto} currentUserId="user-1" />);
    const card = screen.getByTestId('trip-card');
    expect(card).toBeInTheDocument();
    // Should have gradient background class
    expect(card.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });

  it('displays RSVP status badge for current user', () => {
    render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    // Should show "Going" badge since user is GOING
    expect(screen.getByText(/going/i)).toBeInTheDocument();
  });

  it('displays organizer badge when user is organizer', () => {
    render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    expect(screen.getByText(/organizer/i)).toBeInTheDocument();
  });

  it('links to trip dashboard when clicked', () => {
    render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    const card = screen.getByTestId('trip-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('href', '/trips/trip-1');
  });

  it('applies scrapbook styling classes', () => {
    const { container } = render(<TripCard trip={mockTrip} currentUserId="user-1" />);
    const card = screen.getByTestId('trip-card');
    // Should have transform and transition classes for scrapbook effect
    expect(card).toHaveClass('transition-all');
  });

  it('handles trip without description', () => {
    const tripWithoutDescription = { ...mockTrip, description: null };
    render(<TripCard trip={tripWithoutDescription} currentUserId="user-1" />);
    expect(screen.getByText('Summer Adventure')).toBeInTheDocument();
  });

  it('shows correct RSVP badge for INTERESTED status', () => {
    const interestedTrip = {
      ...mockTrip,
      participants: [
        {
          ...mockTrip.participants[0],
          rsvpStatus: 'INTERESTED',
        },
      ],
    };
    render(<TripCard trip={interestedTrip} currentUserId="user-1" />);
    expect(screen.getByText(/interested/i)).toBeInTheDocument();
  });

  it('shows correct RSVP badge for NOT_GOING status', () => {
    const notGoingTrip = {
      ...mockTrip,
      participants: [
        {
          ...mockTrip.participants[0],
          rsvpStatus: 'NOT_GOING',
        },
      ],
    };
    render(<TripCard trip={notGoingTrip} currentUserId="user-1" />);
    expect(screen.getByText(/not going/i)).toBeInTheDocument();
  });
});

