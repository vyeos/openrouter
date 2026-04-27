-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "creditsConsumed" SET DEFAULT 0,
ALTER COLUMN "disabled" SET DEFAULT false,
ALTER COLUMN "deleted" SET DEFAULT false,
ALTER COLUMN "lastUsed" DROP NOT NULL;
