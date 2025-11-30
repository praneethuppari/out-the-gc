import { type DatePitch, type DestinationPitch } from "wasp/entities";
import { HttpError } from "wasp/server";
import type { DateVoteType } from "./types";

type CreateDatePitchArgs = {
  tripId: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  pitchDeadline: Date;
  votingDeadline: Date;
};

export const createDatePitch = async (
  args: CreateDatePitchArgs,
  context: any,
): Promise<DatePitch> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement date pitch creation
  // - Verify user is "Going" participant
  // - Create DatePitch
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
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

  // TODO: Implement date vote
  // - Verify user is "Going" participant
  // - Create or update DateVote
  // - Create activity entry
  throw new HttpError(501, "Not implemented");
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

type SetPitchDeadlineArgs = {
  tripId: string;
  pitchDeadline: Date;
};

export const setPitchDeadline = async (
  args: SetPitchDeadlineArgs,
  context: any,
): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // TODO: Implement setting pitch deadline (organizer only)
  throw new HttpError(501, "Not implemented");
};

