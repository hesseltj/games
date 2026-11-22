// Tic-Tac-Toe Challenge: the kid is X and moves first; the robot gets smarter with grade.
import type { Rng } from '../../core/random';

export type Cell = 'X' | 'O' | null;
export type Level = 'silly' | 'sometimes' | 'smart' | 'perfect';
export const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export const LEVEL_BY_SKILL: Record<string, Level> = { 'l.pk.ttt': 'silly', 'l.1.ttt': 'sometimes', 'l.3.ttt': 'smart', 'l.5.ttt': 'perfect' };

export function winner(b: Cell[]): 'X' | 'O' | 'draw' | null {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every(Boolean) ? 'draw' : null;
}

function minimax(b: Cell[], turn: 'X' | 'O'): number {
  const w = winner(b);
  if (w === 'O') return 1;
  if (w === 'X') return -1;
  if (w === 'draw') return 0;
  const scores = b.map((c, i) => {
    if (c) return null;
    const nb = [...b]; nb[i] = turn;
    return minimax(nb, turn === 'O' ? 'X' : 'O');
  }).filter((x): x is number => x !== null);
  return turn === 'O' ? Math.max(...scores) : Math.min(...scores);
}

function findLine(b: Cell[], who: 'X' | 'O'): number | null {
  for (const line of LINES) {
    const marks = line.filter((i) => b[i] === who).length;
    const empty = line.filter((i) => !b[i]);
    if (marks === 2 && empty.length === 1) return empty[0];
  }
  return null;
}

/** The robot's move (it plays O). */
export function robotMove(b: Cell[], level: Level, rng: Rng): number {
  const empty = b.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
  const random = () => empty[Math.floor(rng() * empty.length)];
  if (level === 'silly') return random();
  const win = findLine(b, 'O');
  const block = findLine(b, 'X');
  if (level === 'sometimes') return (rng() < 0.5 ? win ?? block : null) ?? random();
  if (level === 'smart') return win ?? block ?? (!b[4] ? 4 : random());
  let best = empty[0], bestScore = -2;
  for (const i of empty) {
    const nb = [...b]; nb[i] = 'O';
    const s = minimax(nb, 'X');
    if (s > bestScore) { bestScore = s; best = i; }
  }
  return best;
}
