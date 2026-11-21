import { GAMES } from '../core/games';
import { CURRENCIES, SUBJECT_BY_ID } from '../core/subjects';
import type { Subject } from '../core/types';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';

export function SubjectMenu({ subject, onPlay, onBack }: { subject: Subject; onPlay: (gameId: string) => void; onBack: () => void }) {
  const info = SUBJECT_BY_ID[subject];
  const currency = CURRENCIES.find((c) => c.id === info.currency)!;
  const games = GAMES.filter((g) => g.subject === subject);
  return (
    <div className="screen subject" style={{ background: `linear-gradient(180deg, ${info.color}33, #fff8e7)` }}>
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onBack(); }} aria-label="Home">🏠</button>
        <h1 className="title small">{info.emoji} {info.name}</h1>
        <span className="earn-note">Earn {currency.emoji}</span>
      </div>
      <div className="game-grid">
        {games.map((g) => (
          <button key={g.id} className={`game-card ${g.ready ? '' : 'soon'}`} style={{ borderColor: info.color }}
            onClick={() => {
              sfx.tap();
              if (g.ready) onPlay(g.id);
              else speak(`${g.name} is coming soon!`);
            }}>
            <span className="game-emoji">{g.emoji}</span>
            <span className="game-name">{g.name}</span>
            <span className="game-blurb">{g.ready ? g.blurb : 'Coming soon!'}</span>
            {!g.ready && <span className="soon-badge">🔒</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
