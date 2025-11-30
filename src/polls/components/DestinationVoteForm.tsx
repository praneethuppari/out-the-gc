import type { DestinationPitchWithVotes } from "../types";

type DestinationVoteFormProps = {
  pitches: DestinationPitchWithVotes[];
  onVote: (rankings: { pitchId: string; ranking: number }[]) => void;
};

export function DestinationVoteForm({ pitches, onVote }: DestinationVoteFormProps) {
  // TODO: Implement destination vote form (ranked choice)
  // - Allow user to rank all pitches
  return (
    <div className="card p-4">
      <h4 className="font-semibold mb-2">Rank Your Destinations</h4>
      <p className="text-gray-600">Ranked choice voting form implementation coming soon...</p>
    </div>
  );
}

