import type { DestinationPitchWithVotes } from "../types";

type DestinationPitchCardProps = {
  pitch: DestinationPitchWithVotes;
};

export function DestinationPitchCard({ pitch }: DestinationPitchCardProps) {
  // TODO: Implement destination pitch card component
  return (
    <div className="card p-4">
      <h4 className="font-semibold">{pitch.location}</h4>
      <p className="text-sm text-gray-600 mt-2">{pitch.description}</p>
      <p className="text-xs text-gray-500 mt-2">
        {pitch.votes.length} vote{pitch.votes.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

