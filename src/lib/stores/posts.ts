import { writable } from 'svelte/store';
import { Prisma } from '@prisma/client';

const postsWithFiles = Prisma.validator<Prisma.PostArgs>()({
  include: { files: true }
});

export type PostWithFiles = Prisma.PostGetPayload<typeof postsWithFiles>;

const posts = writable<PostWithFiles[]>([]);

export default posts;
