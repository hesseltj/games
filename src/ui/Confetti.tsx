import { useMemo } from 'react';

const COLORS = ['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#f472b6', '#fb923c'];

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      dur: 2.2 + Math.random() * 1.6,
      color: COLORS[i % COLORS.length],
      rot: Math.random() * 360,
      w: 8 + Math.random() * 8,
    })),
    [count],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, background: p.color, width: p.w, height: p.w * 0.5, transform: `rotate(${p.rot}deg)` }} />
      ))}
    </div>
  );
}
