import { formatDuration } from '@/utils/format'
import { PauseCircle, PlayCircle, Save, Trash } from '@tamagui/lucide-icons'
import { Audio } from 'expo-av'
import { useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import Animated, {
  ReduceMotion,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated'
import { Button, Text, XStack, getTokens } from 'tamagui'

type AudioRecorderProps = {
  onStop: (audio?: Audio.Recording) => void
  autoRecord?: boolean
  height?: number
}

export const AudioRecorder = ({
  height = 50,
  autoRecord = false,
  onStop,
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState<Audio.Recording>()
  const [duration, setDuration] = useState<number>(0)
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [temp, setTemp] = useState([0])
  const tempRef = useRef({ temp: [0] })
  const width = useSharedValue(10)

  useEffect(() => {
    if (autoRecord) {
      startRecording()
    }
  }, [autoRecord])

  const customEasing = (value: number) => {
    'worklet'
    return value
  }

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(width.value, {
        duration: 100,
        easing: customEasing,
        reduceMotion: ReduceMotion.Never,
      }),
    }
  })

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission()
      }
      setIsRecording(true)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (err) {
      console.error('Failed to start recording', err)
    }

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      (status) => {
        if (status.isRecording && status.metering) {
          setDuration(status.durationMillis)
          const temp1 = [...tempRef.current.temp, status.metering + height]
          tempRef.current.temp = temp1

          setTemp(temp1)
          width.value = width.value + 6 + 4
        }
      },
    )
    setRecording(recording)
  }

  async function stopRecording() {
    setIsRecording(false)
    if (recording) {
      const { durationMillis } = await recording.getStatusAsync()
      await recording.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })
      recording._finalDurationMillis = durationMillis // Hack to keep the duration after stopAndUnloadAsync
      setRecording(recording)
    }
  }

  return (
    <XStack gap="$2">
      <Button
        icon={<Trash size="$$1.5" />}
        px="$3"
        chromeless
        onPress={() => {
          setRecording(undefined)
          setDuration(0)
          onStop?.()
        }}
      />
      <XStack px="$4" py="$2" bg="$green8" gap="$2" br="$10" ai="center" f={1}>
        <Button
          icon={
            isRecording ? (
              <PauseCircle size="$1.5" />
            ) : (
              <PlayCircle size="$1.5" />
            )
          }
          onPress={isRecording ? stopRecording : startRecording}
          unstyled
          color="$white1"
        />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {duration > 0 && (
            <Animated.View
              style={{
                backgroundColor: getTokens().color.$green8Light.val,
                display: 'flex',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                flex: 1,
                height: '100%',
              }}
            >
              <Animated.View
                entering={SlideInRight}
                style={[
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    overflow: 'hidden',
                    backgroundColor: getTokens().color.$green8Light.val,
                    gap: 6,
                    alignItems: 'center',
                  },
                  style,
                ]}
              >
                {temp.map((t, index) => {
                  return (
                    <Animated.View
                      key={crypto.randomUUID()}
                      entering={ZoomIn}
                      style={{
                        height: t > 6 ? t : 6,
                        width: 4,
                        borderRadius: 200,
                        backgroundColor: getTokens().color.$white1.val,
                      }}
                    />
                  )
                })}
              </Animated.View>
            </Animated.View>
          )}
        </ScrollView>
        <Text color="$white1" fontWeight="700">
          {formatDuration(duration)}
        </Text>
      </XStack>
      <Button
        icon={<Save size="$1.5" />}
        px="$3"
        chromeless
        onPress={async () => {
          if (isRecording) await stopRecording()
          if (onStop && recording) {
            onStop(recording)
          }
          setRecording(undefined)
          setIsRecording(false)
          setDuration(0)
        }}
      />
    </XStack>
  )
}
