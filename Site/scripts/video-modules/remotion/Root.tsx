import React from 'react';
import { Composition, getInputProps } from 'remotion';
import { OvlaVideo } from './Video';

export const RemotionRoot: React.FC = () => {
  const props = getInputProps() as {
    beats?: Array<{ startFrame: number; endFrame: number; clipPath?: string; imagePath?: string; source?: string }>;
    audioPath?: string;
    musicPath?: string;
    musicVolume?: number;
    words?: Array<{ text: string; startFrame: number; endFrame: number }>;
    durationInFrames?: number;
    fps?: number;
    width?: number;
    height?: number;
    accent?: string;
    ctaStartFrame?: number;
    ctaDurationFrames?: number;
  };

  const fps = props.fps ?? 30;
  const width = props.width ?? 1080;
  const height = props.height ?? 1920;
  const duration = props.durationInFrames ?? fps * 45;

  return (
    <Composition
      id="OvlaVideo"
      component={OvlaVideo as any}
      durationInFrames={duration}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{
        beats: props.beats ?? [],
        audioPath: props.audioPath ?? '',
        musicPath: props.musicPath ?? '',
        musicVolume: props.musicVolume ?? 0.08,
        words: props.words ?? [],
        accent: props.accent ?? '#00d4ff',
        ctaStartFrame: props.ctaStartFrame ?? 0,
        ctaDurationFrames: props.ctaDurationFrames ?? 0,
      }}
    />
  );
};
