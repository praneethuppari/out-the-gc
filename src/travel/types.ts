import { type TravelConfirmation, type User } from "wasp/entities";

export type TravelConfirmationWithUser = TravelConfirmation & {
  user: User;
};

