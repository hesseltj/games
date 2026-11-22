import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { defaultRng } from '../../core/random';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import { useFeedback } from '../shared/feedback';
import type { GameProps } from '../shared/ChoiceGame';
import { LEVEL_BY_SKILL, LINES, robotMove, winner, type Cell, type Level } from './ticTacToe';

export const TTT_GAMES_PER_ROUND = 3;

/** Tic-Tac-Toe Challenge: three games against the robot. A win (or a draw against the perfect robot) counts. */
export function TicTacToeGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<{ level: Level }>({ kid, subject: 'logic', gameId: 'ticTacToe', onFinish, total: TTT_GAMES_PER_ROUND, generate: (skill) => ({ level: LEVEL_BY_SKILL[skill.id] ?? 'silly' }) });
  const level = round.question.level;
  const fb = useFeedback(kid);
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [over, setOver] = useState<'X' | 'O' | 'draw' | null>(null);
  const thinking = useRef(false);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setBoard(Array(9).fill(null)); setOver(null); fb.reset(); thinking.current = false;
    const t = setTimeout(() => speak('You are X. Get three in a row to beat the robot!', 'question'), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.question]);

  function finish(result: 'X' | 'O' | 'draw') {
    setOver(result);
    const good = result === 'X' || (result === 'draw' && level === 'perfect');
    if (result === 'X') fb.praise('You beat the robot!', true);
    else if (result === 'draw') { sfx.tap(); speak(level === 'perfect' ? 'A tie with the smartest robot! That counts as a win!' : 'It’s a tie! Try to get three in a row next time.', level === 'perfect' ? 'praise' : 'encourage'); }
    else { sfx.boop(); speak('The robot got three in a row this time. You’ll get it next time!', 'encourage'); }
    setTimeout(() => round.submit(good), 2200);
  }

  function play(i: number) {
    if (board[i] || over || thinking.current) return;
    sfx.pop();
    const b = [...board]; b[i] = 'X';
    setBoard(b);
    const w = winner(b);
    if (w) return finish(w);
    thinking.current = true;
    setTimeout(() => {
      const m = robotMove(b, level, defaultRng);
      const b2 = [...b]; b2[m] = 'O';
      setBoard(b2);
      sfx.tap();
      thinking.current = false;
      const w2 = winner(b2);
      if (w2) finish(w2);
    }, 550);
  }

  const winLine = over && over !== 'draw' ? LINES.find(([a, c, d]) => board[a] === over && board[c] === over && board[d] === over) : null;
  const names: Record<Level, string> = { silly: 'Silly Robot', sometimes: 'Tricky Robot', smart: 'Smart Robot', perfect: 'Super Robot' };
  return (
    <div className="screen ttt-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit} />
      <div className="np-text center">You ❌ vs 🤖 {names[level]}</div>
      <div className="ttt-grid">
        {board.map((c, i) => (
          <button key={i} className={`ttt-cell ${winLine?.includes(i) ? 'win' : ''}`} onClick={() => play(i)}>
            {c === 'X' ? '❌' : c === 'O' ? '⭕' : ''}
          </button>
        ))}
      </div>
      <div className="ttt-status">{over === 'X' ? 'You win! 🎉' : over === 'O' ? 'Robot wins!' : over === 'draw' ? 'Tie game!' : thinking.current ? 'Robot is thinking…' : 'Your turn!'}</div>
      <GameBuddy kid={kid} mood={over === 'X' ? 'cheer' : over === 'O' ? 'oops' : 'idle'} line={fb.said} />
    </div>
  );
}
