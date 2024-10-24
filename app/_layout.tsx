import { useEffect } from 'react';
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { TamaguiProvider } from "@tamagui/core";
import { Button, XStack } from 'tamagui';
import { ArrowLeft, Ellipsis, FileEdit } from '@tamagui/lucide-icons';

import config from '../tamagui.config'

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
    <GestureHandlerRootView>
      <ActionSheetProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
          {...rest}
        >{
            children}
        </TamaguiProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const { showActionSheetWithOptions } = useActionSheet();

  return (

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
          name="[id]/index"
          options={({ route: { params: { id, title } } }: any) => ({ // TODO: avoid any 
            title,
            headerBackTitleVisible: false,
            headerLeft: () => <Button circular size="$3" icon={<ArrowLeft />} scaleIcon={1.6} onPress={() => router.back()} />,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: () => (
              <XStack gap="$2">
                <Button circular size="$3" icon={<FileEdit />} scaleIcon={1.6} onPress={() => router.replace(`/${id}/edit`)} />
                <Button circular size="$3" icon={<Ellipsis />} scaleIcon={1.6} onPress={() => {
                    showActionSheetWithOptions({
                      options: ['Supprimer', 'Annuler'],
                      cancelButtonIndex: 1,
                      destructiveButtonIndex: 0,
                    }, (buttonIndex) => {
                      if (buttonIndex === 0) {
                        console.log('delete')
                      }
                    })
                }} />
              </XStack>
            ),
          })}
        />

        <Stack.Screen
          name="[id]/edit"
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
  )
}