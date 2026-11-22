import { shuffle, randInt, type Rng } from '../../core/random';

export interface SudokuPuzzle {
  skillId: string;
  step: number;
  size: 3 | 4 | 6;
  symbols: string[];
  solution: number[]; // row-major symbol indexes
  givens: boolean[];
}

const SYMBOL_SETS = [['🍎', '🍌', '🍇', '🍊', '🍓', '🍐'], ['🐶', '🐱', '🐰', '🐸', '🐻', '🐷'], ['⭐', '🌙', '☀️', '☁️', '⚡', '🌈'], ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'], ['🚗', '🚂', '✈️', '⛵', '🚲', '🚀']];

/** Rows, columns (and 2×2 boxes for 4×4) each contain every symbol once. */
/** Box shape: none for 3×3, 2×2 boxes for 4×4, 2-row × 3-column boxes for 6×6. */
export function boxDims(size: number): [number, number] | null {
  return size === 4 ? [2, 2] : size === 6 ? [2, 3] : null;
}

export function isValid(size: number, grid: (number | null)[]): boolean {
  const units: number[][] = [];
  for (let r = 0; r < size; r++) units.push(Array.from({ length: size }, (_, c) => r * size + c));
  for (let c = 0; c < size; c++) units.push(Array.from({ length: size }, (_, r) => r * size + c));
  const box = boxDims(size);
  if (box) {
    const [bh, bw] = box;
    for (let br = 0; br < size; br += bh) for (let bc = 0; bc < size; bc += bw) {
      const u: number[] = [];
      for (let r = br; r < br + bh; r++) for (let c = bc; c < bc + bw; c++) u.push(r * size + c);
      units.push(u);
    }
  }
  return units.every((u) => {
    const vals = u.map((i) => grid[i]).filter((v): v is number => v != null);
    return new Set(vals).size === vals.length;
  });
}

export function countSolutions(size: number, grid: (number | null)[], limit = 2): number {
  const i = grid.indexOf(null);
  if (i < 0) return 1;
  let n = 0;
  for (let v = 0; v < size && n < limit; v++) {
    grid[i] = v;
    if (isValid(size, grid)) n += countSolutions(size, grid, limit - n);
    grid[i] = null;
  }
  return n;
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

function fullGrid(size: 3 | 4 | 6, rng: Rng): number[] {
  const box = boxDims(size);
  const [bh, bw] = box ?? [1, 1];
  // A known-good grid: v(r, c) = (bw·(r mod bh) + ⌊r / bh⌋ + c) mod size. For 3×3 that's a plain cycle.
  const base = range(size).map((r) => range(size).map((c) => (box ? bw * (r % bh) + Math.floor(r / bh) + c : r + c) % size));
  const perm = shuffle(rng, range(size));
  let rows = base.map((r) => r.map((v) => perm[v]));
  if (!box) {
    rows = shuffle(rng, rows);
    const cols = shuffle(rng, range(size));
    rows = rows.map((r) => cols.map((c) => r[c]));
  } else {
    // Shuffle rows within bands and bands themselves (same for columns) so boxes stay valid.
    const rowOrder = shuffle(rng, range(size / bh)).flatMap((b) => shuffle(rng, range(bh).map((i) => b * bh + i)));
    const colOrder = shuffle(rng, range(size / bw)).flatMap((b) => shuffle(rng, range(bw).map((i) => b * bw + i)));
    rows = rowOrder.map((r) => colOrder.map((c) => rows[r][c]));
  }
  return rows.flat();
}

const BLANKS: Record<string, [3 | 4 | 6, number][]> = {
  'l.k.sudoku3': [[3, 1], [3, 2], [3, 3]],
  'l.1.sudoku': [[3, 3], [4, 3], [4, 5]],
  'l.2.sudoku4': [[3, 3], [4, 4], [4, 7]],
  'l.3.sudoku': [[4, 6], [4, 8], [4, 10]],
  'l.4.sudoku6': [[6, 8], [6, 12], [6, 16]],
  'l.5.sudoku6': [[6, 14], [6, 18], [6, 22]],
};

export function makeSudoku(skillId: string, step: number, rng: Rng): SudokuPuzzle {
  const [size, blanks] = (BLANKS[skillId] ?? BLANKS['l.2.sudoku4'])[Math.min(step, 3) - 1];
  const solution = fullGrid(size, rng);
  const symbols = shuffle(rng, SYMBOL_SETS[randInt(rng, 0, SYMBOL_SETS.length - 1)]).slice(0, size);
  // Remove cells one at a time, keeping the answer unique.
  const givens = solution.map(() => true);
  const order = shuffle(rng, solution.map((_, i) => i));
  let removed = 0;
  for (const i of order) {
    if (removed >= blanks) break;
    givens[i] = false;
    const grid = solution.map((v, j) => (givens[j] ? v : null));
    if (countSolutions(size, grid) === 1) removed++;
    else givens[i] = true;
  }
  return { skillId, step, size, symbols, solution, givens };
}
