/*
  Warnings:

  - Added the required column `authorId` to the `Pin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pin" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
