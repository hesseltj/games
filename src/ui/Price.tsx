import { CURRENCIES } from '../core/subjects';
import type { Wallet } from '../core/economy';
import type { Price } from '../shop/catalog';

export function PriceTag({ price, wallet, old }: { price: Price; wallet?: Wallet; old?: Price }) {
  const entries = CURRENCIES.filter((c) => price[c.id] !== undefined);
  if (entries.length === 0) return <span className="price free">Free</span>;
  return (
    <span className="price">
      {entries.map((c) => (
        <span key={c.id} className={`price-chip ${wallet && wallet[c.id] < (price[c.id] ?? 0) ? 'short' : ''}`}>
          {c.emoji} {old?.[c.id] !== undefined && <s>{old[c.id]}</s>} {price[c.id]}
        </span>
      ))}
    </span>
  );
}
