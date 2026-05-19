-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
