import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTripForm } from './CreateTripForm';
import { useQuery, useAction } from 'wasp/client/operations';

// Mock createTrip action
const mockMutate = vi.fn();
const mockRefetch = vi.fn();

// Mock wasp client/operations
vi.mock('wasp/client/operations', () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    refetch: mockRefetch,
    error: null,
    isError: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: 'success',
  })),
  useAction: vi.fn(() => mockMutate),
  createTrip: vi.fn(),
  getTrips: vi.fn(),
}));

describe('CreateTripForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: mockRefetch,
      error: null,
      isError: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: 'success',
    } as unknown as ReturnType<typeof useQuery>);
    vi.mocked(useAction).mockReturnValue(mockMutate as ReturnType<typeof useAction>);
  });

  it('renders collapsed form by default', () => {
    render(<CreateTripForm />);
    expect(screen.getByText(/create new trip/i)).toBeInTheDocument();
    expect(screen.getByText(/start planning your next adventure/i)).toBeInTheDocument();
  });

  it('expands form when clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTripForm />);
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    expect(screen.getByLabelText(/trip title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover photo/i)).toBeInTheDocument();
  });

  it('renders submit button when expanded', async () => {
    const user = userEvent.setup();
    render(<CreateTripForm />);
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    expect(screen.getByRole('button', { name: /create trip/i })).toBeInTheDocument();
  });

  it('allows user to enter trip title', async () => {
    const user = userEvent.setup();
    render(<CreateTripForm />);
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    const titleInput = screen.getByLabelText(/trip title/i);
    await user.type(titleInput, 'Summer Adventure');
    expect(titleInput).toHaveValue('Summer Adventure');
  });

  it('allows user to enter description', async () => {
    const user = userEvent.setup();
    render(<CreateTripForm />);
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'A fun summer trip');
    expect(descriptionInput).toHaveValue('A fun summer trip');
  });

  it('allows user to enter cover photo URL', async () => {
    const user = userEvent.setup();
    render(<CreateTripForm />);
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    const photoInput = screen.getByLabelText(/cover photo/i);
    await user.type(photoInput, 'https://example.com/photo.jpg');
    expect(photoInput).toHaveValue('https://example.com/photo.jpg');
  });

  it('validates that title is required', async () => {
    const user = userEvent.setup();
    render(<CreateTripForm />);
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    const titleInput = screen.getByLabelText(/trip title/i);
    expect(titleInput).toBeRequired();
  });

  it('applies dark theme styling', () => {
    const { container } = render(<CreateTripForm />);
    // Should have dark theme classes
    expect(container.querySelector('.bg-white\\/5')).toBeInTheDocument();
  });

  it('shows loading state when submitting', async () => {
    const user = userEvent.setup();
    mockMutate.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<CreateTripForm />);
    
    const expandButton = screen.getByRole('button', { name: /create new trip/i });
    await user.click(expandButton);
    
    const titleInput = screen.getByLabelText(/trip title/i);
    const submitButton = screen.getByRole('button', { name: /create trip/i });
    
    await user.type(titleInput, 'Test Trip');
    await user.click(submitButton);
    
    // Button should show loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });
});

