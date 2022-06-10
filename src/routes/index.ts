import { db } from '$lib/db/db';
import type { User, Query, Prisma } from '@prisma/client';

import type { CustomRequestEvent } from '$lib/types/types';

enum Role {
  Public = 'public',
  Friends = 'friends',
  Family = 'family',
  Admin = 'admin'
}

const limit = parseInt((process.env.POSTS_PER_PAGE || '15'), 10);

export const get = async ({ url, locals }: CustomRequestEvent) => {
  const { user } = locals;
  const page = parseInt((url?.searchParams.get('page') || '1'), 10);
  let query: Query = { visibility: Role.Public };
  if (user?.role === Role.Admin) {
    delete query.visibility;
  } else if (user?.role) {
    query.visibility = user.role;
  }

  const fullQuery: Prisma.PostFindManyArgs = {
    take: limit,
    skip: (page - 1) * limit,
    include: {
      files: true
    },
    where: query, orderBy: {
      date_created: 'desc'
    }
  }

  const posts: User[] = await db.post.findMany(fullQuery);

  return {
    body: { user, posts }
  }
}

export const post = async ({ request, locals }: CustomRequestEvent) => {
  const { user } = locals;
  if (user?.role !== Role.Admin) {
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
