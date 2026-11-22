import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import { useFeedback } from '../shared/feedback';
import type { GameProps } from '../shared/ChoiceGame';
import { lineCells, matchWord, searchPuzzle, type SearchPuzzle } from './wordSearch';

export const SEARCHES_PER_ROUND = 3;

/** Word Search: tap the first letter, then the last letter of a word. */
export function WordSearchGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<SearchPuzzle>({ kid, subject: 'spelling', gameId: 'wordSearch', onFinish, total: SEARCHES_PER_ROUND, generate: (skill, step, rng) => searchPuzzle(skill.id, step, rng) });
  const p = round.question;
  const fb = useFeedback(kid);
  const [found, setFound] = useState<Map<string, number[]>>(new Map());
  const [anchor, setAnchor] = useState<number | null>(null);
  const [bad, setBad] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const locked = useRef(false);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setFound(new Map()); setAnchor(null); setMisses(0); setDone(false); fb.reset(); locked.current = false;
    const t = setTimeout(() => speak(p.say, 'question'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const foundCells = new Set([...found.values()].flat());
  const total = p.letter ? p.words.length : p.words.length;

  function record(word: string, cells: number[]) {
    const f = new Map(found).set(word + (p.letter ? cells[0] : ''), cells);
    setFound(f);
    sfx.pop();
    if (f.size === total) {
      locked.current = true;
      setDone(true);
      fb.praise('You found them all!', misses === 0);
      setTimeout(() => round.submit(misses <= 1), 1600);
    } else if (!p.letter) {
      speak(word.toLowerCase(), 'praise');
    }
  }

  function miss(cells: number[]) {
    setBad(cells);
    setTimeout(() => setBad([]), 500);
    setMisses((m) => m + 1);
    fb.oops();
  }

  function tap(i: number) {
    if (locked.current) return;
    if (p.letter) {
      if (foundCells.has(i)) return;
      if (p.grid[i] === p.letter) record(p.letter, [i]);
      else miss([i]);
      return;
    }
    if (anchor === null) { sfx.tap(); setAnchor(i); return; }
    if (anchor === i) { setAnchor(null); return; }
    const cells = lineCells(p.size, anchor, i);
    setAnchor(null);
    const already = new Set([...found.keys()]);
    const m = cells && matchWord(p, cells, already);
    if (m) record(m.word, m.cells);
    else miss(cells ?? [anchor, i]);
  }

  return (
    <div className="screen wordsearch-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={() => speak(p.say, 'question')} />
      <div className="np-text center">{p.letter ? `Find every ${p.letter}!` : 'Tap the first letter, then the last letter.'}</div>
      <div className="ws-body">
        <div className="ws-grid" style={{ ['--n' as string]: p.size }}>
          {p.grid.map((ch, i) => (
            <button key={i} className={['ws-cell', foundCells.has(i) ? 'found' : '', anchor === i ? 'anchor' : '', bad.includes(i) ? 'bad' : ''].join(' ')} onClick={() => tap(i)}>{ch}</button>
          ))}
        </div>
        {!p.letter && (
          <ul className="ws-list">
            {p.words.map((w) => <li key={w.word} className={found.has(w.word) ? 'got' : ''}>{found.has(w.word) ? '✅' : '🔍'} {w.word}</li>)}
          </ul>
        )}
        {p.letter && <div className="ws-count">{found.size} / {total}</div>}
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : bad.length ? 'oops' : 'idle'} line={fb.said} />
    </div>
  );
}
