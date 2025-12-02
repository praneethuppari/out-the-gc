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

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { DatePitch, Trip, TripParticipant } = context.entities;

  try {
    // Verify trip exists and user has access
    const trip = await Trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new HttpError(404, "Trip not found");
    }

    // Check if user has access to this trip (organizer or participant)
    const hasAccess =
      trip.organizerId === context.user.id ||
      (await TripParticipant.findUnique({
        where: {
          tripId_userId: {
            tripId,
            userId: context.user.id,
          },
        },
      })) !== null;

    if (!hasAccess) {
      throw new HttpError(403, "You don't have access to this trip");
    }

    // Get all date pitches for the trip with votes and user info
    const pitches = await DatePitch.findMany({
      where: { tripId },
      include: {
        pitchedBy: true,
        votes: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return pitches as DatePitchWithVotes[];
  } catch (error) {
    console.error("Error fetching date pitches:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to fetch date pitches");
  }
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

