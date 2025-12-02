import { type DatePitch, type DestinationPitch } from "wasp/entities";
import { HttpError } from "wasp/server";
import type { DateVoteType } from "./types";

type CreateDatePitchArgs = {
  tripId: string;
  startDate: Date;
  endDate: Date;
  description?: string;
};

export const createDatePitch = async (
  args: CreateDatePitchArgs,
  context: any,
): Promise<DatePitch> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { Trip, TripParticipant, DatePitch, Activity } = context.entities;

  try {
    // Verify trip exists
    const trip = await Trip.findUnique({
      where: { id: args.tripId },
    });

    if (!trip) {
      throw new HttpError(404, "Trip not found");
    }

    // Verify trip is in DATES phase
    if (trip.phase !== "DATES") {
      throw new HttpError(400, "Trip is not in the dates planning phase");
    }

    // Verify user is a participant with "GOING" status
    const participant = await TripParticipant.findUnique({
      where: {
        tripId_userId: {
          tripId: args.tripId,
          userId: context.user.id,
        },
      },
    });

    if (!participant) {
      throw new HttpError(403, "You must be a participant to propose dates");
    }

    if (participant.rsvpStatus !== "GOING") {
      throw new HttpError(403, "Only 'Going' participants can propose dates");
    }

    // Validate dates
    if (args.endDate <= args.startDate) {
      throw new HttpError(400, "End date must be after start date");
    }

    // Check if trip has a pitch deadline set
    if (!trip.datePitchDeadline) {
      throw new HttpError(400, "Organizer must set a proposal deadline before dates can be proposed");
    }

    // Validate that we're still before the pitch deadline
    const now = new Date();
    if (now >= trip.datePitchDeadline) {
      throw new HttpError(400, "The proposal deadline has passed. Please contact the organizer to extend it.");
    }

    // Calculate voting deadline from trip settings
    const votingDeadline = new Date(trip.datePitchDeadline);
    votingDeadline.setDate(votingDeadline.getDate() + (trip.votingDeadlineDurationDays || 7));

    // Create the date pitch
    // Store trip's pitch deadline and calculated voting deadline for reference
    const datePitch = await DatePitch.create({
      data: {
        tripId: args.tripId,
        startDate: args.startDate,
        endDate: args.endDate,
        description: args.description || null,
        pitchDeadline: trip.datePitchDeadline,
        votingDeadline: votingDeadline,
        pitchedById: context.user.id,
      },
    });

    // Create activity entry
    await Activity.create({
      data: {
        tripId: args.tripId,
        userId: context.user.id,
        type: "DATE_PITCH_CREATED",
        metadata: JSON.stringify({
          pitchId: datePitch.id,
          startDate: args.startDate.toISOString(),
          endDate: args.endDate.toISOString(),
        }),
      },
    });

    return datePitch;
  } catch (error) {
    console.error("Error creating date pitch:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to create date pitch");
  }
};

type VoteOnDatePitchArgs = {
  pitchId: string;
  voteType: DateVoteType;
  selectedDates?: string[]; // For PARTIAL votes
};

