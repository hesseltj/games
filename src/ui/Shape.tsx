import type { ShapeName } from '../games/shared/types';

const OUT = '#2d3a6b';

export function Shape({ shape, size = 64, color = '#ff8a5b' }: { shape: ShapeName; size?: number; color?: string }) {
  const p = { fill: color, stroke: OUT, strokeWidth: 4, strokeLinejoin: 'round' as const };
  let el;
  switch (shape) {
    case 'circle': el = <circle {...p} cx="50" cy="50" r="38" />; break;
    case 'square': el = <rect {...p} x="14" y="14" width="72" height="72" rx="4" />; break;
    case 'triangle': el = <path {...p} d="M50 12 L90 86 L10 86 Z" />; break;
    case 'rectangle': el = <rect {...p} x="6" y="28" width="88" height="46" rx="4" />; break;
    case 'oval': el = <ellipse {...p} cx="50" cy="50" rx="44" ry="28" />; break;
    case 'diamond': el = <path {...p} d="M50 8 L86 50 L50 92 L14 50 Z" />; break;
    case 'heart': el = <path {...p} d="M50 86 C10 60 8 30 28 22 C40 17 48 26 50 32 C52 26 60 17 72 22 C92 30 90 60 50 86 Z" />; break;
    case 'star': el = <path {...p} d="M50 8 L61 37 L92 38 L67 57 L76 88 L50 70 L24 88 L33 57 L8 38 L39 37 Z" />; break;
  }
  return <svg viewBox="0 0 100 100" width={size} height={size} aria-label={shape}>{el}</svg>;
}
