import { useEffect, useRef, useState } from 'react';
import type { Subject } from '../../core/types';
import { useRound } from '../../core/useRound';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import { useFeedback } from '../shared/feedback';
import type { GameProps } from '../shared/ChoiceGame';
import { orderQuestion, sentenceQuestion, type SequenceQuestion } from './sequences';

/** Tap things in the right order: words into a sentence, or stages of a life cycle. */
export function SequenceGame({ kid, onFinish, onQuit, kind }: GameProps & { kind: 'sentence' | 'order' }) {
  const subject: Subject = kind === 'sentence' ? 'reading' : 'science';
  const gameId = kind === 'sentence' ? 'sentenceScramble' : 'lifeCycle';
  const round = useRound<SequenceQuestion>({ kid, subject, gameId, onFinish, generate: (skill, step, rng) => (kind === 'sentence' ? sentenceQuestion : orderQuestion)(skill.id, step, rng) });
  const q = round.question;
  const fb = useFeedback(kid);
  // Pool positions used, in order. Tied to the question id so a new (shorter) question never
  // renders with the previous question's picks.
  const [picks, setPicks] = useState<{ qid: string; placed: number[] }>({ qid: q.id, placed: [] });
  const placed = picks.qid === q.id ? picks.placed : [];
  const setPlaced = (pl: number[]) => setPicks({ qid: q.id, placed: pl });
  const [shake, setShake] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const locked = useRef(false);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setMisses(0); setDone(false); fb.reset(); locked.current = false;
    const t = setTimeout(() => speak(q.say, 'question'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const nextIndex = placed.length;
  const item = (i: number) => q.items[i];
  const same = (a: number, b: number) => item(a).text === item(b).text && item(a).emoji === item(b).emoji;

  function tap(poolPos: number) {
    if (locked.current || placed.includes(poolPos)) return;
    const idx = q.pool[poolPos];
    if (same(idx, nextIndex)) {
      sfx.pop();
      const p = [...placed, poolPos];
      setPlaced(p);
      if (p.length === q.items.length) {
        locked.current = true;
        setDone(true);
        fb.praise(kind === 'sentence' ? q.items.map((x) => x.text).join(' ') : '', misses === 0);
        setTimeout(() => round.submit(misses === 0), 1500);
      }
    } else {
      setShake(poolPos);
      setTimeout(() => setShake(null), 450);
      setMisses((m) => m + 1);
      fb.oops(kind === 'sentence' ? `What comes next after "${placed.length ? item(q.pool[placed[placed.length - 1]]).text : 'the start'}"?` : 'What comes next?');
    }
  }

  // After two misses, the next right piece glows.
  const hint = misses >= 2 ? q.pool.findIndex((idx, pos) => !placed.includes(pos) && same(idx, nextIndex)) : -1;
  const Face = ({ i }: { i: number }) => <>{item(i).emoji && <span className="seq-emoji">{item(i).emoji}</span>}{item(i).text && <span className="seq-text">{item(i).text}</span>}</>;

  return (
    <div className={`screen seq-game ${kind}`}>
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={() => speak(q.say, 'question')} />
      <div className="np-text center">{q.prompt}</div>
      {q.picture && <div className="seq-picture">{q.picture}</div>}
      <div className={`seq-slots ${done ? 'done' : ''}`}>
        {q.items.map((_, i) => (
          <span key={i} className={`seq-slot ${i < placed.length ? 'full' : ''} ${i === nextIndex ? 'next' : ''}`}>
            {i < placed.length ? <Face i={q.pool[placed[i]]} /> : kind === 'order' ? <span className="seq-num">{i + 1}</span> : ''}
          </span>
        ))}
      </div>
      <div className="seq-pool">
        {q.pool.map((idx, pos) => (
          <button key={pos} className={`seq-card ${placed.includes(pos) ? 'used' : ''} ${shake === pos ? 'wobble' : ''} ${hint === pos ? 'glow' : ''}`}
            disabled={placed.includes(pos)} onClick={() => tap(pos)}>
            <Face i={idx} />
          </button>
        ))}
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : shake !== null ? 'oops' : 'idle'} line={fb.said} />
    </div>
  );
}
