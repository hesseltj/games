import type { Kid } from '../core/types';
import { useStore } from '../data/store';
import { ITEMS } from '../shop/catalog';
import { creatureStage, roundsWithBuddy, EVOLVE_AT } from '../core/progress';
import { Creature, CREATURES, creatureName } from '../ui/Creature';
import { equip } from '../shop/actions';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

export function Creatures({ kid, onBack, onShop }: { kid: Kid; onBack: () => void; onShop: () => void }) {
  const inventory = useStore((s) => s.inventory).filter((i) => i.kidId === kid.id);
  const rounds = useStore((s) => s.rounds);
  const all = ITEMS.filter((i) => i.creature);
  const found = all.filter((c) => inventory.some((i) => i.itemId === c.id)).length;

  return (
    <div className="screen creatures-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onBack(); }} aria-label="Home">🏠</button>
        <h1 className="title small">📖 Creature Book</h1>
        <span className="earn-note">{found} / {all.length} found</span>
      </div>
      <p className="book-hint">Make a creature your buddy. It evolves after {EVOLVE_AT[0]} rounds together, then again after {EVOLVE_AT[1]}! New creatures come from the shop and at levels 5, 10, 15…</p>
      <div className="creature-grid">
        {all.map((c) => {
          const inv = inventory.find((i) => i.itemId === c.id);
          const kind = c.creature!;
          if (!inv) {
            return (
              <button key={c.id} className="creature-card unknown" onClick={() => { sfx.tap(); speak('Who could this be? Find it in the shop, or keep leveling up!'); onShop(); }}>
                <span className="silhouette"><Creature kind={kind} size={110} /></span>
                <b>???</b>
                <small>{CREATURES[kind].element} Not found yet</small>
              </button>
            );
          }
          const together = roundsWithBuddy(rounds, inv.id);
          const st = creatureStage(together);
          const isBuddy = kid.equipped?.buddy === inv.id;
          return (
            <div key={c.id} className={`creature-card ${isBuddy ? 'buddy-card' : ''}`}>
              <span className="hop"><Creature kind={kind} size={110} stage={st.stage} /></span>
              <b>{creatureName(kind, st.stage)}</b>
              <small>{CREATURES[kind].element} Stage {st.stage}</small>
              <div className="stages">
                {[1, 2, 3].map((n) => <span key={n} className={n <= st.stage ? 'on' : ''}>{n <= st.stage ? creatureName(kind, n as 1 | 2 | 3) : '?'}</span>)}
              </div>
              {st.toNext !== null && (
                <>
                  <span className="xp-bar"><span style={{ width: `${st.progress * 100}%` }} /></span>
                  <small>{st.toNext} more {st.toNext === 1 ? 'round' : 'rounds'} as your buddy to evolve</small>
                </>
              )}
              <button className={`small-btn ${isBuddy ? 'alt' : ''}`} onClick={() => {
                sfx.correct();
                equip(kid, { buddy: isBuddy ? null : inv.id });
                if (!isBuddy) speak(`${creatureName(kind, st.stage)} is your buddy now!`);
              }}>{isBuddy ? '💖 My buddy' : 'Make my buddy'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
