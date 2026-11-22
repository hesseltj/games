import type { CatalogItem } from '../shop/catalog';
import { Creature } from './Creature';

/** Draws a catalog item at a given pixel size (used in the shop, wardrobe and house). */
export function ItemArt({ item, size = 64 }: { item: CatalogItem; size?: number }) {
  if (item.creature) return <Creature kind={item.creature} size={size} />;
  if (item.rug) {
    return (
      <svg viewBox="0 0 100 40" width={size} height={size * 0.4} aria-label={item.name}>
        <ellipse cx="50" cy="20" rx="48" ry="18" fill={item.rug} stroke="#2d3a6b" strokeWidth="2.5" />
        <ellipse cx="50" cy="20" rx="36" ry="11" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5 4" />
      </svg>
    );
  }
  return (
    <span className="item-art" style={{ fontSize: size * 0.82, width: size, height: size }} aria-label={item.name}>
      {item.emoji}
      {item.badge && <span className="item-badge" style={{ fontSize: size * 0.32 }}>{item.badge}</span>}
    </span>
  );
}
