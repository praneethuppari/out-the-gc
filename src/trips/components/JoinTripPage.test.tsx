import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JoinTripPage } from './JoinTripPage';
import { useQuery, useAction } from 'wasp/client/operations';
import { useParams } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import type { AuthUser } from 'wasp/auth';
import type { TripWithParticipants } from '../types';

// Mock wasp client/operations
const mockMutate = vi.fn();
vi.mock('wasp/client/operations', () => ({
  useQuery: vi.fn(),
  useAction: vi.fn(() => mockMutate),
  getTripByJoinToken: vi.fn(),
  joinTrip: vi.fn(),
  updateRSVP: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(() => vi.fn()),
}));

// Mock wasp client/auth
vi.mock('wasp/client/auth', () => ({
  useAuth: vi.fn(),
}));

// Mock DashboardNavbar
vi.mock('../../shared/components/DashboardNavbar', () => ({
  DashboardNavbar: () => <nav data-testid="dashboard-navbar" />,
}));

// Mock LandingNavbar
vi.mock('../../landing/components/LandingNavbar', () => ({
  LandingNavbar: () => <nav data-testid="landing-navbar" />,
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
  joinToken: 'abc123xyz789',
  phase: 'DATES',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  organizerId: 'user-2',
  organizer: {
    id: 'user-2',
    username: 'organizer',
  },
  participants: [],
};

describe('JoinTripPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ token: 'abc123xyz789' });
    vi.mocked(useAuth).mockReturnValue({ data: mockUser } as ReturnType<typeof useAuth>);
    vi.mocked(useAction).mockReturnValue(mockMutate as ReturnType<typeof useAction>);
    
    vi.mocked(useQuery).mockReturnValue({
      data: mockTrip,
      isLoading: false,
    } as ReturnType<typeof useQuery>);
  });

  it('renders loading state when trip is loading', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useQuery>);

    render(<JoinTripPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error message when trip is not found', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
    } as ReturnType<typeof useQuery>);

    render(<JoinTripPage />);
    expect(screen.getByText(/trip not found/i)).toBeInTheDocument();
  });

  it('displays trip title', () => {
    render(<JoinTripPage />);
    expect(screen.getByText('Summer Adventure')).toBeInTheDocument();
  });

  it('displays trip description', () => {
    render(<JoinTripPage />);
    expect(screen.getByText('A fun summer trip')).toBeInTheDocument();
  });

  it('displays trip cover photo when provided', () => {
    render(<JoinTripPage />);
    const image = screen.getByAltText('Summer Adventure');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('displays organizer information', () => {
    render(<JoinTripPage />);
    expect(screen.getByText(/organizer/i)).toBeInTheDocument();
  });

  it('displays RSVP selector', () => {
    render(<JoinTripPage />);
    expect(screen.getByTestId('rsvp-selector')).toBeInTheDocument();
  });

  it('allows user to select GOING status and join', async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(undefined);

    render(<JoinTripPage />);
    
    const buttons = screen.getAllByRole('button');
    const goingButton = buttons.find((btn) => 
      btn.textContent?.toLowerCase().includes('going') && 
      !btn.textContent?.toLowerCase().includes('not')
    );
    expect(goingButton).toBeInTheDocument();
    if (goingButton) {
      await user.click(goingButton);
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        token: 'abc123xyz789',
        rsvpStatus: 'GOING',
      });
    });
  });

  it('allows user to select INTERESTED status and join', async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(undefined);

    render(<JoinTripPage />);
    
    const buttons = screen.getAllByRole('button');
    const interestedButton = buttons.find((btn) => 
      btn.textContent?.toLowerCase().includes('interested')
    );
    expect(interestedButton).toBeInTheDocument();
    if (interestedButton) {
      await user.click(interestedButton);
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        token: 'abc123xyz789',
        rsvpStatus: 'INTERESTED',
      });
    });
  });

  it('allows user to select NOT_GOING status and join', async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(undefined);

    render(<JoinTripPage />);
    
    const buttons = screen.getAllByRole('button');
    const notGoingButton = buttons.find((btn) => 
      btn.textContent?.toLowerCase().includes('not going')
    );
    expect(notGoingButton).toBeInTheDocument();
    if (notGoingButton) {
      await user.click(notGoingButton);
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        token: 'abc123xyz789',
        rsvpStatus: 'NOT_GOING',
      });
    });
  });

  it('applies modern UI styling', () => {
    const { container } = render(<JoinTripPage />);
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });
});

