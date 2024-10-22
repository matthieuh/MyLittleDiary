import { useColorScheme } from 'react-native'
import { SplashScreen, Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { TamaguiProvider } from "@tamagui/core";
import config from '../tamagui.config'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

const Providers = ({ children, ...rest }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >{
        children}
    </TamaguiProvider>
  )
}


function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Mon Journal',
            headerTransparent: true,
            headerBlurEffect: colorScheme || 'light',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            presentation: 'modal',
            title: 'Nouveau Post',
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}