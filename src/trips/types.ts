import { type Trip, type TripParticipant, type User } from "wasp/entities";

export type RSVPStatus = "GOING" | "INTERESTED" | "NOT_GOING";
export type TripRole = "ORGANIZER" | "PARTICIPANT";
export type PlanningPhase = "DATES" | "DESTINATION" | "TRAVEL_CONFIRMATION" | "COMPLETED";

export type TripWithParticipants = Trip & {
  participants: (TripParticipant & { user: User })[];
  organizer: User;
};

export type TripParticipantWithUser = TripParticipant & {
  user: User;
};

