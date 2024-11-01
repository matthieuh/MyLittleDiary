import { getPostAtom, tagsAtom } from '@/state/atoms'
import { store } from '@/state/store'

export const postToHtml = async (postId: string) => {
  const [post, allTags] = await Promise.all([
    store.set(getPostAtom, postId),
    store.get(tagsAtom),
  ])

  console.log({ post })

  if (!post) return null

  const { createdAt, tagIds = [] } = post

  const tags = allTags.filter((tag) => tagIds.includes(tag.id))

  const date = new Date(createdAt).toLocaleDateString()
  const tagsString = tags.map((tag) => tag.name).join(', ')

  return `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1>${date}</h1>
    <p>${post.content}</p>
    ${tags.length ? `<p>Tags: ${tagsString}</p>` : ''}
  </body>
</html>
`
}
