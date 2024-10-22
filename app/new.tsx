import { PostForm } from "@/components/post-form";
import { YStack } from "tamagui";

import { useAtomValue, useSetAtom } from 'jotai'
import { addPostAtom, Post } from "@/state/atoms";
import { router } from 'expo-router';

export default function New() {
  const addPost = useSetAtom(addPostAtom);

  const handleSubmit = (data: Post) => {
    addPost(data);
    router.dismiss();
  };

  return (
    <YStack fullscreen>
      <PostForm onSubmit={handleSubmit} />
    </YStack>
  );
}
