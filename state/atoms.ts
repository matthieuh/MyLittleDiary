import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Post = {
  content: string;
};

const storage = createJSONStorage<Post[]>(() => AsyncStorage)
export const postsAtom = atomWithStorage<Post[]>('posts', [], storage);

export const addPostAtom = atom(null, async (get, set, state: Post) => {
  const posts = await get(postsAtom)
  set(postsAtom, [...posts, state])
})