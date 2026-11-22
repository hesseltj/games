import type { CreatureKind } from '../shop/catalog';

const OUT = '#2d3a6b';

export const CREATURES: Record<CreatureKind, { names: [string, string, string]; element: string; color: string }> = {
  sparkit: { names: ['Sparkit', 'Voltfox', 'Thundermane'], element: '⚡', color: '#ffd23f' },
  puddlepup: { names: ['Puddlepup', 'Splashound', 'Tidalwolf'], element: '💧', color: '#3fa7f0' },
  sproutle: { names: ['Sproutle', 'Leafshell', 'Grovetoise'], element: '🌱', color: '#3fbf7f' },
  embertail: { names: ['Embertail', 'Blazeclaw', 'Sunwyrm'], element: '🔥', color: '#ff7a3d' },
  pebblet: { names: ['Pebblet', 'Stoneboo', 'Cragcrown'], element: '🪨', color: '#a3a9b8' },
  glimmerwing: { names: ['Glimmerwing', 'Shimmermoth', 'Starmoth'], element: '✨', color: '#c58af0' },
};

export function creatureName(kind: CreatureKind, stage: 1 | 2 | 3 = 1) {
  return CREATURES[kind].names[stage - 1];
}

/** Original Creature Catchers critters. Stages 2 and 3 grow bigger and gain extra features. */
export function Creature({ kind, size = 80, stage = 1 }: { kind: CreatureKind; size?: number; stage?: 1 | 2 | 3 }) {
  const s = { stroke: OUT, strokeWidth: 3, strokeLinejoin: 'round' as const };
  const color = CREATURES[kind].color;
  return (
    <svg viewBox="-10 -14 120 120" width={size} height={size} aria-label={creatureName(kind, stage)} style={{ overflow: 'visible' }}>
      {stage === 3 && (
        <>
          <circle cx="50" cy="52" r="56" fill={color} opacity="0.18" />
          <circle cx="50" cy="52" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 6" opacity="0.7" />
        </>
      )}
      <g transform={stage === 1 ? 'translate(8 12) scale(0.84)' : stage === 2 ? 'translate(3 5) scale(0.94)' : ''}>
        {kind === 'sparkit' && (
          <>
            <path {...s} fill="#ffd23f" d="M70 70 L88 58 L80 52 L96 38 L84 36 L94 22 L74 40 L82 44 L66 58 Z" />
            {stage >= 2 && <path {...s} fill="#ffe680" d="M66 76 L84 74 L78 68 L94 64 L72 60 Z" />}
            <ellipse {...s} cx="48" cy="66" rx="26" ry="22" fill="#9b8cff" />
            <path {...s} fill="#9b8cff" d="M28 40 L22 12 L42 30 Z" />
            <path {...s} fill="#9b8cff" d="M68 40 L74 12 L54 30 Z" />
            {stage === 3 && <path {...s} fill="#ffd23f" d="M26 30 L32 18 L38 28 L44 14 L50 26 L56 14 L62 28 L68 18 L72 30 Z" />}
            <circle {...s} cx="48" cy="44" r="22" fill="#b3a8ff" />
            <path fill="#ffd23f" stroke={OUT} strokeWidth="2" d="M46 26 L52 26 L49 33 L54 33 L45 42 L47 35 L43 35 Z" />
          </>
        )}
        {kind === 'puddlepup' && (
          <>
            {stage >= 2 && <path {...s} fill="#3fa7f0" d="M50 48 Q72 30 84 50 Q72 46 66 58 Z" />}
            <ellipse {...s} cx="50" cy="70" rx="28" ry="20" fill="#6ec6ff" />
            <circle {...s} cx="50" cy="44" r="24" fill="#8fd5ff" />
            <ellipse {...s} cx="26" cy="46" rx="8" ry="16" fill="#3fa7f0" transform="rotate(15 26 46)" />
            <ellipse {...s} cx="74" cy="46" rx="8" ry="16" fill="#3fa7f0" transform="rotate(-15 74 46)" />
            <path {...s} fill="#e0f4ff" d="M50 10 Q60 24 50 28 Q40 24 50 10 Z" />
            {stage === 3 && <path {...s} fill="#e0f4ff" d="M34 20 Q38 30 32 32 Q26 28 34 20 Z M66 20 Q74 28 68 32 Q62 30 66 20 Z" />}
          </>
        )}
        {kind === 'sproutle' && (
          <>
            <path {...s} fill="#3fbf7f" d="M18 72 Q20 36 52 36 Q84 36 86 72 Z" />
            <path fill="none" stroke="#2b8a5a" strokeWidth="3" d="M34 72 L40 50 L64 50 L70 72 M40 50 L52 38 L64 50" />
            <ellipse {...s} cx="52" cy="76" rx="38" ry="8" fill="#a7e8c0" />
            <circle {...s} cx="86" cy="58" r="14" fill="#a7e8c0" />
            <path d="M52 36 Q52 24 52 18" fill="none" stroke="#2b8a5a" strokeWidth="3" />
            <path {...s} fill="#7ee08a" d="M52 20 Q40 8 32 16 Q42 26 52 20 Z" />
            <path {...s} fill="#7ee08a" d="M52 20 Q64 6 72 14 Q62 26 52 20 Z" />
            {stage >= 2 && <circle {...s} cx="52" cy="14" r="6" fill="#ff8fc4" />}
            {stage === 3 && <><circle {...s} cx="30" cy="40" r="9" fill="#5fd18a" /><circle {...s} cx="74" cy="40" r="9" fill="#5fd18a" /><circle {...s} cx="52" cy="2" r="10" fill="#5fd18a" /></>}
            <ellipse {...s} cx="30" cy="84" rx="7" ry="5" fill="#a7e8c0" />
            <ellipse {...s} cx="72" cy="84" rx="7" ry="5" fill="#a7e8c0" />
          </>
        )}
        {kind === 'embertail' && (
          <>
            <path {...s} fill="#ffb627" d="M72 72 Q96 66 90 40 Q86 52 80 50 Q86 36 76 26 Q78 44 66 60 Z" />
            {stage >= 2 && <path {...s} fill="#ff4d4d" d="M78 62 Q92 56 88 44 Q82 54 76 54 Z" />}
            <ellipse {...s} cx="46" cy="68" rx="28" ry="20" fill="#ff7a3d" />
            <ellipse cx="46" cy="72" rx="16" ry="11" fill="#ffd2a8" />
            <circle {...s} cx="42" cy="42" r="22" fill="#ff8f5a" />
            {stage >= 2 && <path {...s} fill="#ffd23f" d="M30 24 L34 12 L40 22 L46 8 L52 22 L56 14 L58 26 Z" />}
            {stage === 3 && <path {...s} fill="#ffb627" d="M10 58 Q0 40 14 30 Q16 46 24 52 Z M80 64 L100 56 L92 70 Z" />}
          </>
        )}
        {kind === 'pebblet' && (
          <>
            <ellipse {...s} cx="36" cy="14" rx="7" ry="16" fill="#a3a9b8" />
            <ellipse {...s} cx="62" cy="14" rx="7" ry="16" fill="#a3a9b8" />
            <ellipse {...s} cx="50" cy="62" rx="32" ry="28" fill="#b8bdca" />
            <circle cx="34" cy="70" r="5" fill="#8b91a3" /><circle cx="66" cy="74" r="4" fill="#8b91a3" /><circle cx="58" cy="82" r="3" fill="#8b91a3" />
            <circle {...s} cx="50" cy="42" r="22" fill="#c7ccd8" />
            {stage >= 2 && <path {...s} fill="#8b91a3" d="M18 60 L8 52 L16 70 Z M82 60 L92 52 L84 70 Z" />}
            {stage === 3 && <path {...s} fill="#7ee0ff" d="M36 20 L42 8 L50 18 L58 8 L64 20 Z" />}
          </>
        )}
        {kind === 'glimmerwing' && (
          <>
            <ellipse {...s} cx="26" cy="46" rx="22" ry="28" fill="#e2c8ff" transform="rotate(-20 26 46)" />
            <ellipse {...s} cx="74" cy="46" rx="22" ry="28" fill="#e2c8ff" transform="rotate(20 74 46)" />
            {stage >= 2 && <><ellipse {...s} cx="24" cy="76" rx="14" ry="12" fill="#f9c6e8" /><ellipse {...s} cx="76" cy="76" rx="14" ry="12" fill="#f9c6e8" /></>}
            <circle cx="24" cy="40" r="5" fill="#fff" /><circle cx="76" cy="40" r="5" fill="#fff" />
            <ellipse {...s} cx="50" cy="66" rx="12" ry="22" fill="#c58af0" />
            <circle {...s} cx="50" cy="42" r="16" fill="#d7b0f7" />
            <path d="M44 28 Q38 14 32 12 M56 28 Q62 14 68 12" fill="none" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="12" r="4" fill="#ffd23f" /><circle cx="68" cy="12" r="4" fill="#ffd23f" />
            {stage === 3 && <path fill="#ffd23f" d="M50 -4 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" />}
          </>
        )}
        {/* Face, shared by all creatures */}
        <Face kind={kind} />
      </g>
    </svg>
  );
}

