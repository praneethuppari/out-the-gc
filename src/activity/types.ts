import { type Activity, type User } from "wasp/entities";

export type ActivityType =
  | "TRIP_CREATED"
  | "USER_JOINED"
  | "RSVP_CHANGED"
  | "DATE_PITCH_CREATED"
  | "DATE_VOTE_CAST"
  | "DESTINATION_PITCH_CREATED"
  | "DESTINATION_VOTE_CAST"
  | "PHASE_CHANGED"
  | "TRAVEL_CONFIRMED";

export type ActivityWithUser = Activity & {
  user: User;
};

