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

  // TODO: Implement query to get trip by ID with participants
  return null;
};

// Get trip by join token (for join flow)
export const getTripByJoinToken = async (
  { token }: { token: string },
  context: any,
): Promise<TripWithParticipants | null> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement query to get trip by join token
  return null;
};

