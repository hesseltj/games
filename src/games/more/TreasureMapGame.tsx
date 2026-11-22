import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { speak, stopSpeaking } from '../../audio/speech';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import { useFeedback } from '../shared/feedback';
import type { GameProps } from '../shared/ChoiceGame';
import { mapQuestion, type MapQuestion } from './treasureMap';

const COLS = 'ABCDEF';

/** Treasure Map: follow the directions and tap where the treasure is buried. */
export function TreasureMapGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<MapQuestion>({ kid, subject: 'social', gameId: 'treasureMap', onFinish, generate: (skill, step, rng) => mapQuestion(skill.id, step, rng) });
  const q = round.question;
  const fb = useFeedback(kid);
  const [dug, setDug] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const locked = useRef(false);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setDug([]); setDone(false); fb.reset(); locked.current = false;
    const t = setTimeout(() => speak(q.say, 'question'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function tap(i: number) {
    if (locked.current || dug.includes(i)) return;
    if (i === q.target) {
      locked.current = true;
      setDone(true);
      fb.praise('Treasure!', dug.length === 0);
      setTimeout(() => round.submit(dug.length === 0), 1600);
    } else {
      setDug((d) => [...d, i]);
      fb.oops(q.say);
    }
  }

  const misses = dug.length;
  return (
    <div className="screen treasure-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={() => speak(q.say, 'question')} />
      <div className="np-text center tm-prompt">{q.prompt}</div>
      <div className="tm-body">
        <div className={`tm-map ${q.coords ? 'coords' : ''}`} style={{ ['--n' as string]: q.size }}>
          {q.coords && <span className="tm-corner" />}
          {q.coords && Array.from({ length: q.size }, (_, c) => <span key={`c${c}`} className="tm-label">{COLS[c]}</span>)}
          {Array.from({ length: q.size }, (_, r) => (
            <RowCells key={r} r={r} q={q} dug={dug} done={done} hint={misses >= 2} onTap={tap} />
          ))}
        </div>
        {!q.coords && q.size > 3 && <div className="tm-compass">⬆️ {q.skillId.startsWith('ss.k') || q.skillId.startsWith('ss.1') ? 'up' : 'N'}</div>}
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : 'idle'} line={fb.said} />
    </div>
  );
}

function RowCells({ r, q, dug, done, hint, onTap }: { r: number; q: MapQuestion; dug: number[]; done: boolean; hint: boolean; onTap: (i: number) => void }) {
  return (
    <>
      {q.coords && <span className="tm-label">{r + 1}</span>}
      {Array.from({ length: q.size }, (_, c) => {
        const i = r * q.size + c;
        const mark = q.landmarks.find((m) => m.cell === i);
        return (
          <button key={i} className={['tm-cell', i === q.start ? 'start' : '', dug.includes(i) ? 'dug' : '', done && i === q.target ? 'found' : '', hint && i === q.target && !done ? 'glow' : ''].join(' ')}
            onClick={() => onTap(i)}>
            {done && i === q.target ? '💰' : dug.includes(i) ? '🕳️' : mark?.emoji ?? ''}
          </button>
        );
      })}
    </>
  );
}
