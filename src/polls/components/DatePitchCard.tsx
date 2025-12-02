import type { DatePitchWithVotes } from "../types";
import { VoteResults } from "./VoteResults";

type DatePitchCardProps = {
  pitch: DatePitchWithVotes;
  tripPitchDeadline?: Date | null;
  tripVotingDeadline?: Date | null;
};

function calculateNightsAndDays(startDate: Date, endDate: Date): { nights: number; days: number } {
  // Normalize dates to midnight local time to avoid timezone issues
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const nights = Math.max(0, diffDays - 1);
  const days = Math.max(1, diffDays);
  return { nights, days };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DatePitchCard({ pitch, tripPitchDeadline, tripVotingDeadline }: DatePitchCardProps) {
  const startDate = new Date(pitch.startDate);
  const endDate = new Date(pitch.endDate);
  const { nights, days } = calculateNightsAndDays(startDate, endDate);

  const now = new Date();
  // Use trip-level deadlines if provided, otherwise fall back to pitch-level (for backward compatibility)
  const pitchDeadline = tripPitchDeadline ? new Date(tripPitchDeadline) : new Date(pitch.pitchDeadline);
  const votingDeadline = tripVotingDeadline ? new Date(tripVotingDeadline) : new Date(pitch.votingDeadline);
  
  const isProposalPhase = now < pitchDeadline;
  const isVotingPhase = now >= pitchDeadline && now < votingDeadline;
  const isVotingClosed = now >= votingDeadline;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white text-lg">
            {formatDate(startDate)} - {formatDate(endDate)}
          </h4>
          <p className="text-sm text-gray-300 mt-1">
            <span className="font-medium">{nights}</span> night{nights !== 1 ? 's' : ''} /{' '}
            <span className="font-medium">{days}</span> day{days !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isProposalPhase && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              Proposals Open
            </span>
          )}
          {isVotingPhase && (
            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
              Voting Open
            </span>
          )}
          {isVotingClosed && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-full border border-gray-500/30">
              Voting Closed
            </span>
          )}
        </div>
      </div>

      {pitch.description && (
        <p className="text-sm text-gray-300 mb-3">{pitch.description}</p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          <span className="font-medium text-white">{pitch.votes.length}</span> vote{pitch.votes.length !== 1 ? 's' : ''}
        </div>
        <div>
          Proposed by <span className="font-medium text-white">{pitch.pitchedBy.username}</span>
        </div>
      </div>

      {isVotingClosed && pitch.votes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <VoteResults pitch={pitch} />
        </div>
      )}
    </div>
  );
}

