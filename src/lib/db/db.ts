import Prisma from "@prisma/client";

// TODO: type this properly. However, if I don't type this as 'any' then I have other issues on my index.ts endpoint
export let db: any;

if (Prisma === undefined) {
  import("@prisma/client").then(({ PrismaClient }) => {
    db = new PrismaClient();
  });
} else {
  db = new Prisma.PrismaClient();
}