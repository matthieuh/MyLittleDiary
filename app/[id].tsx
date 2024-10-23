import { Paragraph, YStack } from "tamagui";
import { router, useLocalSearchParams } from 'expo-router';
import { usePost } from "@/state/atoms";
import { Post } from "@/components/post";
import { useEffect } from "react";
import { formatDate } from "@/utils/format";
import { Platform, View } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePost(id);

  useEffect(() => {
    if (post) {
      router.setParams({
        title: formatDate(post.createdAt),
      });
    }
  }, [post?.createdAt]);

  if (!post) {
    return null;
  }

  return (
    <YStack fullscreen bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Paragraph p="$4">
          {post.content}
        </Paragraph>
      </ScrollView>
    </YStack>
  );
}
