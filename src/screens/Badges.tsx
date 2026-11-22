import { useEffect } from 'react';
import type { Kid } from '../core/types';
import { useKidProgress } from '../data/derived';
import { saveKid } from '../data/store';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

export function Badges({ kid, onBack }: { kid: Kid; onBack: () => void }) {
  const { badges, newBadges, level, streak } = useKidProgress(kid);
  const earned = badges.filter((b) => b.earned);

  // Celebrate new badges once, then remember they've been seen.
  useEffect(() => {
    if (newBadges.length === 0) return;
    sfx.sparkle();
    speak(newBadges.length === 1 ? `New badge: ${newBadges[0].name}!` : `You got ${newBadges.length} new badges!`);
    const t = setTimeout(() => saveKid({ ...kid, seenBadges: [...new Set([...(kid.seenBadges ?? []), ...newBadges.map((b) => b.id)])], updatedAt: Date.now() }), 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNew = new Set(newBadges.map((b) => b.id));
  return (
    <div className="screen badges-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onBack(); }} aria-label="Home">🏠</button>
        <h1 className="title small">🏅 My Badges</h1>
        <span className="earn-note">{earned.length} / {badges.length}</span>
      </div>
      <div className="stat-row">
        <div className="stat"><b>Level {level.level}</b><span className="xp-bar"><span style={{ width: `${level.progress * 100}%` }} /></span><small>{level.into} / {level.needed} XP</small></div>
        <div className="stat"><b>🔥 {streak.current}-day streak</b><small>Best: {streak.best} days</small></div>
      </div>
      <div className="badge-grid">
        {badges.map((b) => (
          <button key={b.id} className={`badge ${b.earned ? 'earned' : 'locked'} ${isNew.has(b.id) ? 'new' : ''}`} onClick={() => speak(b.earned ? `${b.name}! ${b.how}.` : `To get this badge: ${b.how}.`)}>
            {isNew.has(b.id) && <span className="new-tag">NEW!</span>}
            <span className="badge-emoji">{b.earned ? b.emoji : '🔒'}</span>
            <span className="badge-name">{b.name}</span>
            <span className="badge-how">{b.how}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
