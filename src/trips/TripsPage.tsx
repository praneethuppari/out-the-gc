import { type AuthUser } from "wasp/auth";
import { useQuery, getTrips } from "wasp/client/operations";
import { TripList } from "./components/TripList";
import { CreateTripForm } from "./components/CreateTripForm";
import type { TripWithParticipants } from "./types";

export const TripsPage = ({ user }: { user: AuthUser }) => {
  const { data: trips, isLoading } = useQuery(getTrips) as { data: TripWithParticipants[] | undefined; isLoading: boolean };

  // TODO: Implement trips page
  // - Show list of user's trips
  // - Show create trip form/modal
  // - Handle navigation to trip dashboard

  if (isLoading) {
    return <div className="p-8">Loading trips...</div>;
  }

  return (
    <div className="flex flex-col gap-8 px-8 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Trips</h1>
      </div>
      <div className="flex flex-col gap-6">
        <section className="card p-6">
          <CreateTripForm />
        </section>
        <section>
          <TripList trips={trips || []} />
        </section>
      </div>
    </div>
  );
};

