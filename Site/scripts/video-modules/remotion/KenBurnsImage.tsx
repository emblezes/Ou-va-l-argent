import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Convertit un chemin relatif au public dir en URL staticFile
const resolveAsset = (p: string): string => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  return staticFile(p);
};

// Variations alternées d'effet Ken Burns selon l'index du beat.
// 6 variantes qui tournent pour éviter la monotonie.
const KEN_BURNS_VARIANTS = [
  { scaleFrom: 1.0, scaleTo: 1.12, xFrom: 0, xTo: -30, yFrom: 0, yTo: 0 },       // zoom-in léger pan gauche
  { scaleFrom: 1.12, scaleTo: 1.0, xFrom: 30, xTo: 0, yFrom: 0, yTo: 0 },        // zoom-out depuis la droite
  { scaleFrom: 1.05, scaleTo: 1.15, xFrom: -40, xTo: 40, yFrom: 0, yTo: 0 },     // pan droite avec zoom
  { scaleFrom: 1.15, scaleTo: 1.05, xFrom: 40, xTo: -40, yFrom: 0, yTo: 0 },     // pan gauche avec zoom-out
  { scaleFrom: 1.0, scaleTo: 1.1, xFrom: 0, xTo: 0, yFrom: 30, yTo: -30 },       // pan haut léger
  { scaleFrom: 1.1, scaleTo: 1.0, xFrom: 0, xTo: 0, yFrom: -30, yTo: 30 },       // pan bas léger
];

export const KenBurnsImage: React.FC<{
  src: string;
  durationInFrames: number;
  variantIndex?: number;
}> = ({ src, durationInFrames, variantIndex = 0 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = KEN_BURNS_VARIANTS[variantIndex % KEN_BURNS_VARIANTS.length];

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
  const scale = interpolate(progress, [0, 1], [v.scaleFrom, v.scaleTo], { extrapolateRight: 'clamp' });
  const x = interpolate(progress, [0, 1], [v.xFrom, v.xTo], { extrapolateRight: 'clamp' });
  const y = interpolate(progress, [0, 1], [v.yFrom, v.yTo], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Img
        src={resolveAsset(src)}
        style={{
          width,
          height,
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};
