-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "s3id" TEXT NOT NULL,
    "PostId" INTEGER,
    CONSTRAINT "File_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_File" ("PostId", "id", "name", "s3id") SELECT "PostId", "id", "name", "s3id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_s3id_key" ON "File"("s3id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
