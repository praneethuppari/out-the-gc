import type { TripWithParticipants } from "../types";

type TripCardProps = {
  trip: TripWithParticipants;
};

export function TripCard({ trip }: TripCardProps) {
  // TODO: Implement trip card component
  return (
    <div className="card p-4">
      <h3 className="text-xl font-semibold">{trip.title}</h3>
      <p className="text-sm text-gray-600">{trip.description || "No description"}</p>
    </div>
  );
}

