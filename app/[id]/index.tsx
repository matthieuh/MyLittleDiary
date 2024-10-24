import { Image, Paragraph, View, XStack, YStack } from "tamagui";
import { router, useLocalSearchParams } from 'expo-router';
import { usePost } from "@/state/atoms";
import { useEffect } from "react";
import { formatDate } from "@/utils/format";
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { VideoPlayer } from "@/components/video-player";
import { AudioPlayer } from "@/components/audio-player";
import { useActionSheet } from '@expo/react-native-action-sheet';

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

  const { content, medias, audio } = post;

  return (
    <YStack fullscreen bg="$white1">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <YStack gap="$4">
          <FlatList
            data={medias}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: { type, uri } }) => {
              const mediaContainerProps = {
                px: '$2',
                pt: '$2',
              }
              const mediaProps = {
                source: { uri },
                h: 120,
                w: 120,
                br: "$4",
                borderWidth: "$0.5",
                borderColor: "$gray5"
              }
              if (type === 'image')
                return <View key={uri} {...mediaContainerProps}><Image {...mediaProps} /></View>

              if (type === 'video')
                return <View key={uri} {...mediaContainerProps}><VideoPlayer {...mediaProps} /></View>

              return null
            }}
          />
          {audio && <XStack><AudioPlayer {...audio} mx="$4" /></XStack>}
        </YStack>
        <Paragraph p="$4">
          {content}
        </Paragraph>
      </ScrollView>
    </YStack>
  );
}