function Face({ kind }: { kind: CreatureKind }) {
  const pos: Record<CreatureKind, [number, number]> = {
    sparkit: [48, 46], puddlepup: [50, 44], sproutle: [88, 58], embertail: [42, 44], pebblet: [50, 44], glimmerwing: [50, 43],
  };
  const [x, y] = pos[kind];
  if (kind === 'sproutle') {
    return <><circle cx={x + 2} cy={y - 3} r="3" fill={OUT} /><path d={`M${x - 4} ${y + 5} Q${x} ${y + 8} ${x + 4} ${y + 5}`} fill="none" stroke={OUT} strokeWidth="2" strokeLinecap="round" /></>;
  }
  const w = kind === 'glimmerwing' ? 6 : 8;
  return (
    <>
      <circle cx={x - w} cy={y} r="4" fill={OUT} /><circle cx={x + w} cy={y} r="4" fill={OUT} />
      <circle cx={x - w + 1} cy={y - 1} r="1.3" fill="#fff" /><circle cx={x + w + 1} cy={y - 1} r="1.3" fill="#fff" />
      <path d={`M${x - 4} ${y + 8} Q${x} ${y + 12} ${x + 4} ${y + 8}`} fill="none" stroke={OUT} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={x - w - 7} cy={y + 7} r="3.5" fill="#ff8fa3" opacity="0.6" /><circle cx={x + w + 7} cy={y + 7} r="3.5" fill="#ff8fa3" opacity="0.6" />
    </>
  );
}
