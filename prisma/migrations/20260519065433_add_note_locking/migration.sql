-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "contentText" TEXT,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
