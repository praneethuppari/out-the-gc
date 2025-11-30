# OutTheGC Project Structure

This document outlines the project structure and organization for the OutTheGC MVP.

## Overview

The project follows WASP framework best practices with a modular, feature-based organization. Each feature module contains its own queries, actions, components, and types.

## Directory Structure

```
src/
├── auth/                    # Authentication (WASP built-in)
│   └── email/              # Email-based auth pages
├── landing/                # Landing page
│   └── LandingPage.tsx
├── trips/                  # Trip management module
│   ├── actions.ts          # Trip CRUD, join, RSVP updates
│   ├── queries.ts          # Get trips, get trip by ID/token
│   ├── types.ts            # Trip-related types
│   ├── TripsPage.tsx       # List of user's trips
│   ├── DashboardPage.tsx   # Individual trip dashboard
│   └── components/
│       ├── TripCard.tsx
│       ├── TripList.tsx
│       ├── CreateTripForm.tsx
│       └── JoinTripPage.tsx
├── polls/                  # Polling module (dates & destinations)
│   ├── actions.ts          # Create pitches, vote, set deadlines
│   ├── queries.ts          # Get date/destination pitches
│   ├── types.ts            # Poll-related types
│   └── components/
│       ├── DatePitchCard.tsx
│       ├── DestinationPitchCard.tsx
│       ├── CreateDatePitchForm.tsx
│       ├── CreateDestinationPitchForm.tsx
│       ├── DateVoteForm.tsx
│       └── DestinationVoteForm.tsx
├── activity/               # Activity feed module
│   ├── queries.ts          # Get activities for a trip
│   ├── types.ts            # Activity types
│   └── components/
│       ├── ActivityFeed.tsx
│       └── ActivityItem.tsx
├── travel/                 # Travel confirmation module
│   ├── actions.ts          # Confirm travel booking
│   ├── queries.ts          # Get travel confirmations
│   ├── types.ts            # Travel-related types
│   └── components/
│       ├── TravelConfirmationForm.tsx
│       └── TravelStatusList.tsx
└── shared/                 # Shared components and utilities
    ├── components/         # Reusable UI components
    ├── types.ts            # Shared types
    └── utils.ts            # Utility functions
```

## Database Schema

The Prisma schema (`schema.prisma`) defines the following entities:

- **User**: Base user entity (WASP auth)
- **Trip**: Trip entity with organizer, phase, join token
- **TripParticipant**: Many-to-many relationship with RSVP status and role
- **DatePitch**: Proposed date ranges for trips
- **DateVote**: Votes on date pitches (ALL_WORK, PARTIAL, NONE_WORK)
- **DestinationPitch**: Proposed destinations
- **DestinationVote**: Ranked-choice votes on destinations
- **TravelConfirmation**: User travel booking status
- **Activity**: Activity feed entries

## Routes & Pages

Defined in `main.wasp`:

- `/` - Landing page (public)
- `/trips` - User's trips list (auth required)
- `/trips/:tripId` - Trip dashboard (auth required)
- `/join/:token` - Join trip page (auth required)
- `/login`, `/signup` - Auth pages (WASP built-in)

## WASP Operations

### Queries
- `getTrips` - Get all trips for current user
- `getTrip` - Get trip by ID
- `getTripByJoinToken` - Get trip by join token
- `getDatePitches` - Get date pitches for a trip
- `getDestinationPitches` - Get destination pitches for a trip
- `getActivities` - Get activity feed for a trip
- `getTravelConfirmations` - Get travel confirmations for a trip

### Actions
- `createTrip` - Create a new trip
- `updateTrip` - Update trip details (organizer only)
- `deleteTrip` - Delete a trip (organizer only)
- `joinTrip` - Join a trip via token
- `updateRSVP` - Update RSVP status
- `createDatePitch` - Propose a date range
- `voteOnDatePitch` - Vote on a date pitch
- `createDestinationPitch` - Propose a destination
- `voteOnDestinationPitch` - Vote on destination (ranked choice)
- `setPitchDeadline` - Set pitch deadline (organizer only)
- `confirmTravel` - Confirm travel booking

## Development Guidelines

1. **Feature-based organization**: Each feature (trips, polls, activity, travel) is self-contained
2. **Type safety**: Use TypeScript types defined in each module's `types.ts`
3. **WASP patterns**: Follow WASP conventions for queries and actions
4. **Component structure**: Keep components in feature-specific `components/` folders
5. **Shared code**: Use `shared/` for reusable components and utilities

## Next Steps

Each module has TODO comments indicating what needs to be implemented. Start with:

1. Trip creation and listing
2. Join flow with RSVP selection
3. Date pitch creation and voting
4. Destination pitch creation and ranked-choice voting
5. Activity feed
6. Travel confirmation

## Notes

- All operations are currently stubbed with TODO comments
- Database migrations need to be run: `wasp db migrate-dev`
- Follow the spec.md for detailed feature requirements

