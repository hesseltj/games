import { useEffect, useMemo, useState } from 'react';
import type { Kid } from '../core/types';
import type { RoundSummary } from '../core/useRound';
import { CURRENCIES } from '../core/subjects';
import { EVOLVE_AT, XP_PER_ROUND, XP_PERFECT_BONUS, levelInfo, roundsWithBuddy, totalXp } from '../core/progress';
import { useKidProgress } from '../data/derived';
import { useStore } from '../data/store';
import { ITEM_BY_ID } from '../shop/catalog';
import { KidAvatar } from '../ui/KidAvatar';
import { Confetti } from '../ui/Confetti';
import { Creature, creatureName } from '../ui/Creature';
import { Gifts } from './Gifts';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

export function Reward({ kid, summary, onAgain, onHome, timeUp }: { kid: Kid; summary: RoundSummary; onAgain: () => void; onHome: () => void; timeUp?: boolean }) {
  const cur = CURRENCIES.find((c) => c.id === summary.currency)!;
  const progress = useKidProgress(kid);
  const inventory = useStore((s) => s.inventory);
  const [shown, setShown] = useState(0);
  const [count, setCount] = useState(0);
  const [gifts, setGifts] = useState(false);
  const perfect = summary.correctFirstTry === summary.total;

  // Work out what this round changed, once, from the state right after it was saved.
  const news = useMemo(() => {
    const rounds = progress.snap.rounds;
    const xpNow = totalXp(rounds);
    const gained = XP_PER_ROUND + (perfect ? XP_PERFECT_BONUS : 0);
    const before = levelInfo(xpNow - gained);
    const after = levelInfo(xpNow);
    const buddyInv = kid.equipped?.buddy ? inventory.find((i) => i.id === kid.equipped?.buddy) : undefined;
    const buddyItem = buddyInv ? ITEM_BY_ID[buddyInv.itemId] : undefined;
    let evolved: { kind: NonNullable<typeof buddyItem>['creature']; stage: 2 | 3 } | null = null;
    if (buddyInv && buddyItem?.creature) {
      const n = roundsWithBuddy(rounds, buddyInv.id);
      if (n === EVOLVE_AT[0]) evolved = { kind: buddyItem.creature, stage: 2 };
      if (n === EVOLVE_AT[1]) evolved = { kind: buddyItem.creature, stage: 3 };
    }
    const firstToday = rounds.filter((r) => new Date(r.createdAt).toDateString() === new Date().toDateString()).length === 1;
    return { gained, before, after, leveled: after.level > before.level, evolved, firstToday };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sfx.fanfare();
    const lines = [perfect ? `Perfect round, ${kid.name}!` : `Great work, ${kid.name}!`, `You earned ${summary.earned} ${cur.name}!`];
    if (news.leveled) lines.push(`Level up! You are now level ${news.after.level}!`);
    if (news.evolved) lines.push(`Whoa! Your buddy evolved into ${creatureName(news.evolved.kind!, news.evolved.stage)}!`);
    else if (news.firstToday && progress.streak.current > 1) lines.push(`${progress.streak.current} days in a row!`);
    speak(lines.join(' '));
    const timers: number[] = [];
    summary.lines.forEach((_, i) => timers.push(window.setTimeout(() => { setShown(i + 1); sfx.coin(); }, 700 + i * 550)));
    if (news.leveled || news.evolved) timers.push(window.setTimeout(() => sfx.levelUp(), 700 + summary.lines.length * 550));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const target = summary.lines.slice(0, shown).reduce((s, l) => s + l.amount, 0);
    if (count >= target) return;
    const t = setTimeout(() => setCount((c) => Math.min(target, c + 1)), 30);
    return () => clearTimeout(t);
  }, [shown, count, summary.lines]);

  const allIn = shown >= summary.lines.length;
  const { quest, pending, newBadges, streak } = progress;

  return (
    <div className="screen reward">
      <Confetti count={news.leveled || news.evolved ? 120 : 60} />
      <h1 className="title">{news.evolved ? 'Evolution!' : news.leveled ? 'Level up!' : perfect ? 'Perfect!' : 'Great job!'}</h1>
      <div className="reward-body">
        <div className="dance">
          {news.evolved ? (
            <span className="evolve"><Creature kind={news.evolved.kind!} size={160} stage={news.evolved.stage} /></span>
          ) : <KidAvatar kid={kid} size={150} mood="cheer" />}
        </div>
        <div className="reward-card">
          <div className="reward-total"><span className="reward-emoji">{cur.emoji}</span> +{count}</div>
          <ul className="reward-lines">
            {summary.lines.map((l, i) => (
              <li key={i} className={i < shown ? 'in' : ''}><span>{l.label}</span><b>+{l.amount}</b></li>
            ))}
          </ul>
          <div className={`reward-xp ${allIn ? 'in' : ''}`}>
            <span className={`level-star ${news.leveled ? 'pop' : ''}`}>⭐<b>{news.after.level}</b></span>
            <span className="xp-bar"><span style={{ width: `${(allIn ? news.after.progress : news.leveled ? 0 : news.before.progress) * 100}%` }} /></span>
            <small>+{news.gained} XP</small>
          </div>
          {allIn && (
            <div className="reward-extras">
              {news.evolved && <div className="extra big">✨ Your buddy became <b>{creatureName(news.evolved.kind!, news.evolved.stage)}</b>!</div>}
              {streak.current > 1 && <div className="extra">🔥 {streak.current}-day streak!</div>}
              <div className="extra">📜 Quest: {quest.text} {quest.done ? '✅' : `(${quest.progress}/${quest.goal})`}</div>
              {newBadges.length > 0 && <div className="extra">🏅 New badge{newBadges.length > 1 ? 's' : ''}: {newBadges.map((b) => `${b.emoji} ${b.name}`).join(', ')}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="reward-actions">
        {pending.length > 0 && allIn && (
          <button className="big-btn gift wiggle" onClick={() => { sfx.shake(); setGifts(true); }}>🎁 Open {pending.length === 1 ? 'present' : `${pending.length} presents`}!</button>
        )}
        {timeUp ? <div className="extra big">🌙 That’s all the play time for today. Great job!</div>
          : <button className="big-btn" onClick={() => { sfx.tap(); onAgain(); }}>Play again 🔁</button>}
        <button className="big-btn alt" onClick={() => { sfx.tap(); onHome(); }}>Home 🏠</button>
      </div>
      {gifts && <Gifts kid={kid} pending={pending} onClose={() => setGifts(false)} />}
    </div>
  );
}
