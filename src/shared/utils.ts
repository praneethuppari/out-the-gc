// Shared utility functions

/**
 * Generate a unique join token for a trip
 */
export function generateJoinToken(): string {
  // TODO: Implement secure token generation
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Check if user can vote/propose (must be "Going")
 */
export function canParticipate(rsvpStatus: string): boolean {
  return rsvpStatus === "GOING";
}

/**
 * Check if user is organizer
 */
export function isOrganizer(role: string): boolean {
  return role === "ORGANIZER";
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = new Date(startDate).toLocaleDateString();
  const end = new Date(endDate).toLocaleDateString();
  return `${start} - ${end}`;
}

