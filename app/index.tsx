import { EmptyPostsState } from '@/components/empty-posts-state'
import { Post } from '@/components/post'
import { PostsFilter } from '@/components/posts-filter'
import { orderedAndFilteredByQueryPostsAtom, postsAtom } from '@/state/atoms'
import { PenTool } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useAtomValue } from 'jotai'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, View, YStack } from 'tamagui'

export default function Index() {
  const insets = useSafeAreaInsets()
  const posts = useAtomValue(orderedAndFilteredByQueryPostsAtom)
  const allPosts = useAtomValue(postsAtom)

  return (
    <YStack fullscreen mx="$4">
      {allPosts.length ? (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item, index }) => (
            <View py={index % 2 > 0 ? '$2' : '$4'}>
              <Post {...item} />
            </View>
          )}
          ListHeaderComponent={<PostsFilter mt="$4" />}
        />
      ) : (
        <EmptyPostsState />
      )}
      {!!allPosts.length && (
        <Button
          circular
          elevation={4}
          size="$6"
          bg="$white1"
          pos="absolute"
          b="$4"
          r="$4"
          mb={insets.bottom}
          onPress={() => router.push('/new')}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }}
          icon={<PenTool size="$2" />}
        />
      )}
    </YStack>
  )
}
