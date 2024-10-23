import { Pause, Play } from '@tamagui/lucide-icons';
import { useVideoPlayer, VideoSource, VideoView, VideoViewProps } from 'expo-video';
import { ComponentProps, useState } from 'react';
import { Button, styled, View } from 'tamagui'

const StyledVideoView = styled(VideoView)

type VideoPlayerProps = Omit<ComponentProps<typeof StyledVideoView>, 'player'> & {
  source: VideoSource;
  controllable?: boolean;
};

export const VideoPlayer = ({ source, controllable = true, ...rest }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(source);

  return (
    <View>
      <StyledVideoView player={player} {...rest} />
      <View position="absolute" t={0} b={0} l={0} r={0} jc="center" ai="center">
        <Button
          p={0}
          circular
          unstyled
          jc="center"
          ai="center"
          color="$white1"
          size="$8"
          icon={isPlaying ? <Pause /> : <Play />}
          onPress={() => {
            if (!controllable) return;
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        />
      </View>
    </View>
  );
}