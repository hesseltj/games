import { shuffle, randInt, type Rng } from '../../core/random';

export interface SudokuPuzzle {
  skillId: string;
  step: number;
  size: 3 | 4;
  symbols: string[];
  solution: number[]; // row-major symbol indexes
  givens: boolean[];
}

const SYMBOL_SETS = [['🍎', '🍌', '🍇', '🍊'], ['🐶', '🐱', '🐰', '🐸'], ['⭐', '🌙', '☀️', '☁️'], ['🔴', '🔵', '🟡', '🟢'], ['🚗', '🚂', '✈️', '⛵']];

/** Rows, columns (and 2×2 boxes for 4×4) each contain every symbol once. */
export function isValid(size: number, grid: (number | null)[]): boolean {
  const units: number[][] = [];
  for (let r = 0; r < size; r++) units.push(Array.from({ length: size }, (_, c) => r * size + c));
  for (let c = 0; c < size; c++) units.push(Array.from({ length: size }, (_, r) => r * size + c));
  if (size === 4) for (const br of [0, 2]) for (const bc of [0, 2]) units.push([br * 4 + bc, br * 4 + bc + 1, (br + 1) * 4 + bc, (br + 1) * 4 + bc + 1]);
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

function fullGrid(size: 3 | 4, rng: Rng): number[] {
  const base = size === 3 ? [[0, 1, 2], [1, 2, 0], [2, 0, 1]] : [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
  const perm = shuffle(rng, Array.from({ length: size }, (_, i) => i));
  let rows = base.map((r) => r.map((v) => perm[v]));
  if (size === 3) {
    rows = shuffle(rng, rows);
    const cols = shuffle(rng, [0, 1, 2]);
    rows = rows.map((r) => cols.map((c) => r[c]));
  } else {
    // Shuffle within bands/stacks and swap bands/stacks so 2×2 boxes stay valid.
    const bandOrder = shuffle(rng, [0, 1]);
    const rowOrder = bandOrder.flatMap((b) => shuffle(rng, [b * 2, b * 2 + 1]));
    const stackOrder = shuffle(rng, [0, 1]);
    const colOrder = stackOrder.flatMap((b) => shuffle(rng, [b * 2, b * 2 + 1]));
    rows = rowOrder.map((r) => colOrder.map((c) => rows[r][c]));
  }
  return rows.flat();
}

const BLANKS: Record<string, [3 | 4, number][]> = {
  'l.k.sudoku3': [[3, 1], [3, 2], [3, 3]],
  'l.2.sudoku4': [[3, 3], [4, 4], [4, 7]],
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
