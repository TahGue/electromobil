/*
  Warnings:

  - A unique constraint covering the columns `[bookingNumber]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingNumber` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add bookingNumber column as nullable first
ALTER TABLE "public"."bookings" ADD COLUMN "bookingNumber" TEXT;

-- Step 2: Add emailSent column with default
ALTER TABLE "public"."bookings" ADD COLUMN "emailSent" BOOLEAN NOT NULL DEFAULT false;

-- Step 3: Generate booking numbers for existing records using a simpler approach
DO $$
DECLARE
    booking_record RECORD;
    counter INTEGER := 1;
    year_part TEXT;
BEGIN
    FOR booking_record IN 
        SELECT id, EXTRACT(YEAR FROM "createdAt") as booking_year 
        FROM "public"."bookings" 
        WHERE "bookingNumber" IS NULL 
        ORDER BY "createdAt"
    LOOP
        year_part := booking_record.booking_year::TEXT;
        UPDATE "public"."bookings" 
        SET "bookingNumber" = 'EM-' || year_part || '-' || LPAD(counter::TEXT, 4, '0')
        WHERE id = booking_record.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- Step 4: Make bookingNumber NOT NULL now that all records have values
ALTER TABLE "public"."bookings" ALTER COLUMN "bookingNumber" SET NOT NULL;

-- Step 5: Create unique index
CREATE UNIQUE INDEX "bookings_bookingNumber_key" ON "public"."bookings"("bookingNumber");
