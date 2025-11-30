import type { TripWithParticipants } from "../types";
import { TripCard } from "./TripCard";

type TripListProps = {
  trips: TripWithParticipants[];
};

export function TripList({ trips }: TripListProps) {
  // TODO: Implement trip list component
  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No trips yet. Create your first trip!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}

