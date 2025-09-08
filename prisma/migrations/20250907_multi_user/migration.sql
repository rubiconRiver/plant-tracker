-- Create new tables for multi-user support
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "defaultWorkspaceId" TEXT
);

CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL
);

CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Rename Shelf table to Garden
ALTER TABLE "Shelf" RENAME TO "Garden";

-- Add workspaceId to Garden
ALTER TABLE "Garden" ADD COLUMN "workspaceId" TEXT;

-- Rename columns in Plant table
ALTER TABLE "Plant" RENAME COLUMN "shelfId" TO "gardenId";
ALTER TABLE "Plant" RENAME COLUMN "shelfRow" TO "gardenRow";
ALTER TABLE "Plant" RENAME COLUMN "shelfColumn" TO "gardenColumn";

-- Create unique indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- Create default user and workspace for existing data
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt", "defaultWorkspaceId")
VALUES ('default-user', 'garett@mobcat.ca', 'Garett', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'default-workspace');

INSERT INTO "Workspace" ("id", "name", "createdAt", "updatedAt", "createdById")
VALUES ('default-workspace', 'My Home Garden', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'default-user');

INSERT INTO "WorkspaceMember" ("id", "workspaceId", "userId", "role", "joinedAt")
VALUES ('default-member', 'default-workspace', 'default-user', 'owner', CURRENT_TIMESTAMP);

-- Update existing gardens to belong to default workspace
UPDATE "Garden" SET "workspaceId" = 'default-workspace' WHERE "workspaceId" IS NULL;

-- Make workspaceId required after updating existing data
-- Note: SQLite doesn't support ALTER COLUMN, would need to recreate table in production