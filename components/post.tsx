import { Post as PostType } from "@/state/atoms";
import { Text, View } from "tamagui";

export type PostProps = PostType;

export const Post = ({ content }: PostProps) => {
  return (
    <View bg="$white1" f={1} br="$4" minHeight={90} p="$4">
      <Text>{content}</Text>
    </View>
  );
}