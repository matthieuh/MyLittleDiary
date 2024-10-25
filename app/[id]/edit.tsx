import { YStack } from "tamagui";
import { useSetAtom } from 'jotai'
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PostForm } from "@/components/post-form";
import { editPostAtom, usePost } from "@/state/atoms";
import { Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { formatDate } from "@/utils/format";
import { z } from "zod";
import { PostSchema } from "@/schemas";

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePost(id);

  useEffect(() => {
    if (post) {
      router.setParams({
        title: formatDate(post.createdAt, { day: 'numeric', month: 'long', year: 'numeric' }),
      });
    }
  }, [post?.createdAt]);


  const editPost = useSetAtom(editPostAtom);

  const handleSubmit = async (data: z.infer<typeof PostSchema>) => {
    await editPost({ id, state: data });
    router.dismiss();
  };

  return (
    <YStack fullscreen f={1} bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled">
        <PostForm
          onSubmit={handleSubmit}
          defaultValues={{
            content: post?.content || '',
            medias: post?.medias || [],
            audio: post?.audio,
            tagIds: post?.tagIds || [],
          }}
          submitText="Mettre à jour"
        />
      </ScrollView>
    </YStack>
  );
}
