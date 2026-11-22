import type { Kid } from '../../core/types';
import { KidAvatar } from '../../ui/KidAvatar';

export type BuddyMood = 'idle' | 'cheer' | 'oops';

/** The kid's own character in the corner, cheering them on and saying what the voice says. */
export function GameBuddy({ kid, mood, line }: { kid: Kid; mood: BuddyMood; line?: string | null }) {
  return (
    <div className={`game-buddy ${mood}`} aria-hidden="true">
      {line && <span key={line} className={`buddy-bubble ${/in a row/.test(line) ? 'combo' : ''}`}>{/in a row/.test(line) ? '🔥 ' : ''}{line}</span>}
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
