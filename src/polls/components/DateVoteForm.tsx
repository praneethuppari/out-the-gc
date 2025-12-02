import { useState, useMemo, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import type { DatePitchWithVotes } from "../types";
import type { DateVoteType } from "../types";
import { Button } from '../../shared/components/Button';

type DateVoteFormProps = {
  pitch: DatePitchWithVotes;
  onVote: (voteType: DateVoteType, selectedDates?: string[]) => void;
  userId?: string;
  tripPitchDeadline?: Date | null;
  tripVotingDeadline?: Date | null;
};

function generateDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current).toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function DateVoteForm({ pitch, onVote, userId, tripPitchDeadline, tripVotingDeadline }: DateVoteFormProps) {
  const { data: user } = useAuth();
  const currentUserId = userId || user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVoteType, setSelectedVoteType] = useState<DateVoteType | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has already voted
  const existingVote = useMemo(() => {
    if (!currentUserId) return null;
    return pitch.votes.find((v) => v.userId === currentUserId);
  }, [pitch.votes, currentUserId]);

  // Initialize form with existing vote when editing
  useEffect(() => {
    if (existingVote && isEditing) {
      setSelectedVoteType(existingVote.voteType as DateVoteType);
      if (existingVote.voteType === 'PARTIAL' && existingVote.selectedDates) {
        try {
          const dates = JSON.parse(existingVote.selectedDates);
          setSelectedDates(new Set(dates));
        } catch (e) {
          setSelectedDates(new Set());
        }
      } else {
        setSelectedDates(new Set());
      }
    } else if (!isEditing) {
      // Reset form when not editing
      setSelectedVoteType(null);
      setSelectedDates(new Set());
    }
  }, [existingVote, isEditing]);

  // Generate date range for PARTIAL selection
  const dateRange = useMemo(() => {
    const start = new Date(pitch.startDate);
    const end = new Date(pitch.endDate);
    return generateDateRange(start, end);
  }, [pitch.startDate, pitch.endDate]);

  // Check if voting is open - use trip-level deadlines if provided
  const now = new Date();
  const pitchDeadline = tripPitchDeadline ? new Date(tripPitchDeadline) : new Date(pitch.pitchDeadline);
  const votingDeadline = tripVotingDeadline ? new Date(tripVotingDeadline) : new Date(pitch.votingDeadline);
  const isVotingOpen = now >= pitchDeadline && now < votingDeadline;

  if (!isVotingOpen) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <p className="text-sm text-gray-400">
          {now < pitchDeadline
            ? 'Voting will open after the proposal deadline'
            : 'Voting has closed'}
        </p>
      </div>
    );
  }

  // Show existing vote with option to edit (if voting is still open)
  if (existingVote && !isEditing) {
    const voteTypeLabel = existingVote.voteType === 'ALL_WORK' 
      ? 'All dates work'
      : existingVote.voteType === 'PARTIAL'
      ? 'Partial'
      : 'None work';
    
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-white">
              You voted: <span className="font-semibold">{voteTypeLabel}</span>
            </p>
            {existingVote.voteType === 'PARTIAL' && existingVote.selectedDates && (
              <p className="text-xs text-gray-400 mt-1">
                Selected dates: {JSON.parse(existingVote.selectedDates).join(', ')}
              </p>
            )}
          </div>
          {isVotingOpen && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="ml-4 !bg-blue-500/20 hover:!bg-blue-500/30 !text-blue-300 border border-blue-500/50 hover:border-blue-500/70"
            >
              Change Vote
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleVoteTypeChange = (voteType: DateVoteType) => {
    setSelectedVoteType(voteType);
    if (voteType !== 'PARTIAL') {
      setSelectedDates(new Set());
    }
  };

  const handleDateToggle = (date: string) => {
    const newSelected = new Set(selectedDates);
    if (newSelected.has(date)) {
      newSelected.delete(date);
    } else {
      newSelected.add(date);
    }
    setSelectedDates(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoteType) return;

    setIsSubmitting(true);
    try {
      const datesArray =
        selectedVoteType === 'PARTIAL' && selectedDates.size > 0
          ? Array.from(selectedDates)
          : undefined;

      await onVote(selectedVoteType, datesArray);
      setIsEditing(false);
      setSelectedVoteType(null);
      setSelectedDates(new Set());
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedVoteType(null);
    setSelectedDates(new Set());
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h4 className="font-semibold text-white mb-4">
        {isEditing ? 'Change Your Vote' : 'Vote on this date range'}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="voteType"
              value="ALL_WORK"
              checked={selectedVoteType === 'ALL_WORK'}
              onChange={() => handleVoteTypeChange('ALL_WORK')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-white">All dates work</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="voteType"
              value="PARTIAL"
              checked={selectedVoteType === 'PARTIAL'}
              onChange={() => handleVoteTypeChange('PARTIAL')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-white">Partial - some dates work</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="voteType"
              value="NONE_WORK"
              checked={selectedVoteType === 'NONE_WORK'}
              onChange={() => handleVoteTypeChange('NONE_WORK')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-white">None work</span>
          </label>
        </div>

        {selectedVoteType === 'PARTIAL' && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-300 mb-3">Select which dates work for you:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {dateRange.map((date) => {
                const dateObj = new Date(date);
                const isSelected = selectedDates.has(date);
                return (
                  <label
                    key={date}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                      isSelected
                        ? 'bg-primary-500/30 border-primary-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleDateToggle(date)}
                      className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">
                      {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </label>
                );
              })}
            </div>
            {selectedDates.size === 0 && selectedVoteType === 'PARTIAL' && (
              <p className="text-xs text-yellow-400 mt-2">
                Please select at least one date
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!selectedVoteType || isSubmitting || (selectedVoteType === 'PARTIAL' && selectedDates.size === 0)}
            className={isEditing ? "flex-1" : "w-full"}
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Vote' : 'Submit Vote'}
          </Button>
        </div>
      </form>
    </div>
  );
}

