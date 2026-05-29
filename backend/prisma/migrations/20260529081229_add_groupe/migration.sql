-- CreateTable
CREATE TABLE "Groupe" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "cours" TEXT,
    "emoji" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Groupe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupeMembre" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupeId" INTEGER NOT NULL,

    CONSTRAINT "GroupeMembre_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupeMembre" ADD CONSTRAINT "GroupeMembre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupeMembre" ADD CONSTRAINT "GroupeMembre_groupeId_fkey" FOREIGN KEY ("groupeId") REFERENCES "Groupe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
