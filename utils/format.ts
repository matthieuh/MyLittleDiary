import { getLocales } from 'expo-localization';

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultLocale = getLocales()[0]?.languageCode || 'en';
  
  return new Intl.DateTimeFormat(defaultLocale, options).format(
    typeof date === 'string' ? new Date(date) : date
  );
}