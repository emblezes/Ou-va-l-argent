import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useVideoConfig } from 'remotion';
import { Subtitles } from './Subtitles';
import { KenBurnsImage } from './KenBurnsImage';

type Beat = {
  startFrame: number;
  endFrame: number;
  clipPath?: string;     // vidéo (stock-video / kling)
  imagePath?: string;    // image (real-image)
  source?: string;       // 'stock-video' | 'kling' | 'real-image' | 'google-image' | 'google-image-cache'
};

type Word = {
  text: string;
  startFrame: number;
  endFrame: number;
};

const resolveAsset = (p: string): string => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  return staticFile(p);
};

// Un beat est une image si `imagePath` est défini, peu importe son string source.
// Simplification v19 : on dispatchait par nom de source mais ça cassait avec
// les préfixes type "wiki-page", "rss-BFM Business", etc. Désormais on se
// base sur la présence de imagePath (fiable).

export const OvlaVideo: React.FC<{
  beats: Beat[];
  audioPath: string;
  words: Word[];
  musicPath?: string;
  musicVolume?: number;
  accent?: string;
}> = ({ beats, audioPath, words, musicPath, musicVolume = 0.08, accent = '#00d4ff' }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {beats.map((beat, i) => {
        const duration = Math.max(1, beat.endFrame - beat.startFrame);
        const asImage = !!beat.imagePath;

        return (
          <Sequence
            key={`beat-${i}`}
            from={beat.startFrame}
            durationInFrames={duration}
          >
            {asImage ? (
              <KenBurnsImage
                src={beat.imagePath!}
                durationInFrames={duration}
                variantIndex={i}
              />
            ) : beat.clipPath ? (
              <AbsoluteFill>
                <OffthreadVideo
                  src={resolveAsset(beat.clipPath)}
                  muted
                  style={{ width, height, objectFit: 'cover' }}
                />
              </AbsoluteFill>
            ) : null}
          </Sequence>
        );
      })}

      {audioPath ? <Audio src={resolveAsset(audioPath)} /> : null}
      {musicPath ? <Audio src={resolveAsset(musicPath)} volume={musicVolume} /> : null}

      <Subtitles words={words} />

      {/* Branding OVLA — logo haut-gauche + URL bas-droite, par-dessus tout */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 96,
              color: accent,
              lineHeight: 1,
              textShadow: '0 3px 14px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.6)',
            }}
          >
            €
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 42,
              color: '#ffffff',
              lineHeight: 1,
              textShadow: '0 3px 14px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.6)',
            }}
          >
            Où Va l'Argent ?
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 60,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 30,
            color: accent,
            fontWeight: 600,
            textShadow: '0 3px 14px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.6)',
          }}
        >
          ouvalargent.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
