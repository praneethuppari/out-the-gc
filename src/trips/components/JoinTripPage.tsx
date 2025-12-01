import { useEffect, useState } from "react";
import { useAuth } from "wasp/client/auth";
import { useQuery, useAction, getTripByJoinToken, joinTrip } from "wasp/client/operations";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardNavbar } from "../../shared/components/DashboardNavbar";
import { LandingNavbar } from "../../landing/components/LandingNavbar";
import { RSVPSelector } from "./RSVPSelector";
import type { TripWithParticipants, RSVPStatus } from "../types";

const PENDING_JOIN_KEY = "pendingTripJoin";

type PendingJoin = {
  token: string;
  rsvpStatus: RSVPStatus;
};

export const JoinTripPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const { data: trip, isLoading, refetch: refetchTrip } = useQuery(getTripByJoinToken, { token: token! }) as {
    data: TripWithParticipants | null | undefined;
    isLoading: boolean;
    refetch: () => Promise<any>;
  };
  const joinTripMutation = useAction(joinTrip);
  const [selectedRSVP, setSelectedRSVP] = useState<RSVPStatus | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentParticipant = user && trip?.participants.find((p) => p.userId === user.id);
  const currentRSVP = (currentParticipant?.rsvpStatus as RSVPStatus) || selectedRSVP || null;

  const handleJoinTrip = async (rsvpStatus: RSVPStatus) => {
    if (!token) {
      setError("Invalid join token");
      return;
    }

    setIsJoining(true);
    setError(null);
    try {
      console.log("Calling joinTripMutation with:", { token, rsvpStatus });
      await joinTripMutation({
        token,
        rsvpStatus,
      });
      console.log("Join trip mutation succeeded");
      // Refetch trip data to get updated participant list
      await refetchTrip();
      // Redirect to trip dashboard after joining
      if (trip) {
        navigate(`/trips/${trip.id}`);
      } else {
        setError("Trip not found after joining");
        setIsJoining(false);
      }
    } catch (error: any) {
      console.error("Failed to join trip:", error);
      const errorMessage = error?.message || error?.toString() || "Failed to join trip. Please try again.";
      setError(errorMessage);
      setIsJoining(false);
    }
  };

  // Check for pending join after auth
  useEffect(() => {
    if (user && token && trip && !isJoining && !currentParticipant) {
      const pendingJoinStr = localStorage.getItem(PENDING_JOIN_KEY);
      if (pendingJoinStr) {
        try {
          const pendingJoin: PendingJoin = JSON.parse(pendingJoinStr);
          if (pendingJoin.token === token) {
            // Complete the join
            handleJoinTrip(pendingJoin.rsvpStatus);
            localStorage.removeItem(PENDING_JOIN_KEY);
          }
        } catch (error) {
          console.error("Error parsing pending join:", error);
          localStorage.removeItem(PENDING_JOIN_KEY);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, trip, currentParticipant]);

  const handleRSVPChange = async (newStatus: RSVPStatus) => {
    if (!token) {
      setError("Invalid join token");
      return;
    }
    
    // Prevent clicking the same status
    if (newStatus === currentRSVP) {
      console.log("Status unchanged, skipping update");
      return;
    }

    console.log("handleRSVPChange called with:", { newStatus, currentRSVP, user: !!user });

    // Clear any previous errors
    setError(null);

    // If user is not authenticated, store selection and redirect to signup
    if (!user) {
      const pendingJoin: PendingJoin = {
        token,
        rsvpStatus: newStatus,
      };
      localStorage.setItem(PENDING_JOIN_KEY, JSON.stringify(pendingJoin));
      setSelectedRSVP(newStatus);
      // Redirect to signup with return URL
      navigate(`/signup?redirect=/join/${token}`);
      return;
    }

    // If user is authenticated, join immediately
    try {
      await handleJoinTrip(newStatus);
    } catch (error) {
      // Error is already handled in handleJoinTrip
      console.error("Error in handleRSVPChange:", error);
    }
  };

  const Navbar = user ? DashboardNavbar : LandingNavbar;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            Loading trip...
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Trip Not Found</h1>
            <p className="text-gray-400 mb-6">
              This join link is invalid or the trip no longer exists.
            </p>
            {user ? (
              <button
                onClick={() => navigate("/trips")}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all"
              >
                Back to My Trips
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all"
              >
                Go Home
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="relative mb-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {trip.coverPhoto ? (
              <div className="relative h-64 sm:h-80">
                <img
                  src={trip.coverPhoto}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>
            ) : (
              <div className="relative h-64 sm:h-80 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Join Trip
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {trip.title}
              </h2>
              {trip.description && (
                <p className="text-lg text-gray-200 max-w-3xl">
                  {trip.description}
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Trip Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Trip Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Organized by</p>
                    <p className="text-white font-medium">{trip.organizer.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Planning Phase</p>
                    <p className="text-white font-medium">
                      {trip.phase === "DATES"
                        ? "Choosing Dates"
                        : trip.phase === "DESTINATION"
                        ? "Choosing Destination"
                        : trip.phase === "TRAVEL_CONFIRMATION"
                        ? "Confirming Travel"
                        : "Completed"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Participants</p>
                    <p className="text-white font-medium">{trip.participants.length} member{trip.participants.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Join Form */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Join This Trip</h3>
                <p className="text-sm text-gray-300 mb-6">
                  {user
                    ? "Select your RSVP status to join the trip planning."
                    : "Select your RSVP status, then sign up to join this trip."}
                </p>
                {!user && selectedRSVP && (
                  <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <p className="text-sm text-cyan-400">
                      You've selected "{selectedRSVP === "GOING" ? "Going" : selectedRSVP === "INTERESTED" ? "Interested" : "Not Going"}". 
                      Sign up or log in to complete joining this trip.
                    </p>
                  </div>
                )}
                <RSVPSelector
                  tripId={trip.id}
                  currentStatus={currentRSVP}
                  onRSVPChange={handleRSVPChange}
                />
                {isJoining && (
                  <p className="mt-3 text-sm text-gray-400 text-center">Joining trip...</p>
                )}
                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

