import { useTagsByIds } from "@/state/atoms";
import { XStack, XStackProps } from "tamagui";
import { Tag, TagProps } from "./tag";

export type TagsProps = XStackProps & {
  ids: string[];
  tagProps?: Partial<TagProps>;
}

export const TagsByIds = ({ ids, tagProps = {}, ...rest }: TagsProps) => {
  const tagsByIds = useTagsByIds(ids)

  return (
    <XStack gap="$2" flexWrap="wrap" {...rest}>
      {tagsByIds.map((tag) => (
        <Tag key={tag.id} name={tag.name} isActive {...tagProps} />
      ))}
    </XStack>
  )
}