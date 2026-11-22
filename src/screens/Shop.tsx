import { useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { balances } from '../core/economy';
import type { Kid, ThemeId } from '../core/types';
import { THEMES, THEME_BY_ID } from '../core/themes';
import { CURRENCIES } from '../core/subjects';
import { BACKDROPS, ITEMS, ITEM_BY_ID, BACKDROP_BY_ID, ROOMS, type Category, type CatalogItem } from '../shop/catalog';
import { isUnique, priceOf, shortfall } from '../shop/logic';
import { buy, currentPrice, isRoomUnlocked, setGoal, todaysDeal, unlockRoom } from '../shop/actions';
import { ItemArt } from '../ui/ItemArt';
import { PriceTag } from '../ui/Price';
import { WalletBar } from '../ui/Wallet';
import { Avatar } from '../ui/Avatar';
import { wearFor } from '../ui/KidAvatar';
import { Confetti } from '../ui/Confetti';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

type Tab = Category | 'rooms';
const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'furniture', label: 'Furniture', emoji: '🪙' },
  { id: 'clothes', label: 'Clothes', emoji: '⭐' },
  { id: 'pets', label: 'Pets', emoji: '💎' },
  { id: 'outdoor', label: 'Yard', emoji: '🍃' },
  { id: 'toys', label: 'Toys', emoji: '🧩' },
  { id: 'rooms', label: 'Rooms', emoji: '🏠' },
];

type Selected = { kind: 'item'; id: string } | { kind: 'backdrop'; id: string } | { kind: 'room'; id: string };

