import { db } from '$lib/db/db'

export async function get() {
  try {
    let posts = [];
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