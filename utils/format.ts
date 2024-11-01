import { getLocales } from 'expo-localization'

export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
) => {
  const defaultLocale = getLocales()[0]?.languageCode || 'en'

  return new Intl.DateTimeFormat(defaultLocale, options).format(
    typeof date === 'string' ? new Date(date) : date,
  )
}

export const formatDuration = (durationInMs: number) => {
  const durationInSeconds = durationInMs / 1000
  const minutes = Math.floor(durationInSeconds / 60)
  const seconds = Math.floor(durationInSeconds % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