export function Shop({ kid, onBack }: { kid: Kid; onBack: () => void }) {
  const ledger = useStore((s) => s.ledger);
  const inventory = useStore((s) => s.inventory);
  useStore((s) => s.rooms);
  const wallet = useMemo(() => balances(ledger.filter((e) => e.kidId === kid.id)), [ledger, kid.id]);
  const myInv = inventory.filter((i) => i.kidId === kid.id);
  const [tab, setTab] = useState<Tab>('furniture');
  const [theme, setTheme] = useState<ThemeId | 'all'>('all');
  const [selected, setSelected] = useState<Selected | null>(null);
  const [celebrate, setCelebrate] = useState(0);
  const deal = todaysDeal(kid);
  const dealItem = ITEM_BY_ID[deal.itemId];

  const themeOrder = [kid.favoriteTheme, ...THEMES.map((t) => t.id).filter((t) => t !== kid.favoriteTheme)];
  const items = ITEMS.filter((i) => (i.category === tab || (tab === 'furniture' && i.category === 'decor')) && (theme === 'all' || i.theme === theme))
    .filter((i) => Object.keys(i.price).length > 0)
    .sort((a, b) => themeRank(a) - themeRank(b) || total(a.price) - total(b.price));
  function themeRank(i: CatalogItem) {
    return i.theme === 'basic' ? 99 : themeOrder.indexOf(i.theme);
  }

  const owned = (id: string) => myInv.filter((i) => i.itemId === id).length;

  async function doBuy(sel: Selected) {
    const result = sel.kind === 'room' ? await unlockRoom(kid, sel.id as never) : await buy(kid, sel.id);
    if (result.ok) {
      sfx.fanfare();
      setTimeout(() => sfx.coin(), 400);
      setCelebrate((c) => c + 1);
      speak(sel.kind === 'room' ? 'Your new room is ready!' : 'Yay! It’s yours!');
      setSelected(null);
    } else {
      sfx.boop();
    }
  }

  return (
    <div className="screen shop">
      {celebrate > 0 && <Confetti key={celebrate} count={50} />}
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onBack(); }} aria-label="Home">🏠</button>
        <h1 className="title small">🛍️ Shop</h1>
        <WalletBar wallet={wallet} />
      </div>

      {dealItem && (
        <button className="deal-banner" onClick={() => { sfx.tap(); setSelected({ kind: 'item', id: deal.itemId }); }}>
          <span className="deal-tag">Today’s deal!</span>
          <ItemArt item={dealItem} size={56} />
          <span className="deal-name">{dealItem.name}</span>
          <PriceTag price={deal.price} old={priceOf(deal.itemId)} wallet={wallet} />
        </button>
      )}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => { sfx.tap(); setTab(t.id); }}>
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      {tab !== 'rooms' && (
        <div className="theme-chips">
          <button className={`chip ${theme === 'all' ? 'on' : ''}`} onClick={() => setTheme('all')}>All</button>
          {themeOrder.map((id) => (
            <button key={id} className={`chip ${theme === id ? 'on' : ''}`} style={{ ['--accent' as string]: THEME_BY_ID[id].accent }} onClick={() => { sfx.tap(); setTheme(id); }}>
              {THEME_BY_ID[id].emoji} {THEME_BY_ID[id].name}
            </button>
          ))}
        </div>
      )}

      <div className="shop-grid">
        {tab === 'rooms' ? (
          <>
            {ROOMS.filter((r) => Object.keys(r.price).length > 0).map((r) => {
              const unlocked = isRoomUnlocked(kid.id, r.type);
              return (
                <button key={r.type} className={`shop-card ${unlocked ? 'owned' : ''}`} onClick={() => { sfx.tap(); if (!unlocked) setSelected({ kind: 'room', id: r.type }); }}>
                  <span className="shop-art room-art">{r.emoji}</span>
                  <span className="shop-name">{r.name}</span>
                  {unlocked ? <span className="owned-tag">✓ Yours</span> : <PriceTag price={r.price} wallet={wallet} />}
                </button>
              );
            })}
            {BACKDROPS.filter((b) => Object.keys(b.price).length > 0).map((b) => {
              const has = owned(b.id) > 0;
              return (
                <button key={b.id} className={`shop-card ${has ? 'owned' : ''}`} onClick={() => { sfx.tap(); if (!has) setSelected({ kind: 'backdrop', id: b.id }); }}>
                  <span className="shop-art swatch-art" style={{ background: b.css }} />
                  <span className="shop-name">{b.name} {b.kind === 'wallpaper' ? 'wallpaper' : 'floor'}</span>
                  {has ? <span className="owned-tag">✓ Yours</span> : <PriceTag price={b.price} wallet={wallet} />}
                </button>
              );
            })}
          </>
        ) : items.map((i) => {
          const n = owned(i.id);
          const soldOut = isUnique(i.id) && n > 0;
          return (
            <button key={i.id} className={`shop-card ${soldOut ? 'owned' : ''} ${kid.goalItemId === i.id ? 'goal' : ''}`} onClick={() => { sfx.tap(); setSelected({ kind: 'item', id: i.id }); }}>
              {deal.itemId === i.id && <span className="card-deal">SALE</span>}
              {kid.goalItemId === i.id && <span className="card-goal">⭐ Goal</span>}
              <span className="shop-art"><ItemArt item={i} size={72} /></span>
              <span className="shop-name">{i.name}</span>
              {soldOut ? <span className="owned-tag">✓ Yours</span> : (
                <>
                  <PriceTag price={currentPrice(kid, i.id)} wallet={wallet} />
                  {n > 0 && <span className="owned-count">You have {n}</span>}
                </>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <BuySheet kid={kid} sel={selected} wallet={wallet} owned={selected.kind === 'room' ? 0 : owned(selected.id)}
          onClose={() => setSelected(null)} onBuy={() => doBuy(selected)} />
      )}
    </div>
  );
}

function total(p: Record<string, number | undefined>) {
  return Object.values(p).reduce<number>((s, v) => s + (v ?? 0), 0);
}

function BuySheet({ kid, sel, wallet, owned, onClose, onBuy }: {
  kid: Kid; sel: Selected; wallet: ReturnType<typeof balances>; owned: number; onClose: () => void; onBuy: () => void;
}) {
  const item = sel.kind === 'item' ? ITEM_BY_ID[sel.id] : undefined;
  const backdrop = sel.kind === 'backdrop' ? BACKDROP_BY_ID[sel.id] : undefined;
  const room = sel.kind === 'room' ? ROOMS.find((r) => r.type === sel.id) : undefined;
  const price = room ? room.price : currentPrice(kid, sel.id);
  const name = item?.name ?? (backdrop ? `${backdrop.name} ${backdrop.kind}` : room?.name ?? '');
  const short = shortfall(wallet, price);
  const canBuy = Object.keys(short).length === 0;
  const soldOut = sel.kind !== 'room' && isUnique(sel.id) && owned > 0;
  const isGoal = kid.goalItemId === sel.id;
  const [busy, setBusy] = useState(false);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn sheet-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="sheet-preview">
          {item?.category === 'clothes' ? (
            <Avatar config={kid.avatar} size={150} wear={wearFor(kid, item.wear?.hat ? { hat: item.id } : { outfit: item.id })} />
          ) : item ? <ItemArt item={item} size={150} />
            : backdrop ? <span className="swatch-art big" style={{ background: backdrop.css }} />
            : <span className="room-art big">{room?.emoji}</span>}
        </div>
        <h2>{name}</h2>
        {item && item.theme !== 'basic' && <div className="sheet-theme">{THEME_BY_ID[item.theme].emoji} {THEME_BY_ID[item.theme].name}</div>}
        <PriceTag price={price} wallet={wallet} />
        {soldOut ? (
          <p className="sheet-note">You already have this! ✓</p>
        ) : canBuy ? (
          <button className="big-btn go" disabled={busy} onClick={() => { setBusy(true); onBuy(); }}>Buy it! 🎉</button>
        ) : (
          <>
            <p className="sheet-note">
              You need {CURRENCIES.filter((c) => short[c.id]).map((c) => `${short[c.id]} more ${c.emoji}`).join(' and ')}
            </p>
            {sel.kind === 'item' && (
              <button className="big-btn alt" onClick={() => { sfx.tap(); setGoal(kid, isGoal ? null : sel.id); speak(isGoal ? 'Goal removed' : 'Saving up for it!'); onClose(); }}>
                {isGoal ? 'Stop saving for this' : '⭐ Save up for this!'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
