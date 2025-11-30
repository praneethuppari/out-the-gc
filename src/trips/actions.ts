import { type Trip } from "wasp/entities";
import { HttpError } from "wasp/server";

type CreateTripArgs = {
  title: string;
  description?: string;
  coverPhoto?: string;
};

export const createTrip = async (
  args: CreateTripArgs,
  context: any,
): Promise<Trip> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement trip creation
  // - Generate unique joinToken
  // - Create trip with organizer
  // - Create TripParticipant with ORGANIZER role and GOING status
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
};

type UpdateTripArgs = {
  tripId: string;
  title?: string;
  description?: string;
  coverPhoto?: string;
};

export const updateTrip = async (
  args: UpdateTripArgs,
  context: any,
): Promise<Trip> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement trip update (only organizer can update)
  throw new HttpError(501, "Not implemented");
};

type DeleteTripArgs = {
  tripId: string;
};

export const deleteTrip = async (
  args: DeleteTripArgs,
  context: any,
): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement trip deletion (only organizer can delete)
  throw new HttpError(501, "Not implemented");
};

type JoinTripArgs = {
  token: string;
  rsvpStatus: "GOING" | "INTERESTED" | "NOT_GOING";
};

export const joinTrip = async (
  args: JoinTripArgs,
  context: any,
): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement join trip flow
  // - Find trip by token
  // - Create or update TripParticipant
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
};

type UpdateRSVPArgs = {
  tripId: string;
  rsvpStatus: "GOING" | "INTERESTED" | "NOT_GOING";
};

export const updateRSVP = async (
  args: UpdateRSVPArgs,
  context: any,
): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement RSVP update
  // - Update TripParticipant rsvpStatus
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
};

