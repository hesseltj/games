import { useMemo } from 'react';
import { useStore } from '../data/store';
import { balances } from '../core/economy';
import { SUBJECTS } from '../core/subjects';
import { THEME_BY_ID } from '../core/themes';
import type { Kid, Subject } from '../core/types';
import { Avatar } from '../ui/Avatar';
import { House } from '../ui/House';
import { WalletBar } from '../ui/Wallet';
import { sfx } from '../audio/sfx';

export function Hub({ kid, onSubject, onSwitch }: { kid: Kid; onSubject: (s: Subject) => void; onSwitch: () => void }) {
  const ledger = useStore((s) => s.ledger);
  const wallet = useMemo(() => balances(ledger.filter((e) => e.kidId === kid.id)), [ledger, kid.id]);
  const theme = THEME_BY_ID[kid.favoriteTheme];

  return (
    <div className="screen hub" style={{ background: `linear-gradient(180deg, #bfe3ff 0%, ${theme.bg} 55%, ${theme.bg} 100%)` }}>
      <div className="topbar">
        <button className="player-chip" onClick={() => { sfx.tap(); onSwitch(); }} aria-label="Switch player">
          <Avatar config={kid.avatar} size={34} />
          <span>{kid.name}</span>
        </button>
        <WalletBar wallet={wallet} />
      </div>

      <div className="hub-scene">
        <div className="sun" />
        <div className="hub-house"><House name={kid.name} accent={theme.accent} /></div>
        <div className="hub-kid bob"><Avatar config={kid.avatar} size={110} /></div>
        <div className="shop-sign" title="Coming soon">🛍️ Shop<br /><small>opening soon!</small></div>
      </div>

      <div className="subject-row">
        {SUBJECTS.map((s) => (
          <button key={s.id} className="subject-tile" style={{ background: s.color }} onClick={() => { sfx.tap(); onSubject(s.id); }}>
            <span className="subject-emoji">{s.emoji}</span>
            <span className="subject-name">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
