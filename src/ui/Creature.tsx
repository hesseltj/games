import type { CreatureKind } from '../shop/catalog';

const OUT = '#2d3a6b';

/** Original Creature Catchers critters, drawn simply until custom art arrives in Phase 4. */
export function Creature({ kind, size = 80 }: { kind: CreatureKind; size?: number }) {
  const s = { stroke: OUT, strokeWidth: 3, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label={kind} style={{ overflow: 'visible' }}>
      {kind === 'sparkit' && (
        <>
          {/* zigzag tail */}
          <path {...s} fill="#ffd23f" d="M70 70 L88 58 L80 52 L96 38 L84 36 L94 22 L74 40 L82 44 L66 58 Z" />
          <ellipse {...s} cx="48" cy="66" rx="26" ry="22" fill="#9b8cff" />
          {/* fox ears */}
          <path {...s} fill="#9b8cff" d="M28 40 L22 12 L42 30 Z" />
          <path {...s} fill="#9b8cff" d="M68 40 L74 12 L54 30 Z" />
          <circle {...s} cx="48" cy="44" r="22" fill="#b3a8ff" />
          <path fill="#ffd23f" stroke={OUT} strokeWidth="2" d="M46 26 L52 26 L49 33 L54 33 L45 42 L47 35 L43 35 Z" />
          <circle cx="40" cy="46" r="4" fill={OUT} /><circle cx="56" cy="46" r="4" fill={OUT} />
          <circle cx="41" cy="45" r="1.3" fill="#fff" /><circle cx="57" cy="45" r="1.3" fill="#fff" />
          <path d="M44 54 Q48 58 52 54" fill="none" stroke={OUT} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="33" cy="53" r="3.5" fill="#ff8fa3" opacity="0.6" /><circle cx="63" cy="53" r="3.5" fill="#ff8fa3" opacity="0.6" />
        </>
      )}
      {kind === 'puddlepup' && (
        <>
          <ellipse {...s} cx="50" cy="70" rx="28" ry="20" fill="#6ec6ff" />
          <circle {...s} cx="50" cy="44" r="24" fill="#8fd5ff" />
          {/* droopy ears */}
          <ellipse {...s} cx="26" cy="46" rx="8" ry="16" fill="#3fa7f0" transform="rotate(15 26 46)" />
          <ellipse {...s} cx="74" cy="46" rx="8" ry="16" fill="#3fa7f0" transform="rotate(-15 74 46)" />
          {/* water drop on head */}
          <path {...s} fill="#e0f4ff" d="M50 10 Q60 24 50 28 Q40 24 50 10 Z" />
          <circle cx="42" cy="44" r="4" fill={OUT} /><circle cx="58" cy="44" r="4" fill={OUT} />
          <circle cx="43" cy="43" r="1.3" fill="#fff" /><circle cx="59" cy="43" r="1.3" fill="#fff" />
          <ellipse cx="50" cy="52" rx="4" ry="3" fill={OUT} />
          <path d="M50 55 Q50 60 46 60 M50 55 Q50 60 54 60" fill="none" stroke={OUT} strokeWidth="2" strokeLinecap="round" />
          <circle {...s} cx="84" cy="22" r="5" fill="#ffffffaa" strokeWidth="2" />
          <circle {...s} cx="92" cy="12" r="3" fill="#ffffffaa" strokeWidth="2" />
        </>
      )}
      {kind === 'sproutle' && (
        <>
          {/* shell */}
          <path {...s} fill="#3fbf7f" d="M18 72 Q20 36 52 36 Q84 36 86 72 Z" />
          <path fill="none" stroke="#2b8a5a" strokeWidth="3" d="M34 72 L40 50 L64 50 L70 72 M40 50 L52 38 L64 50" />
          <ellipse {...s} cx="52" cy="76" rx="38" ry="8" fill="#a7e8c0" />
          {/* head */}
          <circle {...s} cx="86" cy="58" r="14" fill="#a7e8c0" />
          <circle cx="90" cy="55" r="3" fill={OUT} />
          <path d="M84 63 Q88 66 92 63" fill="none" stroke={OUT} strokeWidth="2" strokeLinecap="round" />
          {/* sprout */}
          <path d="M52 36 Q52 24 52 18" fill="none" stroke="#2b8a5a" strokeWidth="3" />
          <path {...s} fill="#7ee08a" d="M52 20 Q40 8 32 16 Q42 26 52 20 Z" />
          <path {...s} fill="#7ee08a" d="M52 20 Q64 6 72 14 Q62 26 52 20 Z" />
          {/* feet */}
          <ellipse {...s} cx="30" cy="84" rx="7" ry="5" fill="#a7e8c0" />
          <ellipse {...s} cx="72" cy="84" rx="7" ry="5" fill="#a7e8c0" />
        </>
      )}
    </svg>
  );
}
