-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "lastNotificationSent" TIMESTAMP(3),
ADD COLUMN     "whatsappConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsappSent" BOOLEAN NOT NULL DEFAULT false;
