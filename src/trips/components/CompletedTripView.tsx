import type { TripWithParticipants } from '../types';

type CompletedTripViewProps = {
  trip: TripWithParticipants;
};

export function CompletedTripView({ trip }: CompletedTripViewProps) {
  return (
    <div
      data-testid="completed-trip-view"
      className="bg-gradient-to-br from-green-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Planning Complete!</h2>
        <p className="text-gray-300">
          All planning phases have been completed. Your trip is ready to go!
        </p>
      </div>

      <div className="bg-white/5 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{trip.title}</h3>
          {trip.description && (
            <p className="text-gray-300">{trip.description}</p>
          )}
        </div>

        {trip.coverPhoto && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={trip.coverPhoto}
              alt={trip.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Organized by <span className="text-white font-medium">{trip.organizer.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

