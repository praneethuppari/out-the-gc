import type { ActivityWithUser } from "../types";

type ActivityItemProps = {
  activity: ActivityWithUser;
};

export function ActivityItem({ activity }: ActivityItemProps) {
  // TODO: Implement activity item component
  // - Format based on activity type
  // - Show user info and timestamp
  // - Parse metadata if needed
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{activity.user.username}</span>{" "}
          <span className="text-gray-600">{activity.type}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

