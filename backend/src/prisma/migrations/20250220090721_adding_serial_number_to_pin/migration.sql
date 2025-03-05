/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Pin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pin" ADD COLUMN     "serialNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pin_serialNumber_key" ON "Pin"("serialNumber");
