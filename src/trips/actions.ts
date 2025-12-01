import { type Trip } from "wasp/entities";
import { HttpError } from "wasp/server";

type CreateTripArgs = {
  title: string;
  description?: string;
  coverPhoto?: string;
};

/**
 * Generates a unique join token for the trip
 */
function generateJoinToken(): string {
  // Generate a random token using crypto if available, otherwise fallback
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export const createTrip = async (
  args: CreateTripArgs,
  context: any,
): Promise<Trip> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip, TripParticipant, Activity } = context.entities;

  try {
    // Generate unique joinToken
    let joinToken = generateJoinToken();
    let tokenExists = true;
    let attempts = 0;
    
    // Ensure token is unique (retry if collision)
    while (tokenExists && attempts < 10) {
      const existing = await Trip.findUnique({
        where: { joinToken },
      });
      if (!existing) {
        tokenExists = false;
      } else {
        joinToken = generateJoinToken();
        attempts++;
      }
    }

    if (tokenExists) {
      throw new HttpError(500, "Failed to generate unique join token");
    }

    // Create trip with organizer
    const trip = await Trip.create({
      data: {
        title: args.title,
        description: args.description || null,
        coverPhoto: args.coverPhoto || null,
        joinToken,
        phase: "DATES",
        organizerId: context.user.id,
      },
    });

    // Create TripParticipant with ORGANIZER role and GOING status
    await TripParticipant.create({
      data: {
        tripId: trip.id,
        userId: context.user.id,
        rsvpStatus: "GOING",
        role: "ORGANIZER",
      },
    });

    // Create activity entry
    await Activity.create({
      data: {
        tripId: trip.id,
        userId: context.user.id,
        type: "TRIP_CREATED",
        metadata: JSON.stringify({ tripTitle: args.title }),
      },
    });

    return trip;
  } catch (error) {
    console.error("Error creating trip:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to create trip");
  }
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

