import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RSVPSelector } from './RSVPSelector';
import { useAction } from 'wasp/client/operations';
import type { RSVPStatus } from '../types';

// Mock wasp client/operations
vi.mock('wasp/client/operations', () => ({
  useAction: vi.fn(),
  updateRSVP: vi.fn(),
}));

const mockMutate = vi.fn();

describe('RSVPSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAction).mockReturnValue(mockMutate as ReturnType<typeof useAction>);
  });

  it('renders RSVP selector with current status', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    expect(screen.getByTestId('rsvp-selector')).toBeInTheDocument();
  });

  it('displays current RSVP status', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    expect(screen.getByText(/you can vote and propose ideas/i)).toBeInTheDocument();
  });

  it('shows all three RSVP options', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map((btn) => btn.textContent?.toLowerCase() || '');
    expect(buttonTexts.some((text) => text.includes('going') && !text.includes('not'))).toBe(true);
    expect(buttonTexts.some((text) => text.includes('interested'))).toBe(true);
    expect(buttonTexts.some((text) => text.includes('not going'))).toBe(true);
  });

  it('highlights current RSVP status', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    const buttons = screen.getAllByRole('button');
    const goingButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes('going'));
    expect(goingButton).toBeInTheDocument();
    expect(goingButton?.className).toMatch(/bg-green/i);
  });

  it('allows user to change RSVP status to INTERESTED', async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(undefined);

    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    const interestedButton = screen.getByRole('button', { name: /interested/i });
    await user.click(interestedButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        tripId: 'trip-1',
        rsvpStatus: 'INTERESTED',
      });
    });
  });

  it('allows user to change RSVP status to NOT_GOING', async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(undefined);

    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    const notGoingButton = screen.getByRole('button', { name: /not going/i });
    await user.click(notGoingButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        tripId: 'trip-1',
        rsvpStatus: 'NOT_GOING',
      });
    });
  });

  it('allows user to change RSVP status to GOING', async () => {
    const user = userEvent.setup();
    mockMutate.mockResolvedValue(undefined);

    render(<RSVPSelector tripId="trip-1" currentStatus="INTERESTED" />);
    const buttons = screen.getAllByRole('button');
    const goingButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes('going'));
    expect(goingButton).toBeInTheDocument();
    if (goingButton) {
      await user.click(goingButton);
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        tripId: 'trip-1',
        rsvpStatus: 'GOING',
      });
    });
  });

  it('shows loading state when updating RSVP', async () => {
    const user = userEvent.setup();
    mockMutate.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    const interestedButton = screen.getByRole('button', { name: /interested/i });
    await user.click(interestedButton);

    // Button should be disabled during update
    expect(interestedButton).toBeDisabled();
  });

  it('displays permission info based on RSVP status', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    expect(screen.getByText(/you can vote and propose ideas/i)).toBeInTheDocument();
  });

  it('displays view-only message for INTERESTED status', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="INTERESTED" />);
    expect(screen.getByText(/view-only/i)).toBeInTheDocument();
  });

  it('displays view-only message for NOT_GOING status', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus="NOT_GOING" />);
    expect(screen.getByText(/view-only/i)).toBeInTheDocument();
  });

  it('applies modern UI styling', () => {
    const { container } = render(<RSVPSelector tripId="trip-1" currentStatus="GOING" />);
    // Should have modern card styling
    expect(container.querySelector('.bg-white\\/5')).toBeInTheDocument();
  });

  it('handles null currentStatus gracefully', () => {
    render(<RSVPSelector tripId="trip-1" currentStatus={null} />);
    expect(screen.getByTestId('rsvp-selector')).toBeInTheDocument();
  });
});

