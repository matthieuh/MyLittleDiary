import { router } from "expo-router";
import { Card, Paragraph, Text } from "tamagui";

import { Post as PostType } from "@/state/atoms";
import { formatDate } from "@/utils/format";
import { useEffect } from "react";

export type PostProps = PostType;

export const Post = ({ id, content, createdAt }: PostProps) => {
  return (
    <Card
      bg="$white1"
      f={1}
      br="$4"
      p="$4"
      hoverStyle={{ scale: 0.98 }}
      pressStyle={{ scale: 0.98 }}
      onPress={() => router.push(`/${id}`)}
    >
      {createdAt && <Text fontWeight="700" mb="$2">{formatDate(createdAt)}</Text>}
      <Paragraph numberOfLines={1}>{content}</Paragraph>
    </Card>
  );
}