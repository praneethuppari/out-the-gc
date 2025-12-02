-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverPhoto" TEXT,
    "joinToken" TEXT NOT NULL,
    "phase" TEXT NOT NULL DEFAULT 'DATES',
    "datePitchDeadline" DATETIME,
    "votingDeadlineDurationDays" INTEGER NOT NULL DEFAULT 7,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizerId" TEXT NOT NULL,
    CONSTRAINT "Trip_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("coverPhoto", "createdAt", "description", "id", "joinToken", "organizerId", "phase", "title", "updatedAt") SELECT "coverPhoto", "createdAt", "description", "id", "joinToken", "organizerId", "phase", "title", "updatedAt" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
CREATE UNIQUE INDEX "Trip_joinToken_key" ON "Trip"("joinToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
