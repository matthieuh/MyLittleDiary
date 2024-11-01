import { debouncedQueryAtom } from '@/state/atoms'
import { Search } from '@tamagui/lucide-icons'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'
import { Input, Text, View, type ViewProps, YStack } from 'tamagui'

export const PostsFilter = (props: ViewProps) => {
  const inputRef = useRef(null)
  const setDebouncedQuery = useSetAtom(debouncedQueryAtom.debouncedValueAtom)
  const debouncedQuery = useAtomValue(debouncedQueryAtom.debouncedValueAtom)

  return (
    <YStack>
      <View {...props} jc="center" mb="$4">
        <Input
          ref={inputRef}
          placeholder="Rechercher par mot clé"
          onChangeText={setDebouncedQuery}
          pl={40}
          clearButtonMode="always"
        />
        <View ai="center" position="absolute" w={40}>
          <Search color="$placeholderColor" />
        </View>
      </View>
      <Text fontWeight="700">
        {debouncedQuery?.length
          ? `Mes posts contenant "${debouncedQuery}"`
          : 'Tous mes posts'}
      </Text>
    </YStack>
  )
}
