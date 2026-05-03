-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfume" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "brand" TEXT,
    "name" TEXT,
    "description" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Perfume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "perfume_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scent" INTEGER,
    "projection" INTEGER,
    "longevity" INTEGER,
    "total_rating" INTEGER,
    "comment" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_perfume_id_key" ON "reviews"("user_id", "perfume_id");

-- AddForeignKey
ALTER TABLE "Perfume" ADD CONSTRAINT "Perfume_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "Perfume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
