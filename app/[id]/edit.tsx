import { router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useSetAtom } from 'jotai'
import { YStack } from 'tamagui'

import { PostForm } from '@/components/post-form'
import type { PostSchema } from '@/schemas'
import { editPostAtom, usePost } from '@/state/atoms'
import { formatDate } from '@/utils/format'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import type { z } from 'zod'

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const post = usePost(id || '')

  useEffect(() => {
    if (post) {
      router.setParams({
        title: formatDate(post.createdAt, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      })
    }
  }, [post])

  const editPost = useSetAtom(editPostAtom)

  const handleSubmit = async (data: z.infer<typeof PostSchema>) => {
    if (!id) return
    await editPost({ id, state: data })
    router.dismiss()
  }

  if (!post) return null

  return (
    <YStack fullscreen f={1} bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <PostForm
          onSubmit={handleSubmit}
          defaultValues={{
            content: post?.content || '',
            medias: post?.medias || [],
            audio: post?.audio,
            tagIds: post?.tagIds || [],
          }}
          submitText="Mettre à jour"
        />
      </ScrollView>
    </YStack>
  )
}
