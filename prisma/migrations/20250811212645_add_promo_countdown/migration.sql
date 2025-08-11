-- CreateTable
CREATE TABLE "public"."promo_countdown" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL DEFAULT 'Tidsbegränsat erbjudande',
    "description" TEXT NOT NULL DEFAULT 'rabatt på skärmbyten',
    "percentage" INTEGER NOT NULL DEFAULT 15,
    "couponCode" TEXT NOT NULL DEFAULT 'SAVE15',
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_countdown_pkey" PRIMARY KEY ("id")
);
