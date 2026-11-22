import { useEffect } from 'react';
import type { Kid } from '../core/types';
import { KidAvatar } from '../ui/KidAvatar';
import { speak } from '../audio/speech';
import { sfx } from '../audio/sfx';

/** Shown when the daily play-time limit is reached. Friendly, not a punishment. */
export function BreakTime({ kid, onHome, onHouse }: { kid: Kid; onHome: () => void; onHouse: () => void }) {
  useEffect(() => { speak(`Great playing today, ${kid.name}! Time for a break. Your games will be ready again tomorrow!`); }, [kid.name]);
  return (
    <div className="screen break-time">
      <div className="break-moon">🌙</div>
      <h1 className="title">Time for a break!</h1>
      <KidAvatar kid={kid} size={150} />
      <p className="break-text">You played great today. The games will be ready again tomorrow. You can still visit your house and the shop!</p>
      <div className="reward-actions">
        <button className="big-btn" onClick={() => { sfx.tap(); onHouse(); }}>🏠 My house</button>
        <button className="big-btn alt" onClick={() => { sfx.tap(); onHome(); }}>Home</button>
      </div>
    </div>
  );
}
