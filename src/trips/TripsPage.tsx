import { type AuthUser } from "wasp/auth";
import { useQuery, getTrips } from "wasp/client/operations";
import { TripList } from "./components/TripList";
import { CreateTripForm } from "./components/CreateTripForm";
import type { TripWithParticipants } from "./types";

export const TripsPage = ({ user }: { user: AuthUser }) => {
  const { data: trips, isLoading } = useQuery(getTrips) as { data: TripWithParticipants[] | undefined; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pt-20 sm:pt-24">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating travel icons */}
        <div className="absolute top-20 right-10 text-4xl opacity-20 animate-float" style={{ animationDelay: "0s" }}>✈️</div>
        <div className="absolute top-40 left-10 text-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}>🌍</div>
        <div className="absolute bottom-40 right-20 text-3xl opacity-20 animate-float" style={{ animationDelay: "4s" }}>🗺️</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>🎒</div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl sm:text-6xl font-black">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                My Trips
              </span>
            </h1>
            <div className="text-4xl animate-bounce" style={{ animationDuration: "2s" }}>✈️</div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
            <span>🗺️</span>
            <span>Your collection of adventures and memories</span>
          </p>
        </div>

        {/* Create Trip Form Section */}
        <div className="mb-12">
          <CreateTripForm />
        </div>

        {/* Trips Collection */}
        <section>
          <TripList trips={trips || []} currentUserId={user.id} />
        </section>
      </div>
    </div>
  );
};

