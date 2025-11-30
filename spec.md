# ✅ OutTheGC MVP Specification

## Project Overview

**OutTheGC** is a web app that helps groups plan trips together by guiding them through decisions like:

- Destinations  
- Travel dates  
- Flights  
- Lodging  

The core idea: help trips *escape the group chat* and become real.  
The MVP focuses on **fast onboarding, collaborative planning, and role-based permissions**.

## Core Objectives

1. Enable users to **create trips** and invite friends.  
2. Provide a **shareable join link**.  
3. Let participants choose **RSVP status**:  
   - **Going** → full participation  
   - **Interested** → view-only  
   - **Not Going** → view-only  
4. Only “Going” users can **vote and propose ideas**.  
5. Provide a simple **dashboard** showing trip info, participants, and polls.  
6. Keep UI **clean, simple, mobile-friendly**. Make the UI as modern as possible with clean, sophisticated look using tailwind (examples: https://www.awwwards.com/websites/tailwind/) 

## MVP Feature List

### 1. Authentication
- Email/password login and sign up  
- Simple redirect to dashboard after login  

### 2. Trip Creation
- Users can create a trip with:  
  - Title  
  - Description (optional)  
  - Cover photo (optional)  
- Creator automatically becomes **Organizer** and **Going**  

### 3. Invite & Join Flow
- Each trip has a **shareable link**  
- Users click link → choose RSVP: Going / Interested / Not Going  
- Only Going users can vote and propose ideas  
- Interested / Not Going can view planning  

### 4. RSVP & Roles
- **Organizer**: full control  
- **Going**: vote & propose ideas  
- **Interested / Not Going**: view-only  
- Users can update RSVP at any time  

### 5. Planning Phases
1. Users can begin by either making a decision on dates or destination (they choose which)
2. **Dates phase**: Any "Going" user can pitch a date range (e.g., Apr 3–6). Organizer sets a pitch deadline (max 2 weeks). Once the deadline passes, everyone votes:
   - **All dates work** — full availability
   - **Partial** — user selects which specific dates within the proposed range work for them
   - **None work** — unavailable for this range
   - Winner = proposal with most "all work" + partial overlap
3. **Destination phase**: "Going" users pitch a location with a description of why it should be picked. Everyone does ranked-choice voting; location is selected based on rankings.
4. **Travel confirmation**: For MVP, users manually mark that they've booked travel to proceed. (Future: in-app travel search/booking)
5. **Post-MVP**: AI-assisted itinerary planning (not in MVP scope)

### 6. Trip Dashboard
- Shows current planning phase and progress
- Displays trip details, participants with RSVP badges, active polls/pitches
- Activity feed for recent updates

### 7. Activity Feed
- Tracks: user joins, RSVP changes, polls created, options added, votes cast

### 8. Mobile-Friendly UI
- Fully responsive  
- Clean layout, minimalistic design  
- Use Tailwind for styling  

---

## User Flow (High-Level)

1. Landing → Login / Sign up  
2. Dashboard → list of user’s trips  
3. Create Trip → enter details → redirect to Trip Dashboard  
4. Share Invite Link → friends click → select RSVP → join trip  
5. Trip Dashboard → view planning & participants  
6. Going users can create polls, vote, and add proposals  
7. Interested / Not Going users can view the trip  
8. Activity feed shows updates in real time  

---

## MVP Completion Criteria

The MVP is complete when users can:

- Create an account  
- Create a trip  
- Join a trip via a shareable link  
- Select RSVP status (Going / Interested / Not Going)  
- Going users can vote in polls and propose ideas  
- Interested / Not Going users can view everything  
- See participants and RSVPs on dashboard  
- Track updates via activity feed  
- Navigate cleanly on mobile and desktop  

## Cursor Usage Notes

- Focus on **one feature at a time** (Trip Creation, Join Flow, RSVP, Polls, Dashboard, Activity Feed)  
- Scaffold UI and minimal functionality first  
- Avoid generating all pages at once  
- Keep styling simple; polish can come later  

# Stack
- we are going to be using the wasp framework 
- tailwind for styling and components 
- prefer wasp elements when available
