import { writable } from 'svelte/store';
import type { Post } from '@prisma/client';

export interface PostWithFiles extends Post {
  files: string[];
  type: string;
}

const now = new Date();

const initialState = {
  type: 'none',
  title: '',
  text: '',
  post_date: now,
  visibility: 'friends',
  files: [],
  date_created: now,
};

export const currentPost = writable<Partial<PostWithFiles>>(initialState);

export const resetCurrentPost = () => {
  currentPost.set(initialState);
};