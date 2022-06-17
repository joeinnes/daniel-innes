import { writable } from 'svelte/store';
import type { Post } from '@prisma/client';

const posts = writable<Partial<Post>[]>([]);

export default posts;
