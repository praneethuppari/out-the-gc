import { HttpError } from "wasp/server";
import type { ActivityWithUser } from "./types";

type GetActivitiesArgs = {
  tripId: string;
  limit?: number;
};

export const getActivities = async (
  { tripId, limit = 50 }: GetActivitiesArgs,
  context: any,
): Promise<ActivityWithUser[]> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement query to get activities for a trip
  // - Order by createdAt desc
  // - Limit results
  return [];
};

