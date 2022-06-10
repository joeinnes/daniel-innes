import { db } from '$lib/db/db'

export async function get() {
  try {
    let users = [];
    async function main() {
      users = await db.user.findMany()
    }
    await main();
    return {
      body: users.map(user => {
        delete user.password
        return user;
      })
    };
  } catch (error) {
    console.error(error);
  } finally {
    await db.$disconnect()
  }
}