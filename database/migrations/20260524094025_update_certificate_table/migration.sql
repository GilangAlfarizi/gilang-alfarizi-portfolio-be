/*
  Warnings:

  - You are about to drop the column `valid_until` on the `certificates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "valid_until",
ADD COLUMN     "credential" TEXT,
ADD COLUMN     "issued_at" TIMESTAMP(3);
