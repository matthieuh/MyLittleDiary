import { Button, type ButtonProps } from 'tamagui'

export type TagProps = ButtonProps & {
  isActive?: boolean
  name?: string
}

export const Tag = ({ isActive = false, name, ...props }: TagProps) => {
  return (
    <Button
      br="$10"
      size="$3"
      fontWeight="700"
      bg={isActive ? '$blue9' : '$blue3'}
      color={isActive ? '$white1' : '$blue9'}
      disabled={!props?.onPress}
      {...props}
    >
      {name}
    </Button>
  )
}
