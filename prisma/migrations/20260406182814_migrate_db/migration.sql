/*
  Warnings:

  - You are about to drop the column `tenantId` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `ExceptionDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "userRole" ADD VALUE 'USER';

-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_userId_fkey";

-- DropIndex
DROP INDEX "Barber_userId_tenantId_key";

-- AlterTable
ALTER TABLE "Barber" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "paymentMethod" TEXT;

-- AlterTable
ALTER TABLE "ExceptionDate" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "barbershops" ADD COLUMN     "imageUrl" TEXT DEFAULT 'https://3tlh7aktl6.ufs.sh/f/tcFRjMXVSkQ0Asb1IxZDwZ30bIph8P2qjXfOcVJmTvFtnMxi',
ADD COLUMN     "storageUrl" TEXT;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "tenantId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "userRole" NOT NULL DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "BarberBreak" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "BarberBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "ratingValue" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "bookingId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarberBreak_barberId_dayOfWeek_startTime_endTime_tenantId_key" ON "BarberBreak"("barberId", "dayOfWeek", "startTime", "endTime", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_bookingId_key" ON "Rating"("bookingId");

-- CreateIndex
CREATE INDEX "Rating_tenantId_idx" ON "Rating"("tenantId");

-- CreateIndex
CREATE INDEX "Rating_barberId_ratingValue_idx" ON "Rating"("barberId", "ratingValue");

-- CreateIndex
CREATE INDEX "SocialMedia_barberId_tenantId_idx" ON "SocialMedia"("barberId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Barber_userId_key" ON "Barber"("userId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "UserTenant_userId_idx" ON "UserTenant"("userId");

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberBreak" ADD CONSTRAINT "BarberBreak_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberBreak" ADD CONSTRAINT "BarberBreak_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExceptionDate" ADD CONSTRAINT "ExceptionDate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
