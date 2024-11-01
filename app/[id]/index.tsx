import { AudioPlayer } from '@/components/audio-player'
import { TagsByIds } from '@/components/tags-by-ids'
import { VideoPlayer } from '@/components/video-player'
import { usePost } from '@/state/atoms'
import { formatDate } from '@/utils/format'
import { getSizeKeepsAspectRatio } from '@/utils/media'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { Image, Paragraph, View, XStack, YStack } from 'tamagui'

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const post = usePost(id || '')

  if (!post) {
    return null
  }

  const { content, medias, audio, tagIds } = post

  return (
    <YStack fullscreen bg="$white1">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <YStack gap="$4">
          <FlatList
            data={medias}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: { type, uri, height, width } }) => {
              const mediaContainerProps = {
                px: '$2',
                pt: '$2',
              }
              const mediaProps = {
                source: { uri },
                ...getSizeKeepsAspectRatio({ height, width, maxHeight: 120 }),
                br: '$4',
                borderWidth: '$0.5',
                borderColor: '$gray5',
              }
              if (type === 'image')
                return (
                  <View key={uri} {...mediaContainerProps}>
                    <Image {...mediaProps} />
                  </View>
                )

              if (type === 'video')
                return (
                  <View key={uri} {...mediaContainerProps}>
                    <VideoPlayer {...mediaProps} />
                  </View>
                )

              return null
            }}
          />
          {audio && (
            <XStack>
              <AudioPlayer {...audio} mx="$4" />
            </XStack>
          )}
          <TagsByIds ids={tagIds || []} mx="$4" />
        </YStack>
        <Paragraph p="$4">{content}</Paragraph>
      </ScrollView>
    </YStack>
  )
}
