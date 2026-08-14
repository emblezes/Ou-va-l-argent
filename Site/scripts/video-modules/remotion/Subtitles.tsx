import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Chaque "word" : { text, startFrame, endFrame } calculés depuis wordTimings ElevenLabs.
type Word = {
  text: string;
  startFrame: number;
  endFrame: number;
};

// Un "group" = fenêtre karaoké visible à l'écran (2-3 mots max).
type Group = {
  words: string[];
  startFrame: number;
  endFrame: number;
};

// Regroupe les mots en fenêtres de 2-3 mots, en respectant les ponctuations fortes.
// Règle : on accumule jusqu'à ~18 caractères totaux ou 3 mots, puis on commit.
// Une ponctuation . ! ? : force le commit.
function buildGroups(words: Word[]): Group[] {
  const groups: Group[] = [];
  let buffer: Word[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    const startFrame = buffer[0].startFrame;
    // La fin d'un groupe s'étend jusqu'au début du suivant (ou sa propre fin)
    const endFrame = buffer[buffer.length - 1].endFrame;
    groups.push({
      words: buffer.map((w) => w.text),
      startFrame,
      endFrame,
    });
    buffer = [];
  };

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    buffer.push(w);

    const totalChars = buffer.reduce((s, x) => s + x.text.length + 1, 0);
    const endsWithHardPunct = /[.!?:…]$/.test(w.text);
    const endsWithSoftPunct = /[,;]$/.test(w.text);

    if (endsWithHardPunct) {
      flush();
      continue;
    }
    if (buffer.length >= 3 || totalChars >= 20) {
      // Si le mot suivant est très court ET qu'on n'a que 2 mots, on en prend un 3e
      if (!endsWithSoftPunct && buffer.length === 2 && i + 1 < words.length && words[i + 1].text.length <= 4) {
        continue;
      }
      flush();
    }
  }
  flush();

  // Chaîne les groupes : chaque group.endFrame = group.startFrame du suivant
  for (let i = 0; i < groups.length - 1; i++) {
    groups[i].endFrame = groups[i + 1].startFrame;
  }

  return groups;
}

export const Subtitles: React.FC<{ words: Word[]; endFrame?: number }> = ({ words, endFrame }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Tous les hooks AVANT tout return conditionnel (règle des hooks React).
  const groups = React.useMemo(() => buildGroups(words || []), [words]);

  if (!words || words.length === 0) return null;
  if (typeof endFrame === 'number' && frame >= endFrame) return null;

  const active = groups.find((g) => frame >= g.startFrame && frame < g.endFrame);

  if (!active) return null;

  // Animation pop-in sur les 3 premières frames du groupe
  const localFrame = frame - active.startFrame;
  const scale = interpolate(localFrame, [0, 3], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(localFrame, [0, 3], [0.6, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: height * 0.62,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', 'Helvetica Neue', 'Arial Black', sans-serif",
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 1.05,
          color: '#FFD93D',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '-0.015em',
          WebkitTextStroke: '6px #000',
          paintOrder: 'stroke fill',
          textShadow:
            '0 0 18px rgba(0,0,0,0.85), 0 4px 0 rgba(0,0,0,0.9), 0 6px 20px rgba(0,0,0,0.55)',
          maxWidth: 980,
          padding: '0 40px',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          hyphens: 'auto',
          transform: `scale(${scale})`,
          opacity,
          transformOrigin: 'center center',
        }}
      >
        {active.words.join(' ')}
      </div>
    </AbsoluteFill>
  );
};
