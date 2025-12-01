import { type AuthUser } from "wasp/auth";
import { useQuery, getTrip } from "wasp/client/operations";
import { useParams, Link } from "react-router-dom";
import { DashboardNavbar } from "../shared/components/DashboardNavbar";
import { RSVPSelector } from "./components/RSVPSelector";
import { ParticipantsList } from "./components/ParticipantsList";
import { PlanningPhaseIndicator } from "./components/PlanningPhaseIndicator";
import { PlanningPhaseContent } from "./components/PlanningPhaseContent";
import { CompletedTripView } from "./components/CompletedTripView";
import { ActivityFeed } from "../activity/components/ActivityFeed";
import { ShareTripLink } from "./components/ShareTripLink";
import type { TripWithParticipants, PlanningPhase, RSVPStatus } from "./types";

export const DashboardPage = ({ user }: { user: AuthUser }) => {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading } = useQuery(getTrip, { tripId: tripId! }) as {
    data: TripWithParticipants | null | undefined;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <DashboardNavbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-white">Loading trip...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <DashboardNavbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
              <Link
                to="/trips"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Back to trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentParticipant = trip.participants.find((p) => p.userId === user.id);
  const currentRSVP = (currentParticipant?.rsvpStatus as RSVPStatus) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <DashboardNavbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative mb-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {trip.coverPhoto ? (
              <div className="relative h-64 sm:h-80 lg:h-96">
                <img
                  src={trip.coverPhoto}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                  data-testid="trip-cover-photo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>
            ) : (
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
                {trip.title}
              </h1>
              {trip.description && (
                <p className="text-lg sm:text-xl text-gray-200 max-w-3xl">
                  {trip.description}
                </p>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Main Planning Content */}
            <div className="lg:col-span-2 space-y-6">
              {trip.phase === 'COMPLETED' ? (
                <CompletedTripView trip={trip} />
              ) : (
                <>
                  <PlanningPhaseIndicator phase={trip.phase as PlanningPhase} />
                  <PlanningPhaseContent trip={trip} currentUserId={user.id} />
                </>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <RSVPSelector tripId={trip.id} currentStatus={currentRSVP} />
              <ShareTripLink joinToken={trip.joinToken} />
              <ParticipantsList participants={trip.participants} />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="mt-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <ActivityFeed tripId={trip.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

