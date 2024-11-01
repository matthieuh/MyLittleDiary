import { Tag, type TagProps } from '@/components/tags/tag'
import { Alert } from 'react-native'

type AddTagProps = TagProps & {
  onNewTag: (props: { tagName: string }) => void
}

export const AddTag = ({ onNewTag, ...rest }: AddTagProps) => (
  <Tag
    circular
    fontSize="$6"
    name="+"
    onPress={() => {
      Alert.prompt('Ajouter un nouveau tag', undefined, [
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ajouter',
          onPress: (tagName) => {
            if (tagName) onNewTag({ tagName })
          },
          isPreferred: true,
        },
      ])
    }}
    {...rest}
  />
)
