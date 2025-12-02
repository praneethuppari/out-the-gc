import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlanningPhaseContent } from './PlanningPhaseContent';
import { useQuery, useAction, getDatePitches, getDestinationPitches } from 'wasp/client/operations';
import type { TripWithParticipants } from '../types';

// Mock wasp client/operations
vi.mock('wasp/client/operations', () => ({
  useQuery: vi.fn(),
  useAction: vi.fn(),
  getDatePitches: vi.fn(),
  getDestinationPitches: vi.fn(),
  getTravelConfirmations: vi.fn(),
  voteOnDatePitch: vi.fn(),
}));

const mockTrip: TripWithParticipants = {
  id: 'trip-1',
  title: 'Summer Adventure',
  description: 'A fun summer trip',
  coverPhoto: null,
  joinToken: 'token-123',
  phase: 'DATES',
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

describe('PlanningPhaseContent', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuery>);
    vi.mocked(useAction).mockReturnValue({
      execute: vi.fn(),
      isError: false,
      isLoading: false,
      error: null,
    } as any);
  });

  it('renders dates phase content for DATES phase', () => {
    render(<PlanningPhaseContent trip={mockTrip} currentUserId="user-1" />);
    expect(screen.getByTestId('dates-phase-content')).toBeInTheDocument();
  });

  it('renders destination phase content for DESTINATION phase', () => {
    const destinationTrip = { ...mockTrip, phase: 'DESTINATION' };
    render(<PlanningPhaseContent trip={destinationTrip} currentUserId="user-1" />);
    expect(screen.getByTestId('destination-phase-content')).toBeInTheDocument();
  });

  it('renders travel confirmation content for TRAVEL_CONFIRMATION phase', () => {
    const travelTrip = { ...mockTrip, phase: 'TRAVEL_CONFIRMATION' };
    render(<PlanningPhaseContent trip={travelTrip} currentUserId="user-1" />);
    expect(screen.getByTestId('travel-confirmation-phase-content')).toBeInTheDocument();
  });

  it('shows create date pitch form for GOING users in DATES phase', () => {
    render(<PlanningPhaseContent trip={mockTrip} currentUserId="user-1" />);
    expect(screen.getByTestId('create-date-pitch-form')).toBeInTheDocument();
  });

  it('hides create forms for INTERESTED users', () => {
    const interestedTrip = {
      ...mockTrip,
      participants: [
        {
          ...mockTrip.participants[0],
          rsvpStatus: 'INTERESTED',
        },
      ],
    };
    render(<PlanningPhaseContent trip={interestedTrip} currentUserId="user-1" />);
    expect(screen.queryByTestId('create-date-pitch-form')).not.toBeInTheDocument();
  });

  it('displays existing date pitches in DATES phase', () => {
    vi.mocked(useQuery).mockImplementation((query) => {
      if (query === getDatePitches) {
        return {
          data: [
            {
              id: 'pitch-1',
              startDate: new Date('2024-06-01'),
              endDate: new Date('2024-06-05'),
              description: 'Summer dates',
              tripId: 'trip-1',
              pitchedById: 'user-1',
              createdAt: new Date(),
              pitchDeadline: new Date(),
              votingDeadline: new Date(),
              pitchedBy: { id: 'user-1', username: 'organizer' },
              votes: [],
            },
          ],
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return { data: [], isLoading: false } as ReturnType<typeof useQuery>;
    });

    render(<PlanningPhaseContent trip={mockTrip} currentUserId="user-1" />);
    expect(screen.getByText(/summer dates/i)).toBeInTheDocument();
  });

  it('displays existing destination pitches in DESTINATION phase', () => {
    const destinationTrip = { ...mockTrip, phase: 'DESTINATION' };
    vi.mocked(useQuery).mockImplementation((query) => {
      if (query === getDestinationPitches) {
        return {
          data: [
            {
              id: 'pitch-1',
              location: 'Paris',
              description: 'Beautiful city',
              tripId: 'trip-1',
              pitchedById: 'user-1',
              createdAt: new Date(),
              pitchedBy: { id: 'user-1', username: 'organizer' },
              votes: [],
            },
          ],
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return { data: [], isLoading: false } as ReturnType<typeof useQuery>;
    });

    render(<PlanningPhaseContent trip={destinationTrip} currentUserId="user-1" />);
    expect(screen.getByText(/paris/i)).toBeInTheDocument();
  });
});

