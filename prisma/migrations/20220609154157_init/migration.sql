-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "date_created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,
    "userCreatedId" INTEGER NOT NULL,
    "userUpdatedId" INTEGER NOT NULL,
    "visibility" TEXT NOT NULL,
    CONSTRAINT "Post_userCreatedId_fkey" FOREIGN KEY ("userCreatedId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_userUpdatedId_fkey" FOREIGN KEY ("userUpdatedId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "s3id" TEXT NOT NULL,
    "PostId" INTEGER NOT NULL,
    CONSTRAINT "File_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "File_s3id_key" ON "File"("s3id");
