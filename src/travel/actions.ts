import { type TravelConfirmation } from "wasp/entities";
import { HttpError } from "wasp/server";

type ConfirmTravelArgs = {
  tripId: string;
  isBooked: boolean;
  notes?: string;
};

export const confirmTravel = async (
  args: ConfirmTravelArgs,
  context: any,
): Promise<TravelConfirmation> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement travel confirmation
  // - Create or update TravelConfirmation
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
};

