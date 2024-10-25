import { z } from "zod"

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

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const PostSchema = z.object({
  content: z.string(),
  medias: z.array(MediaSchema).optional(),
  audio: AudioSchema.optional(),
  tagIds: z.array(z.string()).optional(),
})