import { type AuthUser } from "wasp/auth";
import { useQuery, getTripByJoinToken } from "wasp/client/operations";
import { useParams } from "react-router-dom";
import type { TripWithParticipants } from "../types";

export const JoinTripPage = ({ user }: { user: AuthUser }) => {
  const { token } = useParams<{ token: string }>();
  const { data: trip, isLoading } = useQuery(getTripByJoinToken, { token: token! }) as { data: TripWithParticipants | null | undefined; isLoading: boolean };

  // TODO: Implement join trip page
  // - Show trip details
  // - Allow user to select RSVP status (Going / Interested / Not Going)
  // - Handle join action

  if (isLoading) {
    return <div className="p-8">Loading trip...</div>;
  }

  if (!trip) {
    return <div className="p-8">Trip not found or invalid join link</div>;
  }

  return (
    <div className="flex flex-col gap-8 px-8 py-12">
      <h1 className="text-4xl font-bold">Join Trip: {trip.title}</h1>
      <div className="card p-6">
        <p className="text-gray-600">Join form implementation coming soon...</p>
      </div>
    </div>
  );
};

