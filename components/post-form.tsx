import { View, Text, Button } from "tamagui";

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextAreaField } from "./textarea-field";

const PostSchema = z.object({
  content: z.string(),
})

const resolver = zodResolver(PostSchema)

type PostFormProps = {
  onSubmit: (data: z.infer<typeof PostSchema>) => void
}

export const PostForm = (
  { onSubmit }: PostFormProps
) => {
  const { control, getValues, formState: { errors }, handleSubmit } = useForm<z.infer<typeof PostSchema>>({
    resolver,
  })

  console.log({ values: getValues() })


  console.log({ errors })

  return (
    <View bg="white" f={1} br="$4" minHeight={90} p="$4" gap="$4">
      <Controller control={control} name="content" render={({ field }) => (
        <TextAreaField field={field} error={errors?.content} />
      )} />

      <Button onPress={handleSubmit(onSubmit)}>Publier</Button>
    </View>
  );
}