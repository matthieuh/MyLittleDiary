import { PenTool } from "@tamagui/lucide-icons"
import { router } from "expo-router"
import { YStack, Text, YStackProps, Button } from "tamagui"


type EmptyPostsStateProps = YStackProps

export const EmptyPostsState = (props: EmptyPostsStateProps) => (
  <YStack {...props} jc="center" ai="center" flex={1} gap="$6">
    <Text textAlign="center" fontSize="$8" color="$gray10">Aucun post</Text>
    <Button bg="$white1" size="$5" fontWeight="700" iconAfter={<PenTool size="$1" />} onPress={() => router.navigate('/new')}>Ajouter mon 1er post</Button>
  </YStack>
)