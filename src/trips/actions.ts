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

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip, TripParticipant, Activity } = context.entities;

  try {
    // Find trip by join token
    const trip = await Trip.findUnique({
      where: { joinToken: args.token },
    });

    if (!trip) {
      throw new HttpError(404, "Trip not found or invalid join link");
    }

    // Check if user is already a participant
    const existingParticipant = await TripParticipant.findUnique({
      where: {
        tripId_userId: {
          tripId: trip.id,
          userId: context.user.id,
        },
      },
    });

    const oldStatus = existingParticipant?.rsvpStatus;

    if (existingParticipant) {
      // Update existing participant's RSVP
      await TripParticipant.update({
        where: {
          tripId_userId: {
            tripId: trip.id,
            userId: context.user.id,
          },
        },
        data: {
          rsvpStatus: args.rsvpStatus,
        },
      });
    } else {
      // Create new participant
      await TripParticipant.create({
        data: {
          tripId: trip.id,
          userId: context.user.id,
          rsvpStatus: args.rsvpStatus,
          role: "PARTICIPANT",
        },
      });
    }

    // Create activity entry
    const activityType = existingParticipant ? "RSVP_CHANGED" : "USER_JOINED";
    await Activity.create({
      data: {
        tripId: trip.id,
        userId: context.user.id,
        type: activityType,
        metadata: JSON.stringify({
          oldStatus: oldStatus || null,
          newStatus: args.rsvpStatus,
        }),
      },
    });
  } catch (error) {
    console.error("Error joining trip:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to join trip");
  }
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

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip, TripParticipant, Activity } = context.entities;

  try {
    // Verify trip exists
    const trip = await Trip.findUnique({
      where: { id: args.tripId },
    });

    if (!trip) {
      throw new HttpError(404, "Trip not found");
    }

    // Find or create participant
    const existingParticipant = await TripParticipant.findUnique({
      where: {
        tripId_userId: {
          tripId: args.tripId,
          userId: context.user.id,
        },
      },
    });

    const oldStatus = existingParticipant?.rsvpStatus;

    if (existingParticipant) {
      // Update existing participant
      await TripParticipant.update({
        where: {
          tripId_userId: {
            tripId: args.tripId,
            userId: context.user.id,
          },
        },
        data: {
          rsvpStatus: args.rsvpStatus,
        },
      });
    } else {
      // Create new participant (user joining trip)
      await TripParticipant.create({
        data: {
          tripId: args.tripId,
          userId: context.user.id,
          rsvpStatus: args.rsvpStatus,
          role: "PARTICIPANT",
        },
      });
    }

    // Create activity entry
    const activityType = existingParticipant ? "RSVP_CHANGED" : "USER_JOINED";
    await Activity.create({
      data: {
        tripId: args.tripId,
        userId: context.user.id,
        type: activityType,
        metadata: JSON.stringify({
          oldStatus: oldStatus || null,
          newStatus: args.rsvpStatus,
        }),
      },
    });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to update RSVP");
  }
};

