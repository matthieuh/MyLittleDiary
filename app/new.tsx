import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useSetAtom } from 'jotai'
import { YStack } from 'tamagui'

import { PostForm } from '@/components/posts/post-form'
import type { PostSchema } from '@/schemas'
import { addPostAtom } from '@/state/atoms'
import { Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import type { z } from 'zod'

export default function New() {
  const addPost = useSetAtom(addPostAtom)

  const handleSubmit = async (data: z.infer<typeof PostSchema>) => {
    await addPost(data)
    router.dismiss()
  }

  return (
    <YStack fullscreen f={1} bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <PostForm onSubmit={handleSubmit} />
      </ScrollView>
    </YStack>
  )
}
