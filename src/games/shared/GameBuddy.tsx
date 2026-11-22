import type { Kid } from '../../core/types';
import { KidAvatar } from '../../ui/KidAvatar';

export type BuddyMood = 'idle' | 'cheer' | 'oops';

const OOPS = ['Hmm…', 'Try again!', 'You can do it!'];

/** The kid's own character in the corner, cheering them on. */
export function GameBuddy({ kid, mood, combo }: { kid: Kid; mood: BuddyMood; combo: number }) {
  return (
    <div className={`game-buddy ${mood}`} aria-hidden="true">
      {mood === 'oops' && <span className="buddy-bubble">{OOPS[Math.floor(Date.now() / 1000) % OOPS.length]}</span>}
      {mood === 'cheer' && combo >= 3 && <span className="buddy-bubble combo">🔥 {combo} in a row!</span>}
      <KidAvatar kid={kid} size={74} mood={mood === 'cheer' ? 'cheer' : 'happy'} />
    </div>
  );
}

/** First-try answers in a row at the end of the results list. */
export function comboOf(results: boolean[]): number {
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i]; i--) n++;
  return n;
}
