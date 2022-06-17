import { db } from '$lib/db/db';
import { type Post, type File, Prisma } from '@prisma/client';

import type { CustomRequestEvent } from '$lib/types/types';
import sanitizeHtml from 'sanitize-html';

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
  let query: Prisma.PostWhereInput = { visibility: Role.Public };
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

  interface PostsFromDb extends Post {
    [key: string]: any;
  }
  const posts: PostsFromDb[] = await db.post.findMany(fullQuery);

  const safePosts = posts.map(post => {
    for (const key in post) {
      if (!post[key] || key === 'files') continue;
      post[key] = sanitizeHtml(post[key], {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: { img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'], a: ['href', 'target'] },
      })
    }
    post.files = post.files.map(el => el.s3id);
    return post;
  });

  return {
    body: { user, posts: safePosts }
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
  const filesToConnect = submittedData.files.map((file: File) => ({
    s3id: file
  }));
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
    date_created: new Date(submittedData.date_created),
    post_date: new Date(submittedData.post_date),
    files: {
      connect: filesToConnect
    }
  }
  console.log(submittedData, postToCreate)
  const post = await db.post.create({ data: postToCreate });
  return {
    body: post
  };
}

export const patch = async ({ request, locals }: CustomRequestEvent) => {
  try {
    const { user } = locals;
    if (user?.role !== Role.Admin) {
      throw new Error('Unauthorised');
    }

    if (!user?.id) {
      throw new Error('Unauthorised');
    }

    const submittedData = await request.json();

    if (!submittedData.id) {
      throw new Error('No ID supplied')
    }

    const targetId = parseInt(submittedData.id);

    delete submittedData.id;
    delete submittedData.userCreatedId;
    delete submittedData.userUpdatedId;

    const filesToConnect = submittedData.files.map((file: File) => ({
      s3id: file
    }));

    const postToUpdate: Prisma.PostUpdateInput & { id: number }
      = {
      ...submittedData,
      user_updated: {
        connect: {
          id: user.id
        }
      },
      date_created: new Date(submittedData.date_created),
      post_date: new Date(submittedData.post_date),
      files: {
        connect: filesToConnect
      }
    }
    const post = await db.post.update({ where: { id: targetId }, data: postToUpdate });
    return {
      body: post
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: JSON.stringify(e)
    }
  }

}

export const del = async ({ request, locals }: CustomRequestEvent) => {
  try {
    const { user } = locals;
    if (user?.role !== Role.Admin) {
      throw new Error('Unauthorised');
    }

    if (!user?.id) {
      throw new Error('Unauthorised');
    }

    const { id } = await request.json();
    const deleted = await db.post.delete({
      where: {
        id: parseInt(id, 10)
      },
    });
    return {
      status: 204
    };
  } catch (e) {
    console.log(e)
    return {
      status: 500,
      message: JSON.stringify(e)
    }
  }

}