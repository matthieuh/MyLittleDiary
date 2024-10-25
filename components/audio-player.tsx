import { formatDuration } from '@/utils/format';
import { PauseCircle, PlayCircle } from '@tamagui/lucide-icons';
import { Audio } from 'expo-av';
import { ComponentProps, useEffect, useState } from 'react';
import { Button, ButtonProps, Text, TextProps, XStack, XStackProps } from 'tamagui'


type AudioPlayerProps = XStackProps & {
  uri: string;
  duration: number;
  controllable?: boolean;
  fontSize?: TextProps['fontSize'];
  iconSize?: ComponentProps<typeof PlayCircle>['size'];
};

export const AudioPlayer = ({ uri, duration, controllable = true, fontSize, iconSize = "$1.5", ...rest }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const [position, setPosition] = useState<number>(0);

  async function playSound() {
    setIsPlaying(true);
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      undefined,
      (status) => {
        if (status.isLoaded && status.durationMillis) {
          setPosition(status.positionMillis);
        }

        setIsPlaying(status.isLoaded && status.isPlaying);
      }
    );
    setSound(sound);

    await sound.playAsync();
  }

  async function pauseSound() {
    setIsPlaying(false);
    if (!sound) return;
    await sound.pauseAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  return (
    <XStack bg="$green8" ai="center" br="$10" gap="$2" px="$2.5" py="$2" pr="$4" {...rest}>
      <Button
        unstyled
        icon={!!isPlaying ? <PauseCircle size={iconSize} /> : <PlayCircle size={iconSize} />}
        onPress={isPlaying ? pauseSound : playSound}
        color="$white1"
      />
      <Text color="$white1" fontWeight="700" fontSize={fontSize}>{formatDuration(position)} / {formatDuration(duration)}</Text>
    </XStack>
  );
}