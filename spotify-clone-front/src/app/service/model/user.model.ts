// Interface representing a user with optional properties
export interface User {
  // Optional first name of the user
  firstName?: string;
  // Optional last name of the user
  lastName?: string;
  // Optional email address of the user
  email?: string;
  // Optional subscription type of the user
  subscription?: Subscription;
  // Optional URL for the user's image
  imageUrl?: string;
}

// Enum for different subscription types
export enum Subscription {
  // Premium subscription type
  PREMIUM = 0,
  // Free subscription type
  FREE = 1,
}
