import Prisma from "@prisma/client";

export let db;

if (Prisma === undefined) {
  import("@prisma/client").then(({ PrismaClient }) => {
    db = new PrismaClient();
  });
} else {
  db = new Prisma.PrismaClient();
}