import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import { useFeedback } from '../shared/feedback';
import type { GameProps } from '../shared/ChoiceGame';
import { lineQuestion, type LineQuestion } from './numberLine';

/** Number Line Hop: tap the spot on the number line; the frog hops there. */
export function NumberLineGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<LineQuestion>({ kid, subject: 'math', gameId: 'numberLine', onFinish, generate: (skill, step, rng) => lineQuestion(skill.id, step, rng) });
  const q = round.question;
  const fb = useFeedback(kid);
  const [frog, setFrog] = useState<number>(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const locked = useRef(false);
  const lineRef = useRef<HTMLDivElement>(null);
  const oopsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { stopSpeaking(); if (oopsTimer.current) clearTimeout(oopsTimer.current); }, []);
  useEffect(() => {
    setFrog(q.start ?? 0); setMisses(0); setDone(false); setWrong(null); fb.reset(); locked.current = false;
    const t = setTimeout(() => speak(q.say, 'question'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function tapAt(clientX: number) {
    if (locked.current || !lineRef.current) return;
    const r = lineRef.current.getBoundingClientRect();
    const i = Math.round(((clientX - r.left) / r.width) * q.ticks);
    choose(Math.max(0, Math.min(q.ticks, i)));
  }

  function choose(i: number) {
    if (locked.current) return;
    if (oopsTimer.current) { clearTimeout(oopsTimer.current); oopsTimer.current = null; }
    setFrog(i);
    sfx.whoosh();
    if (i === q.target) {
      locked.current = true;
      setDone(true);
      setTimeout(() => fb.praise(`${q.labels[i]}!`, misses === 0), 300);
      setTimeout(() => round.submit(misses === 0), 1500);
    } else {
      setWrong(i);
      setMisses((m) => m + 1);
      oopsTimer.current = setTimeout(() => {
        oopsTimer.current = null;
        if (locked.current) return;
        fb.oops(`That’s ${q.labels[i]}. ${q.say}`);
        setFrog(q.start ?? 0);
      }, 450);
    }
  }

  const pct = (i: number) => `${(i / q.ticks) * 100}%`;
  return (
    <div className="screen numberline-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={() => speak(q.say, 'question')} />
      <div className="np-text center">{q.prompt}</div>
      <div className="nl-wrap">
        <div className="nl-line" ref={lineRef} onClick={(e) => tapAt(e.clientX)}>
          <span className="nl-frog" style={{ left: pct(frog) }}>🐸</span>
          {Array.from({ length: q.ticks + 1 }, (_, i) => (
            <button key={i} className={`nl-tick ${i === q.start ? 'start' : ''} ${wrong === i ? 'wrong' : ''} ${misses >= 2 && i === q.target ? 'glow' : ''} ${done && i === q.target ? 'hit' : ''}`}
              style={{ left: pct(i) }} onClick={(e) => { e.stopPropagation(); choose(i); }} aria-label={q.labels[i]}>
              <span className="nl-mark" />
              <span className="nl-label">{q.shown[i] || misses >= 2 ? q.labels[i] : ''}</span>
            </button>
          ))}
        </div>
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : wrong !== null && !done ? 'oops' : 'idle'} line={fb.said} />
    </div>
  );
}
