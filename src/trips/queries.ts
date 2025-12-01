import { type Trip, type TripParticipant, type User } from "wasp/entities";
import { HttpError } from "wasp/server";
import type { TripWithParticipants } from "./types";

// Get all trips for the current user
export const getTrips = async (
  _args: void,
  context: any,
): Promise<TripWithParticipants[]> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip, TripParticipant } = context.entities;

  try {
    // Get all trips where user is organizer or participant
    const trips = await Trip.findMany({
      where: {
        OR: [
          { organizerId: context.user.id },
          {
            participants: {
              some: {
                userId: context.user.id,
              },
            },
          },
        ],
      },
      include: {
        organizer: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return trips as TripWithParticipants[];
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw new HttpError(500, "Failed to fetch trips");
  }
};

// Get a single trip by ID
export const getTrip = async (
  { tripId }: { tripId: string },
  context: any,
): Promise<TripWithParticipants | null> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip } = context.entities;

  try {
    const trip = await Trip.findUnique({
      where: { id: tripId },
      include: {
        organizer: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!trip) {
      return null;
    }

    // Check if user has access to this trip (organizer or participant)
    const hasAccess =
      trip.organizerId === context.user.id ||
      trip.participants.some((p: TripParticipant) => p.userId === context.user.id);

    if (!hasAccess) {
      throw new HttpError(403, "You don't have access to this trip");
    }

    return trip as TripWithParticipants;
  } catch (error) {
    console.error("Error fetching trip:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to fetch trip");
  }
};

// Get trip by join token (for join flow) - public, no auth required
export const getTripByJoinToken = async (
  { token }: { token: string },
  context: any,
): Promise<TripWithParticipants | null> => {
  // This query is public - no auth required
  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip } = context.entities;

  try {
    const trip = await Trip.findUnique({
      where: { joinToken: token },
      include: {
        organizer: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!trip) {
      return null;
    }

    return trip as TripWithParticipants;
  } catch (error) {
    console.error("Error fetching trip by join token:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to fetch trip");
  }
};
