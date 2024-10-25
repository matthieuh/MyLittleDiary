import { useRef, useState } from "react";
import { Tag, TagProps } from "./tag"
import { Button, Input, Sheet, Text, XStack, YStack } from "tamagui";
import { ChevronDown } from "@tamagui/lucide-icons";
import { TextInput } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "./text-field";

const AddTagSchema = z.object({
  tagName: z.string().min(1),
})

const resolver = zodResolver(AddTagSchema)

type AddTagProps = TagProps & {
  onNewTag: (props: z.infer<typeof AddTagSchema>) => void
}

export const AddTag = ({ onNewTag, ...rest }: AddTagProps) => {
  const inputRef = useRef<TextInput | null>(null)
  const [isAdding, setIsAdding] = useState(false);

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<z.infer<typeof AddTagSchema>>({ resolver });

  return (
    <>
      <Tag circular fontSize="$6" name="+" onPress={() => {
        setIsAdding(true)
        inputRef.current?.focus()
      }} {...rest} />
      <Sheet
        forceRemoveScrollEnabled={isAdding}
        modal
        open={isAdding}
        onOpenChange={(isOpen: boolean) => {
          setIsAdding(isOpen)
          if (isOpen) {
            setTimeout(() => {
              inputRef.current?.focus()
            }, 300)
          }
        }}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        animation="medium"
        moveOnKeyboardChange
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$4" >
          <Text fontWeight="700" fontSize="$5">Ajouter un nouveau tag</Text>
          <XStack gap="$4" mt="$4">
            <YStack>
              <Controller
                control={control}
                name="tagName"
                render={({ field }) => <TextField ref={inputRef} error={errors?.tagName} width={200} placeholder="Nouveau tag" field={field} />}
              />
            </YStack>
            <Button
              onPress={handleSubmit((data) => {
                onNewTag(data)
                setIsAdding(false)
              })}
              disabled={isSubmitting}
            >
              Ajouter
            </Button>
          </XStack>


        </Sheet.Frame>
      </Sheet>
    </>
  )
}