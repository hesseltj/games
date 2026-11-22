import { useMemo, useState } from 'react';
import type { Kid } from '../core/types';
import { planReward, type PendingReward } from '../core/progress';
import { addInventory, addLedger, getState } from '../data/store';
import { CURRENCIES } from '../core/subjects';
import { ItemArt } from '../ui/ItemArt';
import { Confetti } from '../ui/Confetti';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

/** Opens pending presents (level-ups, streak milestones, daily quest) one at a time. */
export function Gifts({ kid, pending: initial, onClose }: { kid: Kid; pending: PendingReward[]; onClose: () => void }) {
  // Keep the list from when the popup opened; claimed rewards drop out of the live list.
  const [pending] = useState(initial);
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [shaking, setShaking] = useState(false);
  const reward = pending[index];
  const plan = useMemo(() => {
    if (!reward) return null;
    const s = getState();
    return planReward(reward, kid, s.inventory.filter((i) => i.kidId === kid.id), s.ledger.filter((e) => e.kidId === kid.id), Date.now());
  }, [reward, kid]);

  if (!reward || !plan) return null;

  async function open() {
    if (opened || !plan) return;
    setShaking(true);
    sfx.shake();
    setTimeout(async () => {
      setShaking(false);
      setOpened(true);
      sfx.open();
      setTimeout(() => sfx.sparkle(), 300);
      speak(plan.item ? `${plan.say} You got ${plan.item.name}!` : plan.say);
      await addInventory(plan.inventory);
      await addLedger(plan.ledger);
    }, 700);
  }

  function next() {
    sfx.tap();
    if (index + 1 < pending.length) { setIndex(index + 1); setOpened(false); }
    else onClose();
  }

  const icon = reward.kind === 'level' ? '⬆️' : reward.kind === 'streak' ? '🔥' : '📜';
  return (
    <div className="sheet-backdrop gifts">
      {opened && <Confetti count={70} />}
      <div className="sheet gift-sheet">
        <div className="gift-kind">{icon} {plan.title}</div>
        {!opened ? (
          <>
            <button className={`gift-box ${shaking ? 'shaking' : 'wiggle'}`} onClick={open} aria-label="Open present">🎁</button>
            <p className="sheet-note">Tap to open!</p>
          </>
        ) : (
          <>
            <div className="gift-reveal">
              {plan.item ? <ItemArt item={plan.item} size={140} /> : <span className="gift-coins">💰</span>}
            </div>
            {plan.item && <h2>{plan.item.name}</h2>}
            <div className="gift-currency">
              {CURRENCIES.map((c) => {
                const amt = plan.ledger.filter((e) => e.currency === c.id).reduce((a, e) => a + e.amount, 0);
                return amt ? <span key={c.id} className="price-chip">{c.emoji} +{amt}</span> : null;
              })}
            </div>
            <button className="big-btn go" onClick={next}>{index + 1 < pending.length ? 'Next present! 🎁' : 'Yay! 🎉'}</button>
          </>
        )}
        {pending.length > 1 && <div className="gift-count">{index + 1} of {pending.length}</div>}
      </div>
    </div>
  );
}
