import { useEffect, useRef, useState } from 'react';
import type { Subject } from '../../core/types';
import { useRound } from '../../core/useRound';
import { speak, setSpeechRate, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy, comboOf } from '../shared/GameBuddy';
import type { GameProps } from '../shared/ChoiceGame';
import { tileQuestion, type TileQuestion } from './tiles';

/** Word Builder and Spelling Bee Garden: hear a word, build it from tiles. */
export function TileGame({ kid, onFinish, onQuit, subject, gameId, garden }: GameProps & { subject: Subject; gameId: string; garden?: boolean }) {
  const round = useRound<TileQuestion>({ kid, subject, gameId, onFinish, generate: (skill, step, rng) => tileQuestion(skill.id, step, rng) });
  const q = round.question;
  const [filled, setFilled] = useState<(number | null)[]>([]); // tile index per slot
  const [misses, setMisses] = useState(0);
  const [shake, setShake] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [flowers, setFlowers] = useState(0);
  const locked = useRef(false);

  useEffect(() => { setSpeechRate(0.85); return () => stopSpeaking(); }, []);

  useEffect(() => {
    setFilled(q.slots.map(() => null));
    setMisses(0);
    setDone(false);
    locked.current = false;
    const t = setTimeout(() => speak(q.say), 350);
    return () => clearTimeout(t);
  }, [q]);

  const nextSlot = q.slots.findIndex((_, i) => !q.given.includes(i) && filled[i] == null);
  const used = new Set(filled.filter((x): x is number => x != null));

  function tapTile(ti: number) {
    if (locked.current || used.has(ti) || nextSlot < 0) return;
    const tile = q.tiles[ti];
    if (tile === q.slots[nextSlot]) {
      sfx.pop();
      const f = [...filled];
      f[nextSlot] = ti;
      setFilled(f);
      const remaining = q.slots.some((_, i) => !q.given.includes(i) && f[i] == null);
      if (!remaining) {
        locked.current = true;
        setDone(true);
        setFlowers((x) => x + 1);
        setTimeout(() => sfx.correct(), 150);
        speak(`${q.word}! ${misses === 0 ? 'Perfect!' : 'You did it!'}`);
        setTimeout(() => round.submit(misses === 0), 1500);
      }
    } else {
      sfx.boop();
      setShake(ti);
      setTimeout(() => setShake(null), 450);
      setMisses((m) => m + 1);
      speak(misses === 0 ? `Try again! ${q.word}.` : `Listen: ${q.word}. ${q.slots.join(', ')}.`);
    }
  }

  const hintTile = misses >= 2 && nextSlot >= 0 ? q.tiles.findIndex((t, i) => t === q.slots[nextSlot] && !used.has(i)) : -1;

  return (
    <div className={`screen tile-game ${garden ? 'garden' : 'builder'}`}>
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={() => speak(q.say)} />
      <div className="tile-picture">
        <span className={done ? 'bounce' : ''}>{q.emoji}</span>
      </div>
      <div className="slots">
        {q.slots.map((s, i) => {
          const shown = q.given.includes(i) ? s : filled[i] != null ? q.tiles[filled[i]!] : '';
          return <span key={i} className={`slot ${shown ? 'full' : ''} ${i === nextSlot ? 'next' : ''} ${q.given.includes(i) ? 'given' : ''}`}>{shown}</span>;
        })}
      </div>
      <div className="tiles">
        {q.tiles.map((t, i) => (
          <button key={i} className={`tile ${used.has(i) ? 'used' : ''} ${shake === i ? 'wobble' : ''} ${hintTile === i ? 'glow' : ''}`}
            onClick={() => tapTile(i)} disabled={used.has(i)}>
            {t}
          </button>
        ))}
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : shake !== null ? 'oops' : 'idle'} combo={done && misses === 0 ? comboOf(round.results) + 1 : 0} />
      {garden && (
        <div className="garden-row" aria-hidden="true">
          {Array.from({ length: round.total }, (_, i) => <span key={i} className={i < flowers ? 'grown' : ''}>{i < flowers ? ['🌷', '🌻', '🌼', '🌸', '🌹'][i % 5] : '🌱'}</span>)}
        </div>
      )}
    </div>
  );
}
