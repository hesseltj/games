import { CURRENCIES } from '../core/subjects';
import type { Wallet } from '../core/economy';

export function WalletBar({ wallet }: { wallet: Wallet }) {
  return (
    <div className="wallet">
      {CURRENCIES.map((c) => (
        <div key={c.id} className="wallet-chip" title={c.name}>
          <span className="wallet-emoji">{c.emoji}</span>
          <span className="wallet-amt">{wallet[c.id]}</span>
        </div>
      ))}
    </div>
  );
}
