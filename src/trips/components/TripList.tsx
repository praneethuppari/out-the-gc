import type { TripWithParticipants } from "../types";
import { TripCard } from "./TripCard";

type TripListProps = {
  trips: TripWithParticipants[];
  currentUserId: string;
};

/**
 * Generates a height variation for scrapbook collage effect
 */
function getCardHeight(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heights = ["h-[280px]", "h-[320px]", "h-[300px]", "h-[340px]", "h-[290px]"];
  return heights[hash % heights.length];
}

export function TripList({ trips, currentUserId }: TripListProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-6xl opacity-50">✈️</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              No trips yet
            </span>
          </h3>
          <p className="text-gray-400 text-sm">
            Create your first trip and start planning adventures that actually happen!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="trip-list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
    >
      {trips.map((trip, index) => (
        <div
          key={trip.id}
          className={`${getCardHeight(trip.id)} animate-fade-in`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: "both",
          }}
        >
          <TripCard trip={trip} currentUserId={currentUserId} />
        </div>
      ))}
    </div>
  );
}

