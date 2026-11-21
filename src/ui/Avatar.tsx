import type { AvatarConfig } from '../core/types';

export const SKIN_TONES = ['#ffe0c7', '#f8c9a0', '#e6a877', '#c68654', '#8d5a36', '#5c3a21'];
export const HAIR_COLORS = ['#2b1d14', '#5a3825', '#a0522d', '#e8b04b', '#f3d27a', '#d9573b', '#1e1e1e', '#9b59d0', '#ff7eb6', '#4aa3f0'];
export const SHIRT_COLORS = ['#ef4444', '#fb923c', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#f472b6', '#14b8a6'];
export const HAIR_STYLES = 6;

export const DEFAULT_AVATAR: AvatarConfig = { skin: SKIN_TONES[1], hairStyle: 0, hairColor: HAIR_COLORS[1], shirt: SHIRT_COLORS[4] };

const OUT = '#2d3a6b';

function Hair({ style, color, back }: { style: number; color: string; back?: boolean }) {
  const p = { fill: color, stroke: OUT, strokeWidth: 3, strokeLinejoin: 'round' as const };
  if (back) {
    // Long hair behind the head for some styles.
    if (style === 2) return <path {...p} d="M22 52 Q20 100 30 112 L90 112 Q100 100 98 52 Z" />;
    if (style === 4) return <><circle {...p} cx="24" cy="58" r="13" /><circle {...p} cx="96" cy="58" r="13" /></>;
    if (style === 5) return <path {...p} d="M28 60 Q22 92 40 104 L80 104 Q98 92 92 60 Z" />;
    return null;
  }
  switch (style) {
    case 0: // short
      return <path {...p} d="M28 56 Q26 22 60 20 Q94 22 92 56 Q86 40 72 36 Q60 46 40 40 Q32 46 28 56 Z" />;
    case 1: // spiky
      return <path {...p} d="M28 56 L26 36 L38 40 L40 22 L52 34 L60 16 L68 34 L80 22 L82 40 L94 36 L92 56 Q80 40 60 40 Q40 40 28 56 Z" />;
    case 2: // long
      return <path {...p} d="M26 60 Q24 20 60 20 Q96 20 94 60 Q90 38 60 36 Q34 38 26 60 Z" />;
    case 3: // curly
      return <g {...p}>{[[32, 40], [44, 28], [60, 24], [76, 28], [88, 40], [30, 54], [90, 54]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" />)}</g>;
    case 4: // pigtails (buns drawn in back)
      return <path {...p} d="M28 56 Q26 22 60 20 Q94 22 92 56 Q80 38 60 38 Q40 38 28 56 Z" />;
    default: // bob with bangs
      return <path {...p} d="M26 62 Q22 20 60 20 Q98 20 94 62 L86 62 Q86 42 74 38 L46 38 Q34 42 34 62 Z" />;
  }
}

export function Avatar({ config, size = 120, mood = 'happy' }: { config: AvatarConfig; size?: number; mood?: 'happy' | 'cheer' }) {
  const cheer = mood === 'cheer';
  return (
    <svg viewBox="0 0 120 160" width={size} height={(size * 160) / 120} aria-hidden="true" style={{ overflow: 'visible' }}>
      <Hair style={config.hairStyle} color={config.hairColor} back />
      {/* arms */}
      <g stroke={OUT} strokeWidth="3" fill={config.skin}>
        {cheer ? (
          <>
            <path d="M34 104 L14 76" strokeWidth="12" stroke={config.shirt} strokeLinecap="round" />
            <path d="M86 104 L106 76" strokeWidth="12" stroke={config.shirt} strokeLinecap="round" />
            <circle cx="12" cy="72" r="7" /><circle cx="108" cy="72" r="7" />
          </>
        ) : (
          <>
            <path d="M34 102 L24 128" strokeWidth="12" stroke={config.shirt} strokeLinecap="round" />
            <path d="M86 102 L96 128" strokeWidth="12" stroke={config.shirt} strokeLinecap="round" />
            <circle cx="23" cy="132" r="7" /><circle cx="97" cy="132" r="7" />
          </>
        )}
      </g>
      {/* legs */}
      <rect x="42" y="132" width="14" height="22" rx="6" fill="#3b4a7a" stroke={OUT} strokeWidth="3" />
      <rect x="64" y="132" width="14" height="22" rx="6" fill="#3b4a7a" stroke={OUT} strokeWidth="3" />
      {/* body */}
      <path d="M32 140 Q30 100 60 96 Q90 100 88 140 Z" fill={config.shirt} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      {/* head */}
      <circle cx="60" cy="58" r="34" fill={config.skin} stroke={OUT} strokeWidth="3" />
      <circle cx="47" cy="60" r="4.5" fill={OUT} />
      <circle cx="73" cy="60" r="4.5" fill={OUT} />
      <circle cx="48.5" cy="58.5" r="1.5" fill="#fff" />
      <circle cx="74.5" cy="58.5" r="1.5" fill="#fff" />
      <circle cx="40" cy="70" r="5" fill="#ff8fa3" opacity="0.5" />
      <circle cx="80" cy="70" r="5" fill="#ff8fa3" opacity="0.5" />
      {cheer
        ? <path d="M48 72 Q60 88 72 72 Z" fill="#c2410c" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
        : <path d="M50 74 Q60 82 70 74" fill="none" stroke={OUT} strokeWidth="3" strokeLinecap="round" />}
      <Hair style={config.hairStyle} color={config.hairColor} />
    </svg>
  );
}
