// Word Search: find the hidden words (or, for preschoolers, every copy of a letter).
import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { CVC, SPELL2 } from '../content/words';
import { SPELL1, SPELL3, SPELL4, SPELL5 } from '../content/wordsUpper';

export interface Placed { word: string; cells: number[] }
export interface SearchPuzzle {
  id: string; skillId: string; step: number;
  size: number; grid: string[];
  words: Placed[];
  /** Pre-K mode: tap every copy of this letter. */
  letter?: string;
  say: string; prompt: string;
}

const LETTERS = 'ABCDEFGHIJKLMNOPRSTUVWY'.split('');
let n = 0;

const SPECS: Record<string, { size: number; count: number; dirs: [number, number][]; pool: string[]; max: number }> = {
  's.k.search': { size: 5, count: 2, dirs: [[1, 0]], pool: CVC.map((w) => w.word), max: 3 },
  's.1.search': { size: 6, count: 3, dirs: [[1, 0], [0, 1]], pool: SPELL1.map((w) => w.word), max: 5 },
  's.2.search': { size: 7, count: 4, dirs: [[1, 0], [0, 1]], pool: SPELL2.map((w) => w.word), max: 6 },
  's.3.search': { size: 8, count: 4, dirs: [[1, 0], [0, 1], [1, 1]], pool: SPELL3.map((w) => w.word), max: 8 },
  's.4.search': { size: 9, count: 5, dirs: [[1, 0], [0, 1], [1, 1]], pool: SPELL4.map((w) => w.word), max: 9 },
  's.5.search': { size: 10, count: 5, dirs: [[1, 0], [0, 1], [1, 1], [-1, 0]], pool: SPELL5.map((w) => w.word), max: 10 },
};

export function searchPuzzle(skillId: string, step: number, rng: Rng): SearchPuzzle {
  n += 1;
  if (skillId === 's.pk.findletter') {
    const size = 4;
    const letter = pick(rng, LETTERS.slice(0, 12));
    const count = step === 1 ? 2 : 3;
    const spots = shuffle(rng, Array.from({ length: size * size }, (_, i) => i)).slice(0, count);
    const others = LETTERS.filter((l) => l !== letter);
    const grid = Array.from({ length: size * size }, (_, i) => (spots.includes(i) ? letter : pick(rng, others)));
    return { id: `w${n}`, skillId, step, size, grid, words: spots.map((c) => ({ word: letter, cells: [c] })), letter, say: `Find every letter ${letter}! Tap them all.`, prompt: `Find every ${letter}!` };
  }
  const spec = SPECS[skillId] ?? SPECS['s.k.search'];
  const count = Math.max(2, spec.count - (step === 1 ? 1 : 0));
  for (let attempt = 0; attempt < 200; attempt++) {
    const grid: (string | null)[] = Array(spec.size * spec.size).fill(null);
    const words: string[] = [];
    for (const w of shuffle(rng, [...new Set(spec.pool.filter((x) => x.length <= Math.min(spec.max, spec.size) && /^[a-z]+$/.test(x)))])) {
      // Skip words that are another chosen word backwards (net/ten), which would be confusing.
      if (words.length < count && !words.includes(w.split('').reverse().join(''))) words.push(w);
    }
    const placed: Placed[] = [];
    let ok = true;
    for (const w of words) {
      const W = w.toUpperCase();
      let done = false;
      for (let t = 0; t < 100 && !done; t++) {
        const [dx, dy] = pick(rng, spec.dirs);
        const x0 = randInt(rng, 0, spec.size - 1), y0 = randInt(rng, 0, spec.size - 1);
        const cells = W.split('').map((_, i) => ({ x: x0 + dx * i, y: y0 + dy * i }));
        if (cells.some((c) => c.x < 0 || c.y < 0 || c.x >= spec.size || c.y >= spec.size)) continue;
        const idx = cells.map((c) => c.y * spec.size + c.x);
        if (idx.some((k, i) => grid[k] !== null && grid[k] !== W[i])) continue;
        idx.forEach((k, i) => { grid[k] = W[i]; });
        placed.push({ word: W, cells: idx });
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;
    const filled = grid.map((c) => c ?? pick(rng, LETTERS));
    // A word could also appear by chance in the random letters; matchWord accepts any copy.
    return { id: `w${n}`, skillId, step, size: spec.size, grid: filled, words: placed, say: `Find these words: ${placed.map((p) => p.word.toLowerCase()).join(', ')}. Tap the first letter, then the last letter.`, prompt: 'Find the words!' };
  }
  throw new Error('could not build word search');
}

/** Cells on a straight line from a to b (inclusive), or null if not straight. */
export function lineCells(size: number, a: number, b: number): number[] | null {
  const ax = a % size, ay = Math.floor(a / size), bx = b % size, by = Math.floor(b / size);
  const dx = Math.sign(bx - ax), dy = Math.sign(by - ay);
  const len = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
  if (!(ax === bx || ay === by || Math.abs(bx - ax) === Math.abs(by - ay))) return null;
  return Array.from({ length: len + 1 }, (_, i) => (ay + dy * i) * size + ax + dx * i);
}

/**
 * Which not-yet-found word a selection spells (forwards or backwards). Matching by letters, not by
 * position, so a word that happens to appear twice counts wherever the kid finds it.
 */
export function matchWord(p: SearchPuzzle, cells: number[], found: Set<string>): Placed | null {
  const text = cells.map((c) => p.grid[c]).join('');
  const rev = text.split('').reverse().join('');
  const w = p.words.find((x) => !found.has(x.word) && x.word === text) ?? p.words.find((x) => !found.has(x.word) && x.word === rev);
  return w ? { word: w.word, cells } : null;
}
