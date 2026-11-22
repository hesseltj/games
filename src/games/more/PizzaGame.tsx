import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import { useFeedback } from '../shared/feedback';
import type { GameProps } from '../shared/ChoiceGame';
import { pizzaQuestion, type PizzaQuestion } from './pizza';

const OUT = '#2d3a6b';

/** Fraction Pizza: tap slices to add toppings, then press Done. */
export function PizzaGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<PizzaQuestion>({ kid, subject: 'math', gameId: 'fractionPizza', onFinish, generate: (skill, step, rng) => pizzaQuestion(skill.id, step, rng) });
  const q = round.question;
  const fb = useFeedback(kid);
  const [on, setOn] = useState<Set<number>>(new Set());
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const locked = useRef(false);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setOn(new Set()); setMisses(0); setDone(false); fb.reset(); locked.current = false;
    const t = setTimeout(() => speak(q.say, 'question'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function toggle(i: number) {
    if (locked.current) return;
    sfx.tap();
    setOn((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  }

  function check() {
    if (locked.current) return;
    if (on.size === q.need) {
      locked.current = true;
      setDone(true);
      fb.praise('Yum!', misses === 0);
      setTimeout(() => round.submit(misses === 0), 1500);
    } else {
      setMisses((m) => m + 1);
      fb.oops(`${on.size < q.need ? 'You need more.' : 'That’s too many.'} ${misses >= 1 ? q.hint : ''}`);
    }
  }

  const r = 90;
  const slices = Array.from({ length: q.slices }, (_, i) => {
    const a0 = (i / q.slices) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / q.slices) * 2 * Math.PI - Math.PI / 2;
    const mid = (a0 + a1) / 2;
    const d = q.slices === 1 ? `M100 10 A90 90 0 1 1 99.99 10 Z`
      : `M100 100 L${100 + r * Math.cos(a0)} ${100 + r * Math.sin(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)} Z`;
    return { d, cx: 100 + Math.cos(mid) * 55, cy: 100 + Math.sin(mid) * 55 };
  });
  return (
    <div className="screen pizza-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={() => speak(q.say, 'question')} />
      <div className="np-text center">{q.prompt}</div>
      <div className="pizza-body">
        <svg className={`pizza ${done ? 'done' : ''}`} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="97" fill="#e0a458" stroke={OUT} strokeWidth="4" />
          {slices.map((s, i) => (
            <g key={i} onClick={() => toggle(i)} className="slice">
              <path d={s.d} fill={on.has(i) ? '#ffd166' : '#f6d6a0'} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
              {on.has(i) && <text x={s.cx} y={s.cy + 9} textAnchor="middle" fontSize={q.slices > 8 ? 16 : 24}>🔴</text>}
            </g>
          ))}
        </svg>
        <div className="pizza-side">
          <div className="pizza-count">{on.size} of {q.slices}</div>
          <button className="big-btn go" onClick={check} disabled={done}>Done ✓</button>
        </div>
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : 'idle'} line={fb.said} />
    </div>
  );
}
