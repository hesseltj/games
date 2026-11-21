const OUT = '#2d3a6b';

/** Placeholder house for the hub (Phase 2 replaces this with the decorated house). */
export function House({ name, accent }: { name: string; accent: string }) {
  return (
    <svg viewBox="0 0 300 260" className="house" aria-label={`${name}'s house`}>
      <ellipse cx="150" cy="246" rx="140" ry="12" fill="#000" opacity="0.08" />
      <rect x="44" y="110" width="212" height="136" rx="8" fill="#fff8e7" stroke={OUT} strokeWidth="5" />
      <path d="M24 118 L150 22 L276 118 Z" fill={accent} stroke={OUT} strokeWidth="5" strokeLinejoin="round" />
      <rect x="206" y="44" width="26" height="46" fill="#c0846a" stroke={OUT} strokeWidth="5" />
      <rect x="70" y="138" width="56" height="50" rx="6" fill="#bfe3ff" stroke={OUT} strokeWidth="5" />
      <path d="M98 138 V188 M70 163 H126" stroke={OUT} strokeWidth="4" />
      <rect x="168" y="150" width="62" height="96" rx="10" fill="#ff8a5b" stroke={OUT} strokeWidth="5" />
      <circle cx="218" cy="200" r="5" fill={OUT} />
      <rect x="150" y="118" width="98" height="26" rx="8" fill="#fff" stroke={OUT} strokeWidth="4" />
      <text x="199" y="137" textAnchor="middle" fontSize="16" fontWeight="800" fill={OUT} fontFamily="'Baloo 2', system-ui">
        {name.length > 10 ? name.slice(0, 10) : name}
      </text>
      <path d="M128 80 l6 12 13 2 -10 9 3 13 -12 -6 -12 6 3 -13 -10 -9 13 -2 z" fill="#ffd23f" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}
