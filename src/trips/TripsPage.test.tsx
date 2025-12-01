import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TripsPage } from './TripsPage';
import { useQuery } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import type { AuthUser } from 'wasp/auth';

// Mock wasp client/operations
vi.mock('wasp/client/operations', () => ({
  useQuery: vi.fn(),
  getTrips: vi.fn(),
}));

// Mock wasp client/auth
vi.mock('wasp/client/auth', () => ({
  useAuth: vi.fn(),
}));

// Mock components
vi.mock('./components/TripList', () => ({
  TripList: ({ trips, currentUserId }: { trips: unknown[]; currentUserId: string }) => (
    <div data-testid="trip-list">
      {trips.length} trips for {currentUserId}
    </div>
  ),
}));

vi.mock('./components/CreateTripForm', () => ({
  CreateTripForm: () => <div data-testid="create-trip-form">Create Trip Form</div>,
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

describe('TripsPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ data: mockUser } as ReturnType<typeof useAuth>);
  });

  it('renders loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useQuery>);

    render(<TripsPage user={mockUser} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders trips list when data is loaded', () => {
    const mockTrips = [
      {
        id: 'trip-1',
        title: 'Trip 1',
        description: 'Description 1',
        coverPhoto: null,
        joinToken: 'token-1',
        phase: 'DATES',
        createdAt: new Date(),
        updatedAt: new Date(),
        organizerId: 'user-1',
        organizer: { id: 'user-1', username: 'organizer' },
        participants: [],
      },
    ];

    vi.mocked(useQuery).mockReturnValue({
      data: mockTrips,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TripsPage user={mockUser} />);
    expect(screen.getByTestId('trip-list')).toBeInTheDocument();
    expect(screen.getByText(/1 trips for user-1/)).toBeInTheDocument();
  });

  it('renders create trip form', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TripsPage user={mockUser} />);
    expect(screen.getByTestId('create-trip-form')).toBeInTheDocument();
  });

  it('applies dark theme styling', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    const { container } = render(<TripsPage user={mockUser} />);
    const page = container.querySelector('.min-h-screen');
    expect(page).toBeInTheDocument();
    // Should have black background
    expect(page).toHaveClass('bg-black');
  });

  it('displays page title', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TripsPage user={mockUser} />);
    expect(screen.getByText(/my trips/i)).toBeInTheDocument();
  });

  it('handles empty trips list', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<TripsPage user={mockUser} />);
    expect(screen.getByTestId('trip-list')).toBeInTheDocument();
    expect(screen.getByText(/0 trips for user-1/)).toBeInTheDocument();
  });
});

