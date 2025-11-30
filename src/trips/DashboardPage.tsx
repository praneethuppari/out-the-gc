import { type AuthUser } from "wasp/auth";
import { useQuery, getTrip } from "wasp/client/operations";
import { useParams } from "react-router-dom";
import type { TripWithParticipants } from "./types";

export const DashboardPage = ({ user }: { user: AuthUser }) => {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading } = useQuery(getTrip, { tripId: tripId! }) as { data: TripWithParticipants | null | undefined; isLoading: boolean };

  // TODO: Implement trip dashboard
  // - Show trip details
  // - Show participants with RSVP badges
  // - Show current planning phase
  // - Show active polls/pitches
  // - Show activity feed

  if (isLoading) {
    return <div className="p-8">Loading trip...</div>;
  }

  if (!trip) {
    return <div className="p-8">Trip not found</div>;
  }

  return (
    <div className="flex flex-col gap-8 px-8 py-12">
      <h1 className="text-4xl font-bold">{trip.title}</h1>
      <div className="card p-6">
        <p className="text-gray-600">Dashboard implementation coming soon...</p>
      </div>
    </div>
  );
};

