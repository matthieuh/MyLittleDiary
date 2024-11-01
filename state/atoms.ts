import type { PostSchema } from '@/schemas'
import { atomWithDebounce } from '@/utils/jotai'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

export type Post = z.infer<typeof PostSchema> & {
  id: string
  createdAt: Date
}

export type Tag = {
  id: string
  name: string
}

const postsStorage = createJSONStorage<Post[]>(() => AsyncStorage)
export const postsAtom = atomWithStorage<Post[]>('posts', [], postsStorage)

const tagsStorage = createJSONStorage<Tag[]>(() => AsyncStorage)
export const tagsAtom = atomWithStorage<Tag[]>(
  'tags',
  [
    { id: 'colere', name: 'Colère' },
    { id: 'honte', name: 'Honte' },
    { id: 'inquietude', name: 'Inquiétude' },
    { id: 'joie', name: 'Joie' },
    { id: 'peur', name: 'Peur' },
    { id: 'tristesse', name: 'Tristesse' },
    { id: 'surprise', name: 'Surprise' },
    { id: 'satisfaction', name: 'Satisfaction' },
  ],
  tagsStorage,
)

export const debouncedQueryAtom = atomWithDebounce('', 300)

export const orderedPostsAtom = atom(async (get) => {
  const posts = await get(postsAtom)
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
})

export const orderedAndFilteredByQueryPostsAtom = atom(async (get) => {
  const query = get(debouncedQueryAtom.debouncedValueAtom)
  const orderedPosts = await get(orderedPostsAtom)
  return query?.length
    ? orderedPosts.filter((post) =>
        post.content.toLowerCase().includes(query.toLowerCase()),
      )
    : orderedPosts
})

export const addPostAtom = atom(
  null,
  async (get, set, state: z.infer<typeof PostSchema>) => {
    const posts = await get(postsAtom)
    const newPost = { ...state, id: randomUUID(), createdAt: new Date() }
    set(postsAtom, [...posts, newPost])
  },
)

export const editPostAtom = atom(
  null,
  async (
    get,
    set,
    { id, state }: { id: string; state: z.infer<typeof PostSchema> },
  ) => {
    const posts = await get(postsAtom)
    set(
      postsAtom,
      posts.map((post) => (post.id === id ? { ...post, ...state } : post)),
    )
  },
)

export const deletePostAtom = atom(null, async (get, set, id: string) => {
  const posts = await get(postsAtom)
  set(
    postsAtom,
    posts.filter((post) => post.id !== id),
  )
})

export const getPostAtom = atom(null, async (get, set, id: string) => {
  const posts = await get(postsAtom)
  return posts.find((post) => post.id === id)
})

export const usePost = (id: string) => {
  const getPost = useSetAtom(getPostAtom)
  const [post, setPost] = useState<Post | undefined>()

  useEffect(() => {
    const fetchPost = async () => {
      const result = await getPost(id)
      setPost(result)
    }
    fetchPost()
  }, [getPost, id])

  return post
}
export const useTagsByIds = (tagIds: string[] = []) => {
  const tags = useAtomValue(tagsAtom)
  return tags.filter((tag) => tagIds.includes(tag.id))
}

export const addTagAtom = atom(null, async (get, set, name: string) => {
  const tags = await get(tagsAtom)
  set(tagsAtom, [...tags, { id: randomUUID(), name }])
})
