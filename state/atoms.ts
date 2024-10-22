import { atom } from 'jotai'

export type Post = {
  content: string;
};

export const postsAtom = atom<Post[]>([]);

export const addPostAtom = atom(null, (get, set, state: Post) => {
  const posts = get(postsAtom)
  set(postsAtom, [...posts, state])
})