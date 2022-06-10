import type { RequestEvent } from "@sveltejs/kit";
import { db } from '$lib/db/db';
import type { Prisma } from '@prisma/client';


const limit = process.env.POSTS_PER_PAGE || 15;

export const get = async ({ url, locals }: RequestEvent) => {
  const { user } = locals;
  const page = url.searchParams.get('page') || 1;
  let query = { visibility: 'public' };
  if (user?.role === 'admin') {
    delete query.visibility;
  } else if (user?.role) {
    query.visibility = user.role;
  }

  const posts = await db.post.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: query, orderBy: {
      date_created: 'desc'
    }
  });

  return {
    body: { user, posts }
  }
}

export const post = async ({ request, locals }) => {
  const { user } = locals;
  if (user?.role !== 'admin') {
    throw new Error('Unauthorised');
  }

  if (!user?.id) {
    throw new Error('Unauthorised');
  }

  const submittedData = await request.json();
  const postToCreate: Prisma.PostCreateInput
    = {
    ...submittedData,
    user_created: {
      connect: {
        id: user.id
      }
    },
    user_updated: {
      connect: {
        id: user.id
      }
    },
    date_created: submittedData.date_created || new Date(),
    post_date: submittedData.post_date || new Date(),
    files: submittedData?.files.length ? submittedData.files : undefined
  }
  const post = await db.post.create({ data: postToCreate });
  return {
    body: post
  };

}
