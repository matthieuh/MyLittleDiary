import { Image, Paragraph, View, YStack } from "tamagui";
import { router, useLocalSearchParams } from 'expo-router';
import { usePost } from "@/state/atoms";
import { useEffect } from "react";
import { formatDate } from "@/utils/format";
import { Platform } from "react-native";
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { VideoPlayer } from "@/components/video-player";

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

  const { content, medias } = post;

  return (
    <YStack fullscreen bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlatList
          data={medias}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: { type, uri } }) => {
            const mediaContainerProps = {
              px: '$2',
            }
            const mediaProps = {
              key: uri,
              source: { uri },
              h: 120,
              w: 120,
              br: "$4",
              borderWidth: "$0.5",
              borderColor: "$gray5"
            }
            if (type === 'image')
              return <View {...mediaContainerProps}><Image {...mediaProps} /></View>

            if (type === 'video')
              return <View {...mediaContainerProps}><VideoPlayer {...mediaProps} /></View>

            return null
          }}
        />
        <Paragraph p="$4">
          {content}
        </Paragraph>
      </ScrollView>
    </YStack>
  );
}
