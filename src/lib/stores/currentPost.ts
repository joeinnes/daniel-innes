import { writable } from 'svelte/store';
import type { Post } from '@prisma/client';

enum Type {
  Text = 'text',
  Photo = 'photo',
  Video = 'video',
  Audio = 'audio',
  Quote = 'quote',
  None = 'none'
}

interface SerialisablePost extends Omit<Post, 'post_date'> {
  post_date: string;
  files: string[];
  type: Type;
}

const now = new Date();

const initialState = {
  type: Type.None,
  title: '',
  text: '',
  post_date: now.toISOString().slice(0, -8),
  visibility: 'friends',
  files: [],
  date_created: now,
};

export const currentPost = writable<Partial<SerialisablePost>>(initialState);

export const resetCurrentPost = () => {
  currentPost.set(initialState);
};