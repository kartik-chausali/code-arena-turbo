-- CreateTable
CREATE TABLE "EditorialCode" (
    "id" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "problemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "EditorialCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditorialCode_problemId_languageId_key" ON "EditorialCode"("problemId", "languageId");

-- AddForeignKey
ALTER TABLE "EditorialCode" ADD CONSTRAINT "EditorialCode_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorialCode" ADD CONSTRAINT "EditorialCode_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
