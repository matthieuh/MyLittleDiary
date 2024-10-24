import { YStack } from "tamagui";
import { useSetAtom } from 'jotai'
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PostForm } from "@/components/post-form";
import { addPostAtom, Post, usePost } from "@/state/atoms";
import { Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { formatDate } from "@/utils/format";

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


  const addPost = useSetAtom(addPostAtom);

  const handleSubmit = async (data: Pick<Post, 'content'>) => {
    await addPost(data);
    router.dismiss();
  };

  return (
    <YStack fullscreen f={1} bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <PostForm
          onSubmit={handleSubmit}
          defaultValues={{
            content: post?.content || '',
            medias: post?.medias || [],
          }}
          submitText="Mettre à jour"
        />
      </ScrollView>
    </YStack>
  );
}
