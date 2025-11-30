import { HttpError } from "wasp/server";
import type { DatePitchWithVotes, DestinationPitchWithVotes } from "./types";

type GetDatePitchesArgs = {
  tripId: string;
};

export const getDatePitches = async (
  { tripId }: GetDatePitchesArgs,
  context: any,
): Promise<DatePitchWithVotes[]> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement query to get all date pitches for a trip with votes
  return [];
};

type GetDestinationPitchesArgs = {
  tripId: string;
};

export const getDestinationPitches = async (
  { tripId }: GetDestinationPitchesArgs,
  context: any,
): Promise<DestinationPitchWithVotes[]> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement query to get all destination pitches for a trip with votes
  return [];
};

