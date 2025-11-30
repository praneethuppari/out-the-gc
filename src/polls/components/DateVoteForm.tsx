import type { DatePitchWithVotes } from "../types";
import type { DateVoteType } from "../types";

type DateVoteFormProps = {
  pitch: DatePitchWithVotes;
  onVote: (voteType: DateVoteType, selectedDates?: string[]) => void;
};

export function DateVoteForm({ pitch, onVote }: DateVoteFormProps) {
  // TODO: Implement date vote form
  // - Radio buttons for ALL_WORK, PARTIAL, NONE_WORK
  // - Date picker for PARTIAL votes
  return (
    <div className="card p-4">
      <h4 className="font-semibold mb-2">Vote on this date range</h4>
      <p className="text-gray-600">Vote form implementation coming soon...</p>
    </div>
  );
}

