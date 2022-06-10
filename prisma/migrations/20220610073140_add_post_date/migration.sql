-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "date_created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,
    "type" TEXT NOT NULL,
    "userCreatedId" INTEGER NOT NULL,
    "userUpdatedId" INTEGER NOT NULL,
    "visibility" TEXT NOT NULL,
    CONSTRAINT "Post_userCreatedId_fkey" FOREIGN KEY ("userCreatedId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_userUpdatedId_fkey" FOREIGN KEY ("userUpdatedId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("date_created", "id", "text", "title", "type", "userCreatedId", "userUpdatedId", "visibility") SELECT "date_created", "id", "text", "title", "type", "userCreatedId", "userUpdatedId", "visibility" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
