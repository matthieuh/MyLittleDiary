import { View, Button, AnimatePresence, Spinner, XStack, Image } from "tamagui";

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextAreaField } from "./textarea-field";
import { FileVideo, ImagePlus, Mic, Tags } from "@tamagui/lucide-icons";
import { ImagePickerAsset, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { VideoPlayer } from "./video-player";
import { getSizeKeepsAspectRatio } from "@/utils/media";
import { useState } from "react";


export const MediaSchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  uri: z.string(),
  height: z.number(),
  width: z.number(),
  duration: z.number().optional(),
  mimeType: z.string().optional(),
})

const PostSchema = z.object({
  content: z.string(),
  medias: z.array(MediaSchema),
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
  } = useForm<z.infer<typeof PostSchema>>({ resolver, defaultValues: { medias: [] } });

  const medias = watch('medias', [])

  const [loadingMedia, setLoadingMedia] = useState<MediaTypeOptions | undefined>();

  const pickMedia = (mediaTypes: MediaTypeOptions) => async () => {
    setLoadingMedia(mediaTypes);
    let result = await launchImageLibraryAsync({
      mediaTypes,
      allowsMultipleSelection: true,
    });
    setLoadingMedia(undefined);

    if (!result.canceled) {
      const newMedias: z.infer<typeof MediaSchema>[] = []
      for (const { type, uri, height, width, duration, mimeType } of result.assets) {
        newMedias.push({
          type,
          uri,
          height,
          width,
          duration: duration || undefined,
          mimeType,
        })
      }

      setValue('medias', [
        ...(getValues('medias') || []),
        ...newMedias
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

      {!!medias.length && <XStack gap="$2" flexWrap="wrap">
        {medias.map(({ type, uri, width, height }) => {
          if (type === 'image')
            return <Image key={uri} source={{ uri }} {...getSizeKeepsAspectRatio({ height, width, maxHeight: 120 })} br="$4" />

          if (type === 'video')
            return <VideoPlayer key={uri} source={{ uri }} {...getSizeKeepsAspectRatio({ height, width, maxHeight: 120 })} br="$4" />
        })}
      </XStack>}

      <XStack gap="$2">
        <Button icon={
          loadingMedia === MediaTypeOptions.Images ? (
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
          ) : <ImagePlus size="$1" />
        } px="$3" onPress={pickMedia(MediaTypeOptions.Images)} />
        <Button icon={
          loadingMedia === MediaTypeOptions.Videos ? (
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
          ) : <FileVideo size="$1" />} px="$3" onPress={pickMedia(MediaTypeOptions.Videos)} />
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