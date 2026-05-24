/*
  Warnings:

  - Made the column `project_id` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_project_id_fkey";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "project_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
