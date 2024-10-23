import { useColorScheme } from 'react-native'
import { SplashScreen, Stack, useLocalSearchParams } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { TamaguiProvider } from "@tamagui/core";
import config from '../tamagui.config'
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
};

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
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{
          headerBlurEffect: colorScheme || 'light',
          headerTransparent: true,
        }}>
          <Stack.Screen
            name="index"
            options={{
              title: 'Mon Journal',
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

          <Stack.Screen
            name="[id]"
            options={({ route: { params: { title } } }: any) => ({ // TODO: avoid any 
              presentation: 'modal',
              title,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}