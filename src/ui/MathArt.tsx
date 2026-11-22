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
