import { type MediaSchema, PostSchema } from '@/schemas'
import { addTagAtom, tagsAtom } from '@/state/atoms'
import { getSizeKeepsAspectRatio } from '@/utils/media'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FileVideo,
  ImagePlus,
  Mic,
  Minus,
  SendHorizontal,
  Tags,
  Trash,
} from '@tamagui/lucide-icons'
import type { Audio } from 'expo-av'
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AnimatePresence, Button, Image, Spinner, View, XStack } from 'tamagui'
import type { z } from 'zod'
import { TextAreaField } from '../form/textarea-field'
import { AudioPlayer } from '../medias/audio-player'
import { AudioRecorder } from '../medias/audio-recorder'
import { VideoPlayer } from '../medias/video-player'
import { AddTag } from '../tags/add-tag'
import { Tag } from '../tags/tag'

const resolver = zodResolver(PostSchema)

type PostFormProps = {
  onSubmit: (data: z.infer<typeof PostSchema>) => Promise<void>
  defaultValues?: z.infer<typeof PostSchema>
  submitText?: string
}

export const PostForm = ({
  onSubmit,
  defaultValues,
  submitText = 'Publier',
}: PostFormProps) => {
  const {
    control,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<z.infer<typeof PostSchema>>({ resolver, defaultValues })

  const tags = useAtomValue(tagsAtom)
  const addTag = useSetAtom(addTagAtom)

  const content = watch('content', defaultValues?.content)
  const medias = watch('medias', defaultValues?.medias || [])
  const audio = watch('audio', defaultValues?.audio)
  const tagIds = watch('tagIds', defaultValues?.tagIds || [])

  const [loadingMedia, setLoadingMedia] = useState<
    MediaTypeOptions | undefined
  >()
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false)
  const [isAddingTags, setIsAddingTags] = useState<boolean>(!!tagIds?.length)

  const pickMedia = (mediaTypes: MediaTypeOptions) => async () => {
    setLoadingMedia(mediaTypes)
    const result = await launchImageLibraryAsync({
      mediaTypes,
      allowsMultipleSelection: true,
    })
    setLoadingMedia(undefined)

    if (!result.canceled) {
      const newMedias: z.infer<typeof MediaSchema>[] = []
      for (const {
        type,
        uri,
        height,
        width,
        duration,
        mimeType,
      } of result.assets) {
        newMedias.push({
          type,
          uri,
          height,
          width,
          duration: duration || undefined,
          mimeType,
        })
      }

      setValue('medias', [...(getValues('medias') || []), ...newMedias])
    }
  }

  const addAudio = async (audio: Audio.Recording) => {
    const uri = audio.getURI()
    const { durationMillis } = await audio.getStatusAsync()

    if (uri) {
      setValue('audio', {
        uri,
        duration: durationMillis,
      })
    }
  }

  return (
    <View bg="white" f={1} br="$4" minHeight={90} p="$4" gap="$4" tag="form">
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <TextAreaField
            field={field}
            error={errors?.content}
            placeholder="Qu'est-ce qui te passe par la tête ?"
            autoFocus={!content}
          />
        )}
      />

      <AnimatePresence>
        {!!medias?.length && (
          <XStack gap="$4" flexWrap="wrap">
            {medias.map(({ type, uri, width, height }) => (
              <View key={uri} position="relative">
                {type === 'image' && (
                  <Image
                    source={{ uri }}
                    {...getSizeKeepsAspectRatio({
                      height,
                      width,
                      maxHeight: 120,
                    })}
                    br="$4"
                  />
                )}
                {type === 'video' && (
                  <VideoPlayer
                    source={{ uri }}
                    {...getSizeKeepsAspectRatio({
                      height,
                      width,
                      maxHeight: 120,
                    })}
                    br="$4"
                  />
                )}
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
                  onPress={() =>
                    setValue(
                      'medias',
                      medias.filter((media) => media.uri !== uri),
                    )
                  }
                />
              </View>
            ))}
          </XStack>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {audio && (
          <XStack gap="$2">
            <AudioPlayer {...audio} f={1} />
            <Button
              chromeless
              p={0}
              circular
              icon={<Trash size="$1" />}
              onPress={() => setValue('audio', undefined)}
            />
          </XStack>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRecordingAudio && (
          <AudioRecorder
            height={50}
            autoRecord
            onStop={(audio) => {
              setIsRecordingAudio(false)
              if (audio) addAudio(audio)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingTags && (
          <XStack gap="$2" flexWrap="wrap">
            {tags.map((tag) => {
              const isAdded = (tagIds || []).includes(tag.id)
              return (
                <Tag
                  key={tag.id}
                  {...tag}
                  isActive={isAdded}
                  onPress={() => {
                    if (isAdded) {
                      setValue(
                        'tagIds',
                        tagIds?.filter((tagId) => tagId !== tag.id),
                      )
                    } else
                      setValue('tagIds', [
                        ...(getValues('tagIds') || []),
                        tag.id,
                      ])
                  }}
                />
              )
            })}
            <AddTag onNewTag={({ tagName }) => addTag(tagName)} />
          </XStack>
        )}
      </AnimatePresence>

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
            )
          }
          px="$3"
          onPress={pickMedia(MediaTypeOptions.Videos)}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }}
        />
        <Button
          icon={<Mic size="$1" />}
          px="$3"
          onPress={() => setIsRecordingAudio(true)}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }}
        />
        <Button
          icon={<Tags size="$1" />}
          px="$3"
          onPress={() => setIsAddingTags((state) => !state)}
          hoverStyle={{ scale: 0.9 }}
          pressStyle={{ scale: 0.9 }}
        />
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
            ) : (
              <SendHorizontal size="$1" />
            )}
          </AnimatePresence>
        }
      >
        {submitText}
      </Button>
    </View>
  )
}
