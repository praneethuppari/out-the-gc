import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TripList } from './TripList';
import type { TripWithParticipants } from '../types';

// Mock TripCard component
vi.mock('./TripCard', () => ({
  TripCard: ({ trip, currentUserId }: { trip: TripWithParticipants; currentUserId: string }) => (
    <div data-testid={`trip-card-${trip.id}`}>
      {trip.title} - {currentUserId}
    </div>
  ),
}));

const createMockTrip = (id: string, title: string): TripWithParticipants => ({
  id,
  title,
  description: `Description for ${title}`,
  coverPhoto: null,
  joinToken: `token-${id}`,
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
  participants: [],
});

describe('TripList', () => {
  const currentUserId = 'user-1';

  it('renders empty state when no trips', () => {
    render(<TripList trips={[]} currentUserId={currentUserId} />);
    expect(screen.getByText(/no trips yet/i)).toBeInTheDocument();
  });

  it('renders all trips in the list', () => {
    const trips = [
      createMockTrip('trip-1', 'Trip 1'),
      createMockTrip('trip-2', 'Trip 2'),
      createMockTrip('trip-3', 'Trip 3'),
    ];
    render(<TripList trips={trips} currentUserId={currentUserId} />);
    expect(screen.getByTestId('trip-card-trip-1')).toBeInTheDocument();
    expect(screen.getByTestId('trip-card-trip-2')).toBeInTheDocument();
    expect(screen.getByTestId('trip-card-trip-3')).toBeInTheDocument();
  });

  it('applies masonry/collage layout classes', () => {
    const trips = [createMockTrip('trip-1', 'Trip 1')];
    const { container } = render(<TripList trips={trips} currentUserId={currentUserId} />);
    const list = container.querySelector('[data-testid="trip-list"]');
    expect(list).toBeInTheDocument();
    // Should have grid layout for masonry effect
    expect(list).toHaveClass('grid');
  });

  it('passes currentUserId to each TripCard', () => {
    const trips = [createMockTrip('trip-1', 'Trip 1')];
    render(<TripList trips={trips} currentUserId={currentUserId} />);
    expect(screen.getByText(/user-1/)).toBeInTheDocument();
  });

  it('handles single trip', () => {
    const trips = [createMockTrip('trip-1', 'Trip 1')];
    render(<TripList trips={trips} currentUserId={currentUserId} />);
    expect(screen.getByTestId('trip-card-trip-1')).toBeInTheDocument();
  });

  it('handles many trips', () => {
    const trips = Array.from({ length: 10 }, (_, i) =>
      createMockTrip(`trip-${i}`, `Trip ${i}`)
    );
    render(<TripList trips={trips} currentUserId={currentUserId} />);
    trips.forEach((trip) => {
      expect(screen.getByTestId(`trip-card-${trip.id}`)).toBeInTheDocument();
    });
  });
});

