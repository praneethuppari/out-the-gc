import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompletedTripView } from './CompletedTripView';
import type { TripWithParticipants } from '../types';

const mockTrip: TripWithParticipants = {
  id: 'trip-1',
  title: 'Summer Adventure',
  description: 'A fun summer trip',
  coverPhoto: 'https://example.com/photo.jpg',
  joinToken: 'token-123',
  phase: 'COMPLETED',
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

describe('CompletedTripView', () => {
  it('renders completed trip view', () => {
    render(<CompletedTripView trip={mockTrip} />);
    expect(screen.getByTestId('completed-trip-view')).toBeInTheDocument();
  });

  it('displays trip title', () => {
    render(<CompletedTripView trip={mockTrip} />);
    expect(screen.getByText('Summer Adventure')).toBeInTheDocument();
  });

  it('displays trip description', () => {
    render(<CompletedTripView trip={mockTrip} />);
    expect(screen.getByText('A fun summer trip')).toBeInTheDocument();
  });

  it('displays completion message', () => {
    render(<CompletedTripView trip={mockTrip} />);
    expect(screen.getByText(/planning complete/i)).toBeInTheDocument();
  });

  it('applies modern UI styling', () => {
    const { container } = render(<CompletedTripView trip={mockTrip} />);
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });
});

