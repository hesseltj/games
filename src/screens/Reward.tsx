import { useEffect, useState } from 'react';
import type { Kid } from '../core/types';
import type { RoundSummary } from '../core/useRound';
import { CURRENCIES } from '../core/subjects';
import { KidAvatar } from '../ui/KidAvatar';
import { Confetti } from '../ui/Confetti';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

export function Reward({ kid, summary, onAgain, onHome }: { kid: Kid; summary: RoundSummary; onAgain: () => void; onHome: () => void }) {
  const cur = CURRENCIES.find((c) => c.id === summary.currency)!;
  const [shown, setShown] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    sfx.fanfare();
    const perfect = summary.correctFirstTry === summary.total;
    speak(perfect ? `Perfect round, ${kid.name}! You earned ${summary.earned} ${cur.name}!` : `Great work, ${kid.name}! You earned ${summary.earned} ${cur.name}!`);
    const timers: number[] = [];
    summary.lines.forEach((_, i) => timers.push(window.setTimeout(() => { setShown(i + 1); sfx.coin(); }, 700 + i * 550)));
    return () => timers.forEach(clearTimeout);
  }, [summary, kid.name, cur.name]);

  useEffect(() => {
    const target = summary.lines.slice(0, shown).reduce((s, l) => s + l.amount, 0);
    if (count >= target) return;
    const t = setTimeout(() => setCount((c) => Math.min(target, c + 1)), 30);
    return () => clearTimeout(t);
  }, [shown, count, summary.lines]);

  return (
    <div className="screen reward">
      <Confetti />
      <h1 className="title">{summary.correctFirstTry === summary.total ? 'Perfect!' : 'Great job!'}</h1>
      <div className="reward-body">
        <div className="dance"><KidAvatar kid={kid} size={150} mood="cheer" /></div>
        <div className="reward-card">
          <div className="reward-total"><span className="reward-emoji">{cur.emoji}</span> +{count}</div>
          <ul className="reward-lines">
            {summary.lines.map((l, i) => (
              <li key={i} className={i < shown ? 'in' : ''}><span>{l.label}</span><b>+{l.amount}</b></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="reward-actions">
        <button className="big-btn" onClick={() => { sfx.tap(); onAgain(); }}>Play again 🔁</button>
        <button className="big-btn alt" onClick={() => { sfx.tap(); onHome(); }}>Home 🏠</button>
      </div>
    </div>
  );
}
