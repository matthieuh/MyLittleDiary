import { Post } from "@/components/post";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle, View, YStack } from "tamagui";
import { PenTool } from '@tamagui/lucide-icons'
import { postsAtom } from "@/state/atoms";
import { useAtomValue } from "jotai";
import { FlatList } from "react-native";

export default function Index() {
  const insets = useSafeAreaInsets();

  const posts = useAtomValue(postsAtom);

  return (
    <YStack fullscreen p="$4">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={posts}
        renderItem={
          ({ item, index }) => (
            <View py={index % 2 > 0 ? '$2' : '$4'}>
              <Post {...item} />
            </View>
          )}
      />
      <YStack
        pos="absolute"
        b="$4"
        r="$4">
        <Link href="/new">
          <Circle
            elevation={4}
            bg="$background"
            mb={insets.bottom}
            size="$6">
            <PenTool size="$2" />
          </Circle>
        </Link>
      </YStack>
    </YStack >
  );
}