export const voteOnDatePitch = async (
  args: VoteOnDatePitchArgs,
  context: any,
): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.entities) {
    throw new HttpError(500, "Database entities not available");
  }

  const { DatePitch, DateVote, TripParticipant, Activity } = context.entities;

  try {
    // Verify pitch exists
    const pitch = await DatePitch.findUnique({
      where: { id: args.pitchId },
      include: {
        trip: true,
      },
    });

    if (!pitch) {
      throw new HttpError(404, "Date pitch not found");
    }

    // Verify trip is in DATES phase
    if (pitch.trip.phase !== "DATES") {
      throw new HttpError(400, "Trip is not in the dates planning phase");
    }

    // Verify trip deadline has passed (voting phase) - use trip-level deadlines
    const now = new Date();
    const tripPitchDeadline = pitch.trip.datePitchDeadline;
    const votingDeadline = tripPitchDeadline
      ? (() => {
          const deadline = new Date(tripPitchDeadline);
          deadline.setDate(deadline.getDate() + (pitch.trip.votingDeadlineDurationDays || 7));
          return deadline;
        })()
      : null;

    if (!tripPitchDeadline) {
      throw new HttpError(400, "Organizer must set a proposal deadline before voting can begin");
    }

    if (now < tripPitchDeadline) {
      throw new HttpError(400, "Voting has not started yet. Please wait for the proposal deadline to pass.");
    }

    if (votingDeadline && now >= votingDeadline) {
      throw new HttpError(400, "Voting deadline has passed");
    }

    // Verify user is a participant with "GOING" status
    const participant = await TripParticipant.findUnique({
      where: {
        tripId_userId: {
          tripId: pitch.tripId,
          userId: context.user.id,
        },
      },
    });

    if (!participant) {
      throw new HttpError(403, "You must be a participant to vote");
    }

    if (participant.rsvpStatus !== "GOING") {
      throw new HttpError(403, "Only 'Going' participants can vote");
    }

    // Validate vote type
    if (!["ALL_WORK", "PARTIAL", "NONE_WORK"].includes(args.voteType)) {
      throw new HttpError(400, "Invalid vote type");
    }

    // For PARTIAL votes, validate selectedDates
    if (args.voteType === "PARTIAL") {
      if (!args.selectedDates || args.selectedDates.length === 0) {
        throw new HttpError(400, "Selected dates are required for PARTIAL votes");
      }

      // Validate that selected dates are within the pitch date range
      const pitchStart = new Date(pitch.startDate);
      const pitchEnd = new Date(pitch.endDate);

      for (const dateStr of args.selectedDates) {
        const selectedDate = new Date(dateStr);
        if (selectedDate < pitchStart || selectedDate > pitchEnd) {
          throw new HttpError(400, "Selected dates must be within the proposed date range");
        }
      }
    }

    // Create or update the vote
    const selectedDatesJson = args.voteType === "PARTIAL" && args.selectedDates
      ? JSON.stringify(args.selectedDates)
      : null;

    await DateVote.upsert({
      where: {
        pitchId_userId: {
          pitchId: args.pitchId,
          userId: context.user.id,
        },
      },
      create: {
        pitchId: args.pitchId,
        userId: context.user.id,
        voteType: args.voteType,
        selectedDates: selectedDatesJson,
      },
      update: {
        voteType: args.voteType,
        selectedDates: selectedDatesJson,
      },
    });

    // Create activity entry
    await Activity.create({
      data: {
        tripId: pitch.tripId,
        userId: context.user.id,
        type: "DATE_VOTE_CAST",
        metadata: JSON.stringify({
          pitchId: args.pitchId,
          voteType: args.voteType,
        }),
      },
    });
  } catch (error) {
    console.error("Error voting on date pitch:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to vote on date pitch");
  }
};

type CreateDestinationPitchArgs = {
  tripId: string;
  location: string;
  description: string;
};

export const createDestinationPitch = async (
  args: CreateDestinationPitchArgs,
  context: any,
): Promise<DestinationPitch> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement destination pitch creation
  // - Verify user is "Going" participant
  // - Create DestinationPitch
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
};

type VoteOnDestinationPitchArgs = {
  pitchId: string;
  ranking: number; // 1 = first choice, 2 = second, etc.
};

export const voteOnDestinationPitch = async (
  args: VoteOnDestinationPitchArgs,
  context: any,
): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement destination vote (ranked choice)
  // - Verify user is "Going" participant
  // - Create or update DestinationVote
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
};

type UpdateDatePitchSettingsArgs = {
  tripId: string;
  datePitchDeadline: Date;
  votingDeadlineDurationDays: number;
};

export const updateDatePitchSettings = async (
  args: UpdateDatePitchSettingsArgs,
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

    // Verify user is the organizer
    if (trip.organizerId !== context.user.id) {
      throw new HttpError(403, "Only the organizer can update date pitch settings");
    }

    // Verify trip is in DATES phase
    if (trip.phase !== "DATES") {
      throw new HttpError(400, "Trip is not in the dates planning phase");
    }

    // Validate deadline is in the future
    // Note: Date objects are compared in UTC, but the client sends local time
    // which gets converted. We compare as-is since both are Date objects.
    const now = new Date();
    if (args.datePitchDeadline <= now) {
      throw new HttpError(400, "Pitch deadline must be in the future. Please select a date and time that is after the current time.");
    }

    // Validate voting duration is positive
    if (args.votingDeadlineDurationDays <= 0) {
      throw new HttpError(400, "Voting deadline duration must be at least 1 day");
    }

    // Update trip settings
    await Trip.update({
      where: { id: args.tripId },
      data: {
        datePitchDeadline: args.datePitchDeadline,
        votingDeadlineDurationDays: args.votingDeadlineDurationDays,
      },
    });

    // Create activity entry
    await Activity.create({
      data: {
        tripId: args.tripId,
        userId: context.user.id,
        type: "PHASE_CHANGED",
        metadata: JSON.stringify({
          phase: "DATES",
          datePitchDeadline: args.datePitchDeadline.toISOString(),
          votingDeadlineDurationDays: args.votingDeadlineDurationDays,
        }),
      },
    });
  } catch (error) {
    console.error("Error updating date pitch settings:", error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Failed to update date pitch settings");
  }
};

