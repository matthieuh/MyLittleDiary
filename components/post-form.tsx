import { View, Button, AnimatePresence, Spinner, XStack, Image } from "tamagui";

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { TextAreaField } from "./textarea-field";
import { FileVideo, ImagePlus, Mic, Tags } from "@tamagui/lucide-icons";
import * as ImagePicker from 'expo-image-picker';

const PostSchema = z.object({
  content: z.string(),
  images: z.array(z.string())
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
    setValue,
    getValues,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<z.infer<typeof PostSchema>>({ resolver, defaultValues: { images: [] } });

  const images = watch('images', [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    console.log(result);

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setValue('images', [
        ...getValues('images'),
        ...uris
      ]);
    }
  };

  return (
    <View bg="white" f={1} br="$4" minHeight={90} p="$4" gap="$4" tag="form">
      <Controller
        control={control}
        name="content"
        render={({ field }) => <TextAreaField field={field} error={errors?.content} placeholder="Qu'est-ce qui te passe par la tête ?" />}
      />

      {!!images.length && <XStack gap="$2" flexWrap="wrap">
        {images.map((image: string) => <Image source={{ uri: image }} h={60} w={60} />)}
      </XStack>}

      <XStack gap="$2">
        <Button icon={<ImagePlus size="$1" />} px="$3" onPress={pickImage} />
        <Button icon={<FileVideo size="$1" />} px="$3" />
        <Button icon={<Mic size="$1" />} px="$3" />
        <Button icon={<Tags size="$1" />} px="$3" />
      </XStack>

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