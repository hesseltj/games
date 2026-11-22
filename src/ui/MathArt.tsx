// Coins, clocks and rulers for Bake Shop. Drawn as SVG so they're clear at any size.
const OUT = '#2d3a6b';

export const COIN_INFO: Record<number, { name: string; r: number; fill: string; label: string }> = {
  1: { name: 'penny', r: 19, fill: '#d08a4c', label: '1¢' },
  5: { name: 'nickel', r: 21, fill: '#c9ced8', label: '5¢' },
  10: { name: 'dime', r: 17, fill: '#dfe3ea', label: '10¢' },
  25: { name: 'quarter', r: 24, fill: '#d3d8e2', label: '25¢' },
};

export function Coin({ value, size = 1 }: { value: number; size?: number }) {
  const c = COIN_INFO[value];
  const d = c.r * 2 + 4;
  return (
    <svg width={d * size} height={d * size} viewBox={`0 0 ${d} ${d}`} aria-label={c.name}>
      <circle cx={d / 2} cy={d / 2} r={c.r} fill={c.fill} stroke={OUT} strokeWidth="2.5" />
      <circle cx={d / 2} cy={d / 2} r={c.r - 4} fill="none" stroke="#ffffff88" strokeWidth="1.5" />
      <text x={d / 2} y={d / 2 + 4.5} textAnchor="middle" fontSize={value >= 10 ? 12 : 13} fontWeight="800" fill={OUT} fontFamily="system-ui">{c.label}</text>
    </svg>
  );
}

export function CoinRow({ coins, size = 1 }: { coins: number[]; size?: number }) {
  return <span className="coin-row">{coins.map((v, i) => <Coin key={i} value={v} size={size} />)}</span>;
}

export function Clock({ h, m, size = 150 }: { h: number; m: number; size?: number }) {
  const minAngle = (m / 60) * 360;
  const hourAngle = ((h % 12) / 12) * 360 + (m / 60) * 30;
  const hand = (angle: number, len: number, w: number, color: string) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return <line x1="50" y1="50" x2={50 + Math.cos(a) * len} y2={50 + Math.sin(a) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`clock showing ${h}:${String(m).padStart(2, '0')}`}>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke={OUT} strokeWidth="4" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const big = i % 5 === 0;
        return <line key={i} x1={50 + Math.sin(a) * (big ? 37 : 40)} y1={50 - Math.cos(a) * (big ? 37 : 40)} x2={50 + Math.sin(a) * 43} y2={50 - Math.cos(a) * 43} stroke={OUT} strokeWidth={big ? 2 : 0.8} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n * 30 * Math.PI) / 180;
        return <text key={n} x={50 + Math.sin(a) * 29} y={50 - Math.cos(a) * 29 + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={OUT} fontFamily="system-ui">{n}</text>;
      })}
      {hand(hourAngle, 20, 5, '#ef4444')}
      {hand(minAngle, 32, 3, OUT)}
      <circle cx="50" cy="50" r="3.5" fill={OUT} />
    </svg>
  );
}

/** A ruler in inches with an item lying on it from `start` to `start + length`. */
export function Ruler({ start, length, emoji, max = 10 }: { start: number; length: number; emoji: string; max?: number }) {
  const unit = 30;
  const w = max * unit + 20;
  return (
    <svg width="100%" viewBox={`0 0 ${w} 110`} style={{ maxWidth: 560 }} aria-label={`ruler, item from ${start} to ${start + length}`}>
      {/* the item: a long bar with its emoji */}
      <rect x={10 + start * unit} y="12" width={length * unit} height="34" rx="12" fill="#f3c98b" stroke={OUT} strokeWidth="2.5" />
      <text x={10 + (start + length / 2) * unit} y="38" textAnchor="middle" fontSize="22">{emoji}</text>
      <rect x="4" y="56" width={w - 8} height="44" rx="6" fill="#ffe680" stroke={OUT} strokeWidth="2.5" />
      {Array.from({ length: max * 2 + 1 }, (_, i) => {
        const x = 10 + (i / 2) * unit;
        const whole = i % 2 === 0;
        return <line key={i} x1={x} y1="56" x2={x} y2={whole ? 76 : 68} stroke={OUT} strokeWidth={whole ? 2 : 1} />;
      })}
      {Array.from({ length: max + 1 }, (_, i) => (
        <text key={i} x={10 + i * unit} y="93" textAnchor="middle" fontSize="13" fontWeight="800" fill={OUT} fontFamily="system-ui">{i}</text>
      ))}
    </svg>
  );
}

/** A fraction drawn as a bar (or a pie) with n of d parts shaded. */
export function FractionBar({ n, d, pie = false, size = 1 }: { n: number; d: number; pie?: boolean; size?: number }) {
  if (pie) {
    const r = 40;
    const slices = Array.from({ length: d }, (_, i) => {
      const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
      const p = d === 1
        ? `M50 10 A40 40 0 1 1 49.99 10 Z`
        : `M50 50 L${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)} Z`;
      return <path key={i} d={p} fill={i < n ? '#ff8a5b' : '#fff'} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />;
    });
    return <svg width={90 * size} height={90 * size} viewBox="0 0 100 100" aria-label={`${n} out of ${d}`}>{slices}</svg>;
  }
  const w = 160, h = 40, cw = w / d;
  return (
    <svg width={w * size} height={h * size} viewBox={`-2 -2 ${w + 4} ${h + 4}`} aria-label={`${n} out of ${d}`}>
      {Array.from({ length: d }, (_, i) => <rect key={i} x={i * cw} y="0" width={cw} height={h} fill={i < n ? '#5b8def' : '#fff'} stroke={OUT} strokeWidth="2.5" />)}
    </svg>
  );
}

/** A little grid map with a compass rose, for direction questions. */
export function GridMap({ size, cells }: { size: number; cells: { x: number; y: number; emoji: string }[] }) {
  return (
    <div className="grid-map-wrap">
      <div className="grid-map" style={{ ['--n' as string]: size }}>
        {Array.from({ length: size * size }, (_, i) => {
          const c = cells.find((k) => k.y * size + k.x === i);
          return <span key={i} className="gm-cell">{c?.emoji ?? ''}</span>;
        })}
      </div>
      <svg className="compass" viewBox="0 0 60 60" width="64" height="64" aria-label="compass: north is up">
        <circle cx="30" cy="30" r="27" fill="#fff" stroke={OUT} strokeWidth="2" />
        <path d="M30 8 L35 30 L30 26 L25 30 Z" fill="#ef4444" stroke={OUT} strokeWidth="1.5" />
        <path d="M30 52 L35 30 L30 34 L25 30 Z" fill="#fff" stroke={OUT} strokeWidth="1.5" />
        <text x="30" y="7" textAnchor="middle" fontSize="9" fontWeight="800" fill={OUT}>N</text>
        <text x="30" y="59" textAnchor="middle" fontSize="9" fontWeight="800" fill={OUT}>S</text>
        <text x="56" y="33" textAnchor="middle" fontSize="9" fontWeight="800" fill={OUT}>E</text>
        <text x="4" y="33" textAnchor="middle" fontSize="9" fontWeight="800" fill={OUT}>W</text>
      </svg>
    </div>
  );
}
