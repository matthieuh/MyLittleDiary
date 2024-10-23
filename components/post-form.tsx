import { View, Button, AnimatePresence, Spinner } from "tamagui";

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextAreaField } from "./textarea-field";

const PostSchema = z.object({
  content: z.string(),
})

const resolver = zodResolver(PostSchema)

type PostFormProps = {
  onSubmit: (data: z.infer<typeof PostSchema>) => Promise<void>
}

export const PostForm = (
  { onSubmit }: PostFormProps
) => {
  const {
    control,
    getValues,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<z.infer<typeof PostSchema>>({ resolver })

  return (
    <View bg="white" f={1} br="$4" minHeight={90} p="$4" gap="$4" tag="form">
      <Controller
        control={control}
        name="content"
        render={({ field }) => <TextAreaField field={field} error={errors?.content} placeholder="Contenu" />}
      />

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        iconAfter={
          <AnimatePresence>
            {isSubmitting && (
              <Spinner
                color="$color"
                key="loading-spinner"
                opacity={1}
                y={0}
                animation="quick"
                enterStyle={{
                  opacity: 0,
                  y: 4,
                }}
                exitStyle={{
                  opacity: 0,
                  y: 4,
                }}
              />
            )}
          </AnimatePresence>
        }
      >
        Publier
      </Button>
    </View >
  );
}