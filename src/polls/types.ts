import { type DatePitch, type DateVote, type DestinationPitch, type DestinationVote, type User } from "wasp/entities";

export type DateVoteType = "ALL_WORK" | "PARTIAL" | "NONE_WORK";

export type DatePitchWithVotes = DatePitch & {
  votes: (DateVote & { user: User })[];
  pitchedBy: User;
};

export type DestinationPitchWithVotes = DestinationPitch & {
  votes: (DestinationVote & { user: User })[];
  pitchedBy: User;
};

