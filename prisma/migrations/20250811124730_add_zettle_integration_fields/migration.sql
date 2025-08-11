/*
  Warnings:

  - A unique constraint covering the columns `[zettleProductId]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."services" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "zettleEtag" TEXT,
ADD COLUMN     "zettleProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "services_zettleProductId_key" ON "public"."services"("zettleProductId");
