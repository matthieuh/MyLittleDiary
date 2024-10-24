import { Post } from "@/components/post";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, View, YStack } from "tamagui";
import { PenTool } from '@tamagui/lucide-icons'
import { orderedAndFilteredByQueryPostsAtom } from "@/state/atoms";
import { useAtomValue } from "jotai";
import { FlatList } from "react-native";
import { PostsFilter } from "@/components/posts-filter";

export default function Index() {
  const insets = useSafeAreaInsets();

  const posts = useAtomValue(orderedAndFilteredByQueryPostsAtom);

  return (
    <YStack fullscreen mx="$4">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        data={posts}
        renderItem={
          ({ item, index }) => (
            <View py={index % 2 > 0 ? '$2' : '$4'}>
              <Post {...item} />
            </View>
          )}
        ListHeaderComponent={<PostsFilter  mt="$4" />}
      />
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
      >
      </Button >
    </YStack >
  );
}
