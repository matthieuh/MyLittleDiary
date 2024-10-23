import { YStack } from "tamagui";
import { useSetAtom } from 'jotai'
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PostForm } from "@/components/post-form";
import { addPostAtom, Post } from "@/state/atoms";
import { Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function New() {
  const addPost = useSetAtom(addPostAtom);

  const handleSubmit = async (data: Pick<Post, 'content'>) => {
    await addPost(data);
    router.dismiss();
  };

  return (
    <YStack fullscreen f={1} bg="$white1">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <PostForm onSubmit={handleSubmit} />
      </ScrollView>
    </YStack>
  );
}
