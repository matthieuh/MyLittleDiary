import { View, Button, AnimatePresence, Spinner, XStack, Image } from "tamagui";
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextAreaField } from "./textarea-field";
import { FileVideo, ImagePlus, Mic, Minus, MinusCircle, SendHorizontal, Tags, Trash } from "@tamagui/lucide-icons";
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { VideoPlayer } from "./video-player";
import { getSizeKeepsAspectRatio } from "@/utils/media";
import { useState } from "react";
import { AudioRecorder } from "./audio-recorder";
import { Audio } from "expo-av";
import { AudioPlayer } from "./audio-player";


export const MediaSchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  uri: z.string(),
  height: z.number(),
  width: z.number(),
  duration: z.number().optional(),
  mimeType: z.string().optional(),
})

export const AudioSchema = z.object({
  uri: z.string(),
  duration: z.number(),
})

const PostSchema = z.object({
  content: z.string(),
  medias: z.array(MediaSchema),
  audio: AudioSchema.optional(),
})

const resolver = zodResolver(PostSchema)

type PostFormProps = {
  onSubmit: (data: z.infer<typeof PostSchema>) => Promise<void>
  defaultValues?: z.infer<typeof PostSchema>
  submitText?: string
}

export const PostForm = (
  { onSubmit, defaultValues, submitText = 'Publier' }: PostFormProps
) => {
  const {
    control,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<z.infer<typeof PostSchema>>({ resolver, defaultValues: { medias: [], ...defaultValues } });

  const content = watch('content')
  const medias = watch('medias', [])
  const audio = watch('audio')

  const [loadingMedia, setLoadingMedia] = useState<MediaTypeOptions | undefined>();
  const [isRecordingAudio, setIsRecordingAudio] = useState<Boolean>(false);

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

  const addAudio = async (audio: Audio.Recording) => {
    const uri = audio.getURI();
    const { durationMillis } = await audio.getStatusAsync()

    if (uri) {
      setValue('audio', {
        uri,
        duration: durationMillis,
      });
    }
  }

  return (
    <View bg="white" f={1} br="$4" minHeight={90} p="$4" gap="$4" tag="form">
      <Controller
        control={control}
        name="content"
        render={({ field }) => <TextAreaField field={field} error={errors?.content} placeholder="Qu'est-ce qui te passe par la tête ?" autoFocus={!content} />}
      />

      {!!medias.length && (
        <XStack gap="$4" flexWrap="wrap">
          {medias.map(({ type, uri, width, height }) => (
            <View key={uri} position="relative">
              {type === 'image' && <Image source={{ uri }} {...getSizeKeepsAspectRatio({ height, width, maxHeight: 120 })} br="$4" />}
              {type === 'video' && <VideoPlayer source={{ uri }} {...getSizeKeepsAspectRatio({ height, width, maxHeight: 120 })} br="$4" />}
              <Button
                size="$2"
                position="absolute"
                t="$-2"
                r="$-2"
                p={0}
                bg="$red9"
                circular
                icon={<Minus size="$1" color="$accentBackground" />} 
                hoverStyle={{ scale: 0.9 }}
                pressStyle={{ scale: 0.9 }}
                onPress={() => setValue('medias', medias.filter(media => media.uri !== uri))}
              />
            </View>
          ))}
        </XStack>
      )}

      {audio && <XStack gap="$2">
        <AudioPlayer {...audio} f={1} />
        <Button chromeless p={0} circular icon={<Trash size="$1" />} onPress={() => setValue('audio', undefined)} />
      </XStack>}

      {isRecordingAudio && <AudioRecorder height={50} autoRecord onStop={(audio) => {
        setIsRecordingAudio(false)
        if (audio) addAudio(audio)
      }} />}

      <XStack gap="$2">
        <Button
          icon={
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
            ) : (
              <ImagePlus size="$1" />
            )
          }
          px="$3"
          onPress={pickMedia(MediaTypeOptions.Images)}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }}
        />
        <Button
          icon={
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
            ) : (
              <FileVideo size="$1" />
            )}
          px="$3"
          onPress={pickMedia(MediaTypeOptions.Videos)}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }}
        />
        <Button icon={<Mic size="$1" />} px="$3" onPress={() => setIsRecordingAudio(true)} hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }} />
        {/* <Button icon={<Tags size="$1" />} px="$3" /> */}
      </XStack>

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        hoverStyle={{ scale: 0.9 }}
        pressStyle={{ scale: 0.9 }}
        fontWeight="700"
        fontSize="$5"
        iconAfter={
          <AnimatePresence>
            {isSubmitting ? (
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
            ) : <SendHorizontal size="$1" />}
          </AnimatePresence>
        }
      >
        {submitText}
      </Button>
    </View >
  );
}