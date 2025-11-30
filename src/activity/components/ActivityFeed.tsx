import { useQuery, getActivities } from "wasp/client/operations";
import type { ActivityWithUser } from "../types";

type ActivityFeedProps = {
  tripId: string;
};

export function ActivityFeed({ tripId }: ActivityFeedProps) {
  const { data: activities, isLoading } = useQuery(getActivities, { tripId }) as { data: ActivityWithUser[] | undefined; isLoading: boolean };

  // TODO: Implement activity feed component
  // - Display activities in chronological order
  // - Show user avatar, activity type, timestamp
  // - Format different activity types appropriately

  if (isLoading) {
    return <div className="text-gray-600">Loading activities...</div>;
  }

  if (!activities || activities.length === 0) {
    return <div className="text-gray-600">No activities yet</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {activities.map((activity) => (
        <div key={activity.id} className="card p-4">
          <p className="text-sm text-gray-600">
            {activity.user.username} - {activity.type}
          </p>
        </div>
      ))}
    </div>
  );
}

