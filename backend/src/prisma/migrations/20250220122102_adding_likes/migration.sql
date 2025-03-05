-- CreateTable
CREATE TABLE "PinLike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PinLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PinLike_pinId_userId_key" ON "PinLike"("pinId", "userId");

-- AddForeignKey
ALTER TABLE "PinLike" ADD CONSTRAINT "PinLike_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinLike" ADD CONSTRAINT "PinLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
