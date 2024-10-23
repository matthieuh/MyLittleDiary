import { atom, useAtomValue } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { MediaSchema } from '@/components/post-form';
import { z } from 'zod';

export type Post = {
  id: string;
  content: string;
  medias?: z.infer<typeof MediaSchema>[];
  createdAt: Date;
};

const storage = createJSONStorage<Post[]>(() => AsyncStorage)
export const postsAtom = atomWithStorage<Post[]>('posts', [], storage);

export const addPostAtom = atom(null, async (get, set, state: Pick<Post, 'content'>) => {
  const posts = await get(postsAtom)
  const newPost = { ...state, id: randomUUID(), createdAt: new Date() }
  set(postsAtom, [...posts, newPost])
  // set(postsAtom, [])
})

export const usePost = (id: string) => {
  const posts = useAtomValue(postsAtom);
  return posts.find((post) => post.id === id);
}