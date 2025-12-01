import { Link } from "wasp/client/router";
import type { TripWithParticipants } from "../types";

type TripCardProps = {
  trip: TripWithParticipants;
  currentUserId: string;
};

/**
 * Generates a consistent rotation angle based on trip ID for scrapbook effect
 */
function getRotationAngle(id: string): number {
  // Use trip ID to generate consistent rotation between -3 and 3 degrees
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 7) - 3; // Range: -3 to 3 degrees
}

/**
 * Gets RSVP status for current user
 */
function getUserRSVPStatus(trip: TripWithParticipants, userId: string): string | null {
  const participant = trip.participants.find((p) => p.userId === userId);
  return participant?.rsvpStatus || null;
}

/**
 * Checks if user is organizer
 */
function isOrganizer(trip: TripWithParticipants, userId: string): boolean {
  return trip.organizerId === userId;
}

/**
 * Gets gradient colors based on trip ID for consistent fallback backgrounds
 */
function getGradientColors(id: string): string {
  const gradients = [
    "from-cyan-500/20 via-purple-500/20 to-pink-500/20",
    "from-purple-500/20 via-pink-500/20 to-cyan-500/20",
    "from-pink-500/20 via-cyan-500/20 to-purple-500/20",
  ];
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

export function TripCard({ trip, currentUserId }: TripCardProps) {
  const rotation = getRotationAngle(trip.id);
  const rsvpStatus = getUserRSVPStatus(trip, currentUserId);
  const userIsOrganizer = isOrganizer(trip, currentUserId);
  const gradientColors = getGradientColors(trip.id);

  const rsvpBadgeColors = {
    GOING: "bg-green-500/80 text-white",
    INTERESTED: "bg-yellow-500/80 text-white",
    NOT_GOING: "bg-red-500/80 text-white",
  };

  return (
    <Link
      to={`/trips/${trip.id}` as any}
      data-testid="trip-card"
      className="group relative block h-full transition-all duration-300 hover:scale-105 hover:z-10"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative h-full min-h-[280px] rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300">
        {/* Cover Photo or Gradient Background */}
        {trip.coverPhoto ? (
          <div className="absolute inset-0">
            <img
              src={trip.coverPhoto}
              alt={trip.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors}`}>
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-6 text-white">
          {/* Top Section - Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {userIsOrganizer && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg">
                  Organizer
                </span>
              )}
              {rsvpStatus && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${rsvpBadgeColors[rsvpStatus as keyof typeof rsvpBadgeColors]} shadow-lg`}
                >
                  {rsvpStatus === "GOING" ? "Going" : rsvpStatus === "INTERESTED" ? "Interested" : "Not Going"}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Section - Title and Description */}
          <div className="mt-auto">
            <h3 className="text-2xl font-black mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
              {trip.title}
            </h3>
            {trip.description && (
              <p className="text-sm text-gray-300 line-clamp-2 opacity-90">
                {trip.description}
              </p>
            )}
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-50" />
      </div>
    </Link>
  );
}

