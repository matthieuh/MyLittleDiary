import { getPostAtom, tagsAtom } from "@/state/atoms"
import { store } from "@/state/store"

export const postToText = async (postId: string) => {
  const [post, allTags] = await Promise.all([
    store.set(getPostAtom, postId),
    store.get(tagsAtom)
  ])

  console.log({ post })

  if (!post) return null

  const { createdAt, tagIds = [] } = post

  const tags = allTags.filter((tag) => tagIds.includes(tag.id));

  const date = new Date(createdAt).toLocaleDateString()
  const tagsString = tags.map(tag => tag.name).join(", ")

  const text = `${date}
  
${post.content}`

  if (tags.length) {
    return `${text}

Tags: ${tagsString}`
  }

  return text
}