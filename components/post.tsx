import { router } from "expo-router";
import { Card, getTokens, Image, Paragraph, Separator, Text, View, XStack, YStack } from "tamagui";

import { Post as PostType } from "@/state/atoms";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { getSizeKeepsAspectRatio } from "@/utils/media";
import { VideoPlayer } from "./video-player";
import { AudioPlayer } from "./audio-player";
import { TagsByIds } from "./tags-by-ids";

export type PostProps = PostType;

const CARD_PADDING = '$4'
const PICTURE_OVERLAPPING = 10
const PICTURE_WIDTH = 60

export const Post = ({ id, content, medias = [], audio, tagIds, createdAt }: PostProps) => {
  const [nbPicturesDisplayable, setNbPicturesDisplayable] = useState(3);

  return (
    <Card
      bg="$white1"
      f={1}
      br="$4"
      p={CARD_PADDING}
      hoverStyle={{ scale: 0.98 }}
      pressStyle={{ scale: 0.98 }}
      onPress={() => router.push(`/${id}`)}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        const padding = getTokens().space[CARD_PADDING].val
        const availableSpace = width - (padding * 2);
        const count = Math.floor((availableSpace - PICTURE_WIDTH) / (PICTURE_WIDTH - PICTURE_OVERLAPPING));

        setNbPicturesDisplayable(count);
      }}
    >
      {createdAt && <XStack ai="baseline">
        <Text fontWeight="700" mb="$2" fontFamily="$mono">{formatDate(createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
      </XStack>}
      <Paragraph numberOfLines={1}>{content}</Paragraph>
      {!!(medias.length || audio || tagIds) && <Separator my="$2" />}
      <YStack gap="$2">
        {!!medias.length && (
          <XStack>
            {medias.slice(0, nbPicturesDisplayable).map(({ type, uri, width, height }, index) => {
              const mediaContainerProps = {
                elevation: '$1',
                ...(index > 0 && { ml: -PICTURE_OVERLAPPING })
              }
              const mediaProps = {
                source: { uri },
                ...getSizeKeepsAspectRatio({ height, width, maxHeight: 60, maxWidth: PICTURE_WIDTH }),
                br: "$4"
              }
              if (type === 'image')
                return <View key={uri} {...mediaContainerProps}><Image {...mediaProps} /></View>

              if (type === 'video')
                return <View key={uri} {...mediaContainerProps}><VideoPlayer {...mediaProps} controllable={false} /></View>
            })}
            {medias.length > nbPicturesDisplayable && (
              <XStack elevation="$1" bg="$white2" h={PICTURE_WIDTH} w={PICTURE_WIDTH} br="$2" jc="center" ai="center" ml={-PICTURE_OVERLAPPING} borderWidth="$0.5" borderColor="$gray6">
                <Text fontSize="$6" color="$gray11">+{medias.length - nbPicturesDisplayable}</Text>
              </XStack>
            )}
          </XStack>
        )}
        {audio && <XStack><AudioPlayer {...audio} fontSize="$1" iconSize="$1" /></XStack>}
        <TagsByIds ids={tagIds || []} tagProps={{ size: '$2' }} />
      </YStack>
    </Card>
  );
}