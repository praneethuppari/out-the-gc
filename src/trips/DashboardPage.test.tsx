import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { DashboardPage } from './DashboardPage';
import { useQuery, getTrip } from 'wasp/client/operations';
import { useParams } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import type { AuthUser } from 'wasp/auth';
import type { TripWithParticipants } from './types';

// Mock wasp client/operations
const mockMutate = vi.fn();
vi.mock('wasp/client/operations', () => ({
  useQuery: vi.fn(),
  useAction: vi.fn(() => mockMutate),
  getTrip: vi.fn(),
  getDatePitches: vi.fn(),
  getDestinationPitches: vi.fn(),
  getTravelConfirmations: vi.fn(),
  getActivities: vi.fn(),
  updateRSVP: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  Link: ({ to, children, className, ...props }: { to: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href: to, className, ...props }, children),
}));

// Mock wasp client/auth
vi.mock('wasp/client/auth', () => ({
  useAuth: vi.fn(),
}));

// Mock DashboardNavbar
vi.mock('../shared/components/DashboardNavbar', () => ({
  DashboardNavbar: () => React.createElement('nav', { 'data-testid': 'dashboard-navbar' }),
}));

// Mock ActivityFeed - simple mock
vi.mock('../activity/components/ActivityFeed', () => ({
  ActivityFeed: () => React.createElement('div', { 'data-testid': 'activity-feed' }),
}));

const mockUser = {
  id: 'user-1',
  username: 'testuser',
  identities: {
    email: {
      id: 'email-1',
      isEmailVerified: true,
      emailVerificationSentAt: null,
      passwordResetSentAt: null,
    },
  },
} as AuthUser;

const mockTrip: TripWithParticipants = {
  id: 'trip-1',
  title: 'Summer Adventure',
  description: 'A fun summer trip',
  coverPhoto: 'https://example.com/photo.jpg',
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

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ tripId: 'trip-1' });
    vi.mocked(useAuth).mockReturnValue({ data: mockUser } as ReturnType<typeof useAuth>);
    
    // Default mock for useQuery - will return different data based on the query
    vi.mocked(useQuery).mockImplementation((query: any, args?: any) => {
      // For getTrip query
      if (query === getTrip || (typeof query === 'function' && query.name === 'getTrip')) {
        return {
          data: mockTrip,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      // For other queries (getDatePitches, getDestinationPitches, getTravelConfirmations, getActivities)
      return {
        data: [],
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });
  });

  it('renders loading state when trip is loading', () => {
    vi.mocked(useQuery).mockImplementation((query: any) => {
      if (query === getTrip || (typeof query === 'function' && query.name === 'getTrip')) {
        return {
          data: undefined,
          isLoading: true,
        } as ReturnType<typeof useQuery>;
      }
      return {
        data: [],
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });

    render(<DashboardPage user={mockUser} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error message when trip is not found', () => {
    vi.mocked(useQuery).mockImplementation((query: any) => {
      if (query === getTrip || (typeof query === 'function' && query.name === 'getTrip')) {
        return {
          data: null,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return {
        data: [],
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });

    render(<DashboardPage user={mockUser} />);
    expect(screen.getByText(/trip not found/i)).toBeInTheDocument();
  });

  it('renders trip title when trip is loaded', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByText('Summer Adventure')).toBeInTheDocument();
  });

  it('renders trip description when provided', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByText('A fun summer trip')).toBeInTheDocument();
  });

  it('renders cover photo when provided', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    const image = screen.getByAltText('Summer Adventure');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders RSVP selector component', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('rsvp-selector')).toBeInTheDocument();
  });

  it('renders planning phase indicator', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('planning-phase-indicator')).toBeInTheDocument();
  });

  it('renders participants list', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('participants-list')).toBeInTheDocument();
  });

  it('renders activity feed', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
  });

  it('renders phase-specific content for DATES phase', () => {
    // Already mocked in beforeEach
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('dates-phase-content')).toBeInTheDocument();
  });

  it('renders phase-specific content for DESTINATION phase', () => {
    const destinationTrip = { ...mockTrip, phase: 'DESTINATION' };
    vi.mocked(useQuery).mockImplementation((query: any) => {
      if (query === getTrip || (typeof query === 'function' && query.name === 'getTrip')) {
        return {
          data: destinationTrip,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return {
        data: [],
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });

    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('destination-phase-content')).toBeInTheDocument();
  });

  it('renders phase-specific content for TRAVEL_CONFIRMATION phase', () => {
    const travelTrip = { ...mockTrip, phase: 'TRAVEL_CONFIRMATION' };
    vi.mocked(useQuery).mockImplementation((query: any) => {
      if (query === getTrip || (typeof query === 'function' && query.name === 'getTrip')) {
        return {
          data: travelTrip,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      // For getTravelConfirmations, return empty array
      return {
        data: [],
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });

    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('travel-confirmation-phase-content')).toBeInTheDocument();
  });

  it('renders completed trip view for COMPLETED phase', () => {
    const completedTrip = { ...mockTrip, phase: 'COMPLETED' };
    vi.mocked(useQuery).mockImplementation((query: any) => {
      if (query === getTrip || (typeof query === 'function' && query.name === 'getTrip')) {
        return {
          data: completedTrip,
          isLoading: false,
        } as ReturnType<typeof useQuery>;
      }
      return {
        data: [],
        isLoading: false,
      } as ReturnType<typeof useQuery>;
    });

    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('completed-trip-view')).toBeInTheDocument();
  });

  it('applies modern UI styling with gradient backgrounds', () => {
    // Already mocked in beforeEach
    const { container } = render(<DashboardPage user={mockUser} />);
    // Should have gradient classes for modern UI
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });
});

