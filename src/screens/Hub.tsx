import { useEffect, useMemo } from 'react';
import { useStore } from '../data/store';
import { balances } from '../core/economy';
import { SUBJECTS } from '../core/subjects';
import { THEME_BY_ID } from '../core/themes';
import type { Kid, Subject } from '../core/types';
import { ITEM_BY_ID } from '../shop/catalog';
import { goalProgress } from '../shop/logic';
import { currentPrice, ensureStarter } from '../shop/actions';
import { Avatar } from '../ui/Avatar';
import { KidAvatar } from '../ui/KidAvatar';
import { House } from '../ui/House';
import { ItemArt } from '../ui/ItemArt';
import { WalletBar } from '../ui/Wallet';
import { sfx } from '../audio/sfx';

export type HubTarget = 'shop' | 'house' | 'wardrobe';

export function Hub({ kid, onSubject, onSwitch, onGo }: { kid: Kid; onSubject: (s: Subject) => void; onSwitch: () => void; onGo: (t: HubTarget) => void }) {
  const ledger = useStore((s) => s.ledger);
  const wallet = useMemo(() => balances(ledger.filter((e) => e.kidId === kid.id)), [ledger, kid.id]);
  const theme = THEME_BY_ID[kid.favoriteTheme];
  const goal = kid.goalItemId ? ITEM_BY_ID[kid.goalItemId] : undefined;
  const progress = goal ? goalProgress(wallet, currentPrice(kid, goal.id)) : 0;

  useEffect(() => { ensureStarter(kid); }, [kid]);

  const go = (t: HubTarget) => () => { sfx.tap(); onGo(t); };

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
        <button className="hub-house" onClick={go('house')} aria-label="My house"><House name={kid.name} accent={theme.accent} /></button>
        <button className="hub-kid bob" onClick={go('wardrobe')} aria-label="My closet"><KidAvatar kid={kid} size={110} /></button>
        <div className="hub-left">
          <button className="hub-sign shop" onClick={go('shop')}>🛍️ Shop</button>
          {goal ? (
            <button className="goal-card" onClick={go('shop')}>
              <span className="goal-label">⭐ Saving for</span>
              <ItemArt item={goal} size={54} />
              <span className="goal-bar"><span style={{ width: `${Math.round(progress * 100)}%` }} /></span>
              {progress >= 1 && <span className="goal-ready">Ready to buy!</span>}
            </button>
          ) : null}
        </div>
        <div className="hub-right">
          <button className="hub-sign" onClick={go('house')}>🏠 My House</button>
          <button className="hub-sign" onClick={go('wardrobe')}>👕 Closet</button>
        </div>
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
