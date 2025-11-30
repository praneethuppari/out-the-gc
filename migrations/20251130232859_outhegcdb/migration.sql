-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverPhoto" TEXT,
    "joinToken" TEXT NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'DATES',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizerId" TEXT NOT NULL,
    CONSTRAINT "Trip_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TripParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rsvpStatus" TEXT NOT NULL DEFAULT 'INTERESTED',
    "role" TEXT NOT NULL DEFAULT 'PARTICIPANT',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TripParticipant_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TripParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DatePitch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "description" TEXT,
    "pitchDeadline" DATETIME NOT NULL,
    "votingDeadline" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tripId" TEXT NOT NULL,
    "pitchedById" TEXT NOT NULL,
    CONSTRAINT "DatePitch_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DatePitch_pitchedById_fkey" FOREIGN KEY ("pitchedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DateVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voteType" TEXT NOT NULL,
    "selectedDates" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pitchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DateVote_pitchId_fkey" FOREIGN KEY ("pitchId") REFERENCES "DatePitch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DateVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DestinationPitch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tripId" TEXT NOT NULL,
    "pitchedById" TEXT NOT NULL,
    CONSTRAINT "DestinationPitch_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DestinationPitch_pitchedById_fkey" FOREIGN KEY ("pitchedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DestinationVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ranking" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pitchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DestinationVote_pitchId_fkey" FOREIGN KEY ("pitchId") REFERENCES "DestinationPitch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DestinationVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TravelConfirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TravelConfirmation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TravelConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Activity_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "providerName" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerData" TEXT NOT NULL DEFAULT '{}',
    "authId" TEXT NOT NULL,

    PRIMARY KEY ("providerName", "providerUserId"),
    CONSTRAINT "AuthIdentity_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_joinToken_key" ON "Trip"("joinToken");

-- CreateIndex
CREATE INDEX "TripParticipant_tripId_idx" ON "TripParticipant"("tripId");

-- CreateIndex
CREATE INDEX "TripParticipant_userId_idx" ON "TripParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TripParticipant_tripId_userId_key" ON "TripParticipant"("tripId", "userId");

-- CreateIndex
CREATE INDEX "DateVote_pitchId_idx" ON "DateVote"("pitchId");

-- CreateIndex
CREATE UNIQUE INDEX "DateVote_pitchId_userId_key" ON "DateVote"("pitchId", "userId");

-- CreateIndex
CREATE INDEX "DestinationVote_pitchId_idx" ON "DestinationVote"("pitchId");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationVote_pitchId_userId_key" ON "DestinationVote"("pitchId", "userId");

-- CreateIndex
CREATE INDEX "TravelConfirmation_tripId_idx" ON "TravelConfirmation"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "TravelConfirmation_tripId_userId_key" ON "TravelConfirmation"("tripId", "userId");

-- CreateIndex
CREATE INDEX "Activity_tripId_idx" ON "Activity"("tripId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
