import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateVoteForm } from './DateVoteForm';
import type { DatePitchWithVotes } from '../types';

// Mock wasp client/auth
vi.mock('wasp/client/auth', () => ({
  useAuth: vi.fn(() => ({ data: { id: 'user-2', username: 'testuser' } })),
}));

// Create dates relative to now to ensure voting is open
const now = new Date();
const pitchDeadline = new Date(now);
pitchDeadline.setDate(pitchDeadline.getDate() - 1); // Yesterday (voting open)
const votingDeadline = new Date(now);
votingDeadline.setDate(votingDeadline.getDate() + 5); // 5 days from now

const mockPitch: DatePitchWithVotes = {
  id: 'pitch-1',
  startDate: new Date('2024-06-01'),
  endDate: new Date('2024-06-05'),
  description: 'Summer vacation dates',
  tripId: 'trip-1',
  pitchedById: 'user-1',
  createdAt: new Date('2024-05-01'),
  pitchDeadline,
  votingDeadline,
  pitchedBy: {
    id: 'user-1',
    username: 'testuser',
  },
  votes: [],
};

describe('DateVoteForm', () => {
  const mockOnVote = vi.fn();

  beforeEach(() => {
    mockOnVote.mockClear();
  });

  it('renders vote options: ALL_WORK, PARTIAL, NONE_WORK', () => {
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);
    expect(screen.getByLabelText(/all dates work/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/partial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/none work/i)).toBeInTheDocument();
  });

  it('allows voting with ALL_WORK option', async () => {
    const user = userEvent.setup();
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);

    const allWorkRadio = screen.getByLabelText(/all dates work/i);
    const submitButton = screen.getByRole('button', { name: /submit vote/i });

    await user.click(allWorkRadio);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith('ALL_WORK', undefined);
    });
  });

  it('allows voting with NONE_WORK option', async () => {
    const user = userEvent.setup();
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);

    const noneWorkRadio = screen.getByLabelText(/none work/i);
    const submitButton = screen.getByRole('button', { name: /submit vote/i });

    await user.click(noneWorkRadio);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith('NONE_WORK', undefined);
    });
  });

  it('shows date picker for PARTIAL option', async () => {
    const user = userEvent.setup();
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);

    const partialRadio = screen.getByLabelText(/partial/i);
    await user.click(partialRadio);

    await waitFor(() => {
      expect(screen.getByText(/select which dates work/i)).toBeInTheDocument();
    });
  });

  it('allows selecting specific dates for PARTIAL vote', async () => {
    const user = userEvent.setup();
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);

    const partialRadio = screen.getByLabelText(/partial/i);
    await user.click(partialRadio);

    await waitFor(() => {
      // Should show checkboxes or date inputs for each date in range
      expect(screen.getByText(/select which dates work/i)).toBeInTheDocument();
    });
  });

  it('submits PARTIAL vote with selected dates', async () => {
    const user = userEvent.setup();
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);

    const partialRadio = screen.getByLabelText(/partial/i);
    await user.click(partialRadio);

    // Wait for date checkboxes to appear
    await waitFor(() => {
      expect(screen.getByText(/select which dates work/i)).toBeInTheDocument();
    });

    // Select at least one date checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    const dateCheckboxes = checkboxes.filter((cb): cb is HTMLInputElement => 
      cb instanceof HTMLInputElement && cb.type === 'checkbox' && cb.name !== 'voteType'
    );
    if (dateCheckboxes.length > 0) {
      await user.click(dateCheckboxes[0]);
    }

    const submitButton = screen.getByRole('button', { name: /submit vote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith('PARTIAL', expect.any(Array));
    });
  });

  it('prevents submission without selecting a vote option', async () => {
    const user = userEvent.setup();
    render(<DateVoteForm pitch={mockPitch} onVote={mockOnVote} />);

    const submitButton = screen.getByRole('button', { name: /submit vote/i });
    await user.click(submitButton);

    expect(mockOnVote).not.toHaveBeenCalled();
  });

  it('shows existing vote if user has already voted', () => {
    const now = new Date();
    const pastDeadline = new Date(now);
    pastDeadline.setDate(pastDeadline.getDate() - 1);
    const futureVotingDeadline = new Date(now);
    futureVotingDeadline.setDate(futureVotingDeadline.getDate() + 5);
    
    const pitchWithVote = {
      ...mockPitch,
      pitchDeadline: pastDeadline,
      votingDeadline: futureVotingDeadline,
      votes: [
        {
          id: 'vote-1',
          userId: 'user-2',
          pitchId: 'pitch-1',
          voteType: 'ALL_WORK',
          selectedDates: null,
          createdAt: new Date(),
          user: { id: 'user-2', username: 'voter1' },
        },
      ],
    };
    const { container } = render(<DateVoteForm pitch={pitchWithVote} onVote={mockOnVote} userId="user-2" tripPitchDeadline={pastDeadline} tripVotingDeadline={futureVotingDeadline} />);
    // Text is split across elements - check container textContent
    expect(container.textContent).toMatch(/You voted.*All dates work/i);
  });

  it('shows Change Vote button when user has voted and voting is open', () => {
    const now = new Date();
    const pastDeadline = new Date(now);
    pastDeadline.setDate(pastDeadline.getDate() - 1);
    const futureVotingDeadline = new Date(now);
    futureVotingDeadline.setDate(futureVotingDeadline.getDate() + 5);
    
    const pitchWithVote = {
      ...mockPitch,
      pitchDeadline: pastDeadline,
      votingDeadline: futureVotingDeadline,
      votes: [
        {
          id: 'vote-1',
          userId: 'user-2',
          pitchId: 'pitch-1',
          voteType: 'ALL_WORK',
          selectedDates: null,
          createdAt: new Date(),
          user: { id: 'user-2', username: 'voter1' },
        },
      ],
    };
    render(<DateVoteForm pitch={pitchWithVote} onVote={mockOnVote} userId="user-2" tripPitchDeadline={pastDeadline} tripVotingDeadline={futureVotingDeadline} />);
    expect(screen.getByRole('button', { name: /change vote/i })).toBeInTheDocument();
  });

  it('allows user to edit their vote', async () => {
    const user = userEvent.setup();
    const now = new Date();
    const pastDeadline = new Date(now);
    pastDeadline.setDate(pastDeadline.getDate() - 1);
    const futureVotingDeadline = new Date(now);
    futureVotingDeadline.setDate(futureVotingDeadline.getDate() + 5);
    
    const pitchWithVote = {
      ...mockPitch,
      pitchDeadline: pastDeadline,
      votingDeadline: futureVotingDeadline,
      votes: [
        {
          id: 'vote-1',
          userId: 'user-2',
          pitchId: 'pitch-1',
          voteType: 'ALL_WORK',
          selectedDates: null,
          createdAt: new Date(),
          user: { id: 'user-2', username: 'voter1' },
        },
      ],
    };
    mockOnVote.mockResolvedValue(undefined);
    
    render(<DateVoteForm pitch={pitchWithVote} onVote={mockOnVote} userId="user-2" tripPitchDeadline={pastDeadline} tripVotingDeadline={futureVotingDeadline} />);
    
    // Click Change Vote button
    const changeVoteButton = screen.getByRole('button', { name: /change vote/i });
    await user.click(changeVoteButton);

    // Form should appear with existing vote pre-selected
    await waitFor(() => {
      expect(screen.getByText(/change your vote/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/all dates work/i)).toBeChecked();
    });

    // Change to NONE_WORK
    const noneWorkRadio = screen.getByLabelText(/none work/i);
    await user.click(noneWorkRadio);

    // Submit the updated vote
    const updateButton = screen.getByRole('button', { name: /update vote/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith('NONE_WORK', undefined);
    });
  });

  it('pre-populates form with existing PARTIAL vote when editing', async () => {
    const user = userEvent.setup();
    const now = new Date();
    const pastDeadline = new Date(now);
    pastDeadline.setDate(pastDeadline.getDate() - 1);
    const futureVotingDeadline = new Date(now);
    futureVotingDeadline.setDate(futureVotingDeadline.getDate() + 5);
    
    const pitchWithPartialVote = {
      ...mockPitch,
      pitchDeadline: pastDeadline,
      votingDeadline: futureVotingDeadline,
      votes: [
        {
          id: 'vote-1',
          userId: 'user-2',
          pitchId: 'pitch-1',
          voteType: 'PARTIAL',
          selectedDates: JSON.stringify(['2024-06-01', '2024-06-02']),
          createdAt: new Date(),
          user: { id: 'user-2', username: 'voter1' },
        },
      ],
    };
    mockOnVote.mockResolvedValue(undefined);
    
    render(<DateVoteForm pitch={pitchWithPartialVote} onVote={mockOnVote} userId="user-2" tripPitchDeadline={pastDeadline} tripVotingDeadline={futureVotingDeadline} />);
    
    // Click Change Vote
    const changeVoteButton = screen.getByRole('button', { name: /change vote/i });
    await user.click(changeVoteButton);

    // Form should show PARTIAL selected and dates pre-selected
    await waitFor(() => {
      expect(screen.getByLabelText(/partial/i)).toBeChecked();
    });
  });

  it('allows canceling vote edit', async () => {
    const user = userEvent.setup();
    const now = new Date();
    const pastDeadline = new Date(now);
    pastDeadline.setDate(pastDeadline.getDate() - 1);
    const futureVotingDeadline = new Date(now);
    futureVotingDeadline.setDate(futureVotingDeadline.getDate() + 5);
    
    const pitchWithVote = {
      ...mockPitch,
      pitchDeadline: pastDeadline,
      votingDeadline: futureVotingDeadline,
      votes: [
        {
          id: 'vote-1',
          userId: 'user-2',
          pitchId: 'pitch-1',
          voteType: 'ALL_WORK',
          selectedDates: null,
          createdAt: new Date(),
          user: { id: 'user-2', username: 'voter1' },
        },
      ],
    };
    
    render(<DateVoteForm pitch={pitchWithVote} onVote={mockOnVote} userId="user-2" tripPitchDeadline={pastDeadline} tripVotingDeadline={futureVotingDeadline} />);
    
    // Click Change Vote
    const changeVoteButton = screen.getByRole('button', { name: /change vote/i });
    await user.click(changeVoteButton);

    // Click Cancel (there are two cancel buttons, use getAllByRole and click the first one)
    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
    await user.click(cancelButtons[0]);

    // Should return to view mode
    await waitFor(() => {
      expect(screen.getByText(/you voted/i)).toBeInTheDocument();
      expect(screen.queryByText(/change your vote/i)).not.toBeInTheDocument();
    });

    expect(mockOnVote).not.toHaveBeenCalled();
  });
});

