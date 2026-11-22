import { useEffect, useState } from 'react';
import { useRound } from '../../core/useRound';
import { praiseLine, speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import type { GameProps } from '../shared/ChoiceGame';
import { boxDims, makeSudoku, type SudokuPuzzle } from './sudoku';

export const SUDOKU_PUZZLES_PER_ROUND = 4;

/** Picture Sudoku: every row and column (and box) gets one of each picture. */
export function SudokuGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<SudokuPuzzle>({ kid, subject: 'logic', gameId: 'pictureSudoku', onFinish, total: SUDOKU_PUZZLES_PER_ROUND, generate: (skill, step, rng) => makeSudoku(skill.id, step, rng) });
  const p = round.question;
  const [filled, setFilled] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const [bad, setBad] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const box = boxDims(p.size);
  const explain = () => speak(box
    ? 'Every row, every column, and every box needs one of each picture. Tap an empty square, then pick a picture.'
    : 'Every row and every column needs one of each picture. Tap an empty square, then pick a picture.');

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setFilled(p.solution.map((v, i) => (p.givens[i] ? v : null)));
    setSelected(p.givens.findIndex((g) => !g));
    setMisses(0);
    setDone(false);
    const t = setTimeout(explain, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  function choose(v: number) {
    if (selected == null || done || filled[selected] != null) return;
    if (p.solution[selected] === v) {
      sfx.pop();
      const f = [...filled];
      f[selected] = v;
      setFilled(f);
      const next = f.findIndex((x) => x == null);
      setSelected(next >= 0 ? next : null);
      if (next < 0) {
        setDone(true);
        sfx.correct();
        sfx.cheer();
        speak(misses === 0 ? `Perfect puzzle! ${praiseLine(kid.name)}` : `You solved it! ${praiseLine(kid.name)}`, 'praise');
        setTimeout(() => round.submit(misses === 0), 1300);
      }
    } else {
      sfx.boop();
      setBad(v);
      setTimeout(() => setBad(null), 450);
      setMisses((m) => m + 1);
      speak(`Oops! That picture is already in this row, column${box ? ', or box' : ''}. Try another one!`, 'encourage');
    }
  }

  // After two misses, hint by showing which pictures are already used near the selected square.
  const used = new Set<number>();
  if (selected != null && misses >= 2) {
    const r = Math.floor(selected / p.size), c = selected % p.size;
    filled.forEach((v, i) => {
      if (v == null) return;
      const ri = Math.floor(i / p.size), ci = i % p.size;
      const sameBox = !!box && Math.floor(ri / box[0]) === Math.floor(r / box[0]) && Math.floor(ci / box[1]) === Math.floor(c / box[1]);
      if (ri === r || ci === c || sameBox) used.add(v);
    });
  }

  return (
    <div className="screen sudoku-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} onSpeak={explain} />
      <div className="np-text center">One of each in every row and column{box ? ' and box' : ''}!</div>
      <div className="sudoku-body">
        <div className={`sudoku-grid n${p.size}`} style={{ ['--n' as string]: p.size }}>
          {filled.map((v, i) => (
            <button key={i} className={['scell', p.givens[i] ? 'given' : 'blank', selected === i ? 'sel' : '', done ? 'done' : '',
              box && (i % p.size) % box[1] === box[1] - 1 && i % p.size !== p.size - 1 ? 'box-r' : '',
              box && Math.floor(i / p.size) % box[0] === box[0] - 1 && Math.floor(i / p.size) !== p.size - 1 ? 'box-b' : ''].join(' ')}
              onClick={() => { if (!p.givens[i] && filled[i] == null) { sfx.tap(); setSelected(i); } }}>
              {v != null ? p.symbols[v] : ''}
            </button>
          ))}
        </div>
        <div className="sudoku-palette">
          {p.symbols.map((sym, v) => (
            <button key={v} className={`pal ${bad === v ? 'wobble' : ''} ${used.has(v) ? 'dim' : ''}`} onClick={() => choose(v)}>{sym}</button>
          ))}
        </div>
      </div>
      <GameBuddy kid={kid} mood={done ? 'cheer' : bad != null ? 'oops' : 'idle'} combo={0} />
    </div>
  );
}
