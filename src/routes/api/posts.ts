import { db } from '$lib/db/db'

import type { Prisma } from '@prisma/client';

export async function get() {
  try {
    let posts: Prisma.PostFindManyArgs | [] = [];
    async function main() {
      posts = await db.post.findMany()
    }
    await main();
    return {
      body: posts
    };
  } catch (error) {
    console.error(error);
  } finally {
    await db.$disconnect()
  }
}