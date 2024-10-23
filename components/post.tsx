import { router } from "expo-router";
import { Card, getTokens, Image, Paragraph, Separator, Text, XStack } from "tamagui";

import { Post as PostType } from "@/state/atoms";
import { formatDate } from "@/utils/format";
import { useState } from "react";

export type PostProps = PostType;

const CARD_PADDING = '$4'
const PICTURE_OVERLAPPING = 20
const PICTURE_WIDTH = 60

export const Post = ({ id, content, images = [], createdAt }: PostProps) => {
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
        <Text fontWeight="700" mb="$2" fontFamily="$mono">{formatDate(createdAt)}</Text><Text fontSize="$2"> à {formatDate(createdAt, {
          hour: 'numeric',
          minute: 'numeric',
        })}</Text>
      </XStack>}
      <Paragraph numberOfLines={1}>{content}</Paragraph>
      {!!images.length && (<Separator my="$2" />)}
      {!!images.length && (
        <XStack>
          {images.slice(0, nbPicturesDisplayable).map((image, index) => <XStack elevation="$1"><Image key={image} source={{ uri: image }} h={PICTURE_WIDTH} w={PICTURE_WIDTH} br="$2" {...(index > 0 && { ml: -PICTURE_OVERLAPPING })} /></XStack>)}
          {images.length > nbPicturesDisplayable && (
            <XStack elevation="$1" bg="$white2" h={PICTURE_WIDTH} w={PICTURE_WIDTH} br="$2" jc="center" ai="center" ml={-PICTURE_OVERLAPPING} borderWidth="$0.5" borderColor="$gray6">
              <Text fontSize="$6" color="$gray11">+{images.length - nbPicturesDisplayable}</Text>
            </XStack>
          )}
        </XStack>
      )}

    </Card>
  );
}