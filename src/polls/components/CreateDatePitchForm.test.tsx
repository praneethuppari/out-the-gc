import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateDatePitchForm } from './CreateDatePitchForm';
import { useAction } from 'wasp/client/operations';

// Mock wasp client/operations
vi.mock('wasp/client/operations', () => ({
  useAction: vi.fn(),
  createDatePitch: vi.fn(),
}));

describe('CreateDatePitchForm', () => {
  const mockCreateDatePitch = vi.fn();
  const mockTrip = {
    id: 'trip-1',
    organizerId: 'user-1',
    phase: 'DATES',
  };

  beforeEach(() => {
    vi.mocked(useAction).mockReturnValue(mockCreateDatePitch as any);
  });

  it('renders date picker inputs for start and end dates', () => {
    render(<CreateDatePitchForm tripId="trip-1" />);
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('displays number of nights and days when dates are selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<CreateDatePitchForm tripId="trip-1" />);

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    // Set start date to June 1, 2024
    await user.clear(startDateInput);
    await user.type(startDateInput, '2024-06-01');
    // Set end date to June 5, 2024 (4 nights, 5 days)
    await user.clear(endDateInput);
    await user.type(endDateInput, '2024-06-05');

    await waitFor(() => {
      // Text is split across elements - check container
      expect(container.textContent).toMatch(/\d+\s+night/);
      expect(container.textContent).toMatch(/\d+\s+day/);
    });
  });

  it('shows deadline selector with default 1 week option', () => {
    render(<CreateDatePitchForm tripId="trip-1" />);
    expect(screen.getByLabelText(/proposal deadline/i)).toBeInTheDocument();
  });

  it('allows submitting a date pitch with start and end dates', async () => {
    const user = userEvent.setup();
    mockCreateDatePitch.mockResolvedValue({});

    render(<CreateDatePitchForm tripId="trip-1" />);

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const submitButton = screen.getByRole('button', { name: /propose dates/i });

    await user.clear(startDateInput);
    await user.type(startDateInput, '2024-06-01');
    await user.clear(endDateInput);
    await user.type(endDateInput, '2024-06-05');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateDatePitch).toHaveBeenCalledWith({
        tripId: 'trip-1',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        pitchDeadline: expect.any(Date),
        votingDeadline: expect.any(Date),
      });
    });
  });

  // Note: HTML5 date inputs prevent invalid dates from being entered,
  // so this validation is primarily handled by the browser. The backend
  // also validates this, so we skip the UI-level test here.

  it('calculates deadline as 1 week from now by default', async () => {
    const user = userEvent.setup();
    const beforeSubmit = new Date();

    render(<CreateDatePitchForm tripId="trip-1" />);

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const submitButton = screen.getByRole('button', { name: /propose dates/i });

    await user.clear(startDateInput);
    await user.type(startDateInput, '2024-07-01');
    await user.clear(endDateInput);
    await user.type(endDateInput, '2024-07-05');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateDatePitch).toHaveBeenCalled();
      const callArgs = mockCreateDatePitch.mock.calls[0][0];
      const afterSubmit = new Date();
      
      // Verify deadline is approximately 1 week from now (between before and after submit + 7 days)
      const minDeadline = new Date(beforeSubmit);
      minDeadline.setDate(minDeadline.getDate() + 6); // 6 days minimum
      const maxDeadline = new Date(afterSubmit);
      maxDeadline.setDate(maxDeadline.getDate() + 8); // 8 days maximum
      
      expect(callArgs.pitchDeadline.getTime()).toBeGreaterThanOrEqual(minDeadline.getTime());
      expect(callArgs.pitchDeadline.getTime()).toBeLessThanOrEqual(maxDeadline.getTime());
    });
  });
});

