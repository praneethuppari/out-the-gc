import type { DatePitchWithVotes } from "../types";

type DatePitchCardProps = {
  pitch: DatePitchWithVotes;
};

export function DatePitchCard({ pitch }: DatePitchCardProps) {
  // TODO: Implement date pitch card component
  const startDate = new Date(pitch.startDate);
  const endDate = new Date(pitch.endDate);
  
  return (
    <div className="card p-4">
      <h4 className="font-semibold">
        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
      </h4>
      {pitch.description && <p className="text-sm text-gray-600">{pitch.description}</p>}
      <p className="text-xs text-gray-500 mt-2">
        {pitch.votes.length} vote{pitch.votes.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

