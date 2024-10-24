import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { AudioSchema, MediaSchema } from '@/components/post-form';
import { z } from 'zod';
import { atomWithDebounce } from '@/utils/jotai';

export type Post = {
  id: string;
  content: string;
  medias?: z.infer<typeof MediaSchema>[];
  audio?: z.infer<typeof AudioSchema>;
  createdAt: Date;
};

const storage = createJSONStorage<Post[]>(() => AsyncStorage)
export const postsAtom = atomWithStorage<Post[]>('posts', [], storage);

export const debouncedQueryAtom = atomWithDebounce('', 300);

export const orderedPostsAtom = atom(async get => {
  const posts = await get(postsAtom)
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

export const orderedAndFilteredByQueryPostsAtom = atom( async (get) => {
  const query = get(debouncedQueryAtom.debouncedValueAtom)
  const orderedPosts = await get(orderedPostsAtom)
  return query?.length ? orderedPosts.filter((post) => post.content.toLowerCase().includes(query.toLowerCase())) : orderedPosts
})

export const addPostAtom = atom(null, async (get, set, state: Omit<Post, 'id' | 'createdAt'>) => {
  const posts = await get(postsAtom)
  const newPost = { ...state, id: randomUUID(), createdAt: new Date() }
  set(postsAtom, [...posts, newPost])
})

export const usePost = (id: string) => {
  const posts = useAtomValue(postsAtom);
  return posts.find((post) => post.id === id);
}

export const deletePostAtom = atom(null, async (get, set, id: string) => {
  const posts = await get(postsAtom)
  set(postsAtom, posts.filter((post) => post.id !== id))
})