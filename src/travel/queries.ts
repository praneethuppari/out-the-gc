import { HttpError } from "wasp/server";
import type { TravelConfirmationWithUser } from "./types";

type GetTravelConfirmationsArgs = {
  tripId: string;
};

export const getTravelConfirmations = async (
  { tripId }: GetTravelConfirmationsArgs,
  context: any,
): Promise<TravelConfirmationWithUser[]> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement query to get travel confirmations for a trip
  return [];
};

