import { TagSchema } from "@/schemas"
import { Button, ButtonProps } from "tamagui"
import { z } from "zod"

export type TagProps = z.infer<typeof TagSchema> & ButtonProps & {
  isActive?: boolean
}

export const Tag = ({ isActive = false, id, name, ...props }: TagProps) => {
  return (
    <Button br="$10" size="$3" fontWeight="700" bg={isActive ? '$blue9' : '$blue3'} color={isActive ? '$white1' : '$blue9'} disabled={!props?.onPress} {...props}>
      {name}
    </Button>
  )
}