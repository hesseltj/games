import { useState } from 'react';
import { useStore, saveKid } from '../data/store';
import type { Kid } from '../core/types';
import { ITEM_BY_ID } from '../shop/catalog';
import { equip } from '../shop/actions';
import { Avatar } from '../ui/Avatar';
import { ItemArt } from '../ui/ItemArt';
import { wearFor } from '../ui/KidAvatar';
import { LookEditor } from '../ui/LookEditor';
import { sfx } from '../audio/sfx';

type Slot = 'hat' | 'outfit' | 'buddy' | 'look';

export function Wardrobe({ kid, onBack, onShop }: { kid: Kid; onBack: () => void; onShop: () => void }) {
  const inventory = useStore((s) => s.inventory).filter((i) => i.kidId === kid.id);
  const [slot, setSlot] = useState<Slot>('hat');
  const [look, setLook] = useState(kid.avatar);

  const options = inventory
    .map((inv) => ({ inv, item: ITEM_BY_ID[inv.itemId] }))
    .filter(({ item }) => item && (
      slot === 'buddy' ? item.category === 'pets' || !!item.creature
        : slot === 'hat' ? !!item.wear?.hat
        : slot === 'outfit' ? !!item.wear?.outfit : false));

  const current = slot === 'buddy' ? kid.equipped?.buddy : slot === 'hat' ? kid.equipped?.hat : kid.equipped?.outfit;
  const buddyItem = kid.equipped?.buddy ? ITEM_BY_ID[inventory.find((i) => i.id === kid.equipped?.buddy)?.itemId ?? ''] : undefined;

  function choose(value: string | null) {
    sfx.tap();
    equip(kid, { [slot]: value });
  }

  return (
    <div className="screen wardrobe">
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onBack(); }} aria-label="Home">🏠</button>
        <h1 className="title small">👕 My Closet</h1>
        <button className="icon-btn" onClick={() => { sfx.tap(); onShop(); }} aria-label="Shop">🛍️</button>
      </div>
      <div className="tabs">
        {([['hat', '🧢 Hats'], ['outfit', '👕 Outfits'], ['buddy', '🐾 Buddy'], ['look', '✨ My look']] as [Slot, string][]).map(([id, label]) => (
          <button key={id} className={`tab ${slot === id ? 'on' : ''}`} onClick={() => { sfx.tap(); setSlot(id); }}>{label}</button>
        ))}
      </div>

      {slot === 'look' ? (
        <div className="panel">
          <LookEditor avatar={look} onChange={setLook} wear={wearFor(kid)} showShirt={!kid.equipped?.outfit} />
          <button className="big-btn go" onClick={() => { sfx.fanfare(); saveKid({ ...kid, avatar: look, updatedAt: Date.now() }); onBack(); }}>Save my look ✓</button>
        </div>
      ) : (
        <div className="wardrobe-body">
          <div className="wardrobe-preview">
            <Avatar config={kid.avatar} size={170} wear={wearFor(kid)} />
            {buddyItem && <span className="buddy hop"><ItemArt item={buddyItem} size={80} /></span>}
          </div>
          <div className="wardrobe-grid">
            <button className={`closet-card ${!current ? 'sel' : ''}`} onClick={() => choose(null)}>
              <span className="closet-none">🚫</span><span>None</span>
            </button>
            {options.map(({ inv, item }) => {
              const value = slot === 'buddy' ? inv.id : item.id;
              return (
                <button key={inv.id} className={`closet-card ${current === value ? 'sel' : ''}`} onClick={() => choose(value)}>
                  <ItemArt item={item} size={64} />
                  <span>{item.name}</span>
                </button>
              );
            })}
            {options.length === 0 && (
              <button className="closet-card empty" onClick={() => { sfx.tap(); onShop(); }}>
                <span className="closet-none">🛍️</span><span>{slot === 'buddy' ? 'Get a pet in the shop!' : 'Find more in the shop!'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
