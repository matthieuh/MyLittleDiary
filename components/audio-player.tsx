import { formatDuration } from '@/utils/format';
import { PauseCircle, PlayCircle } from '@tamagui/lucide-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Button, Text, XStack, XStackProps } from 'tamagui'


type AudioPlayerProps = XStackProps & {
  uri: string;
  duration: number;
  controllable?: boolean;
};

export const AudioPlayer = ({ uri, duration, controllable = true, ...rest }: AudioPlayerProps) => {
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
    <XStack bg="$blue9" ai="center" br="$10" gap="$2" p="$2" pr="$4" {...rest}>
      <Button
        icon={!!isPlaying ? <PauseCircle size="$1.5" /> : <PlayCircle size="$1.5" />}
        onPress={isPlaying ? pauseSound : playSound}
        unstyled
        color="$white1"
      />
      <Text color="$white1" fontWeight="700">{formatDuration(position)} / {formatDuration(duration)}</Text>
    </XStack>
  );
}