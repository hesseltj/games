import { randInt, type Rng } from '../../core/random';

export type Dir = 'up' | 'down' | 'left' | 'right';
export const DIRS: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
export const ARROW: Record<Dir, string> = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };

export interface Pos { x: number; y: number }
export interface Puzzle {
  skillId: string;
  step: number;
  size: number;
  walls: Set<string>;
  start: Pos;
  goal: Pos;
  mode: 'tap' | 'program';
  /** Shortest path from start to goal, including both ends. */
  path: Pos[];
}

export const key = (p: Pos) => `${p.x},${p.y}`;

interface Spec { size: number; walls: [number, number]; dist: [number, number] }
const SPECS: Record<string, Spec[]> = {
  'l.pk.maze': [{ size: 3, walls: [0, 0], dist: [2, 3] }, { size: 3, walls: [1, 2], dist: [3, 4] }, { size: 4, walls: [2, 3], dist: [4, 5] }],
  'l.k.maze': [{ size: 4, walls: [2, 3], dist: [3, 5] }, { size: 4, walls: [3, 5], dist: [5, 6] }, { size: 5, walls: [5, 7], dist: [6, 8] }],
  'l.2.robot': [{ size: 4, walls: [0, 1], dist: [2, 3] }, { size: 5, walls: [3, 5], dist: [4, 5] }, { size: 5, walls: [5, 7], dist: [6, 8] }],
};

export function shortestPath(size: number, walls: Set<string>, start: Pos, goal: Pos): Pos[] | null {
  const prev = new Map<string, Pos | null>([[key(start), null]]);
  const queue: Pos[] = [start];
  while (queue.length) {
    const p = queue.shift()!;
    if (p.x === goal.x && p.y === goal.y) {
      const path: Pos[] = [];
      for (let c: Pos | null = p; c; c = prev.get(key(c)) ?? null) path.unshift(c);
      return path;
    }
    for (const [dx, dy] of Object.values(DIRS)) {
      const n = { x: p.x + dx, y: p.y + dy };
      if (n.x < 0 || n.y < 0 || n.x >= size || n.y >= size || walls.has(key(n)) || prev.has(key(n))) continue;
      prev.set(key(n), p);
      queue.push(n);
    }
  }
  return null;
}

export function makePuzzle(skillId: string, step: number, rng: Rng): Puzzle {
  const spec = (SPECS[skillId] ?? SPECS['l.k.maze'])[Math.min(step, 3) - 1];
  const mode = skillId === 'l.2.robot' ? 'program' : 'tap';
  for (let attempt = 0; attempt < 500; attempt++) {
    const rnd = (): Pos => ({ x: randInt(rng, 0, spec.size - 1), y: randInt(rng, 0, spec.size - 1) });
    const start = rnd();
    const goal = rnd();
    const walls = new Set<string>();
    const nWalls = randInt(rng, spec.walls[0], spec.walls[1]);
    while (walls.size < nWalls) {
      const w = rnd();
      if (key(w) !== key(start) && key(w) !== key(goal)) walls.add(key(w));
    }
    const path = shortestPath(spec.size, walls, start, goal);
    if (!path) continue;
    const dist = path.length - 1;
    if (dist < spec.dist[0] || dist > spec.dist[1]) continue;
    return { skillId, step, size: spec.size, walls, start, goal, mode, path };
  }
  // Fallback: an open board, corner to corner.
  const size = spec.size;
  const start = { x: 0, y: 0 }, goal = { x: size - 1, y: size - 1 };
  return { skillId, step, size, walls: new Set(), start, goal, mode, path: shortestPath(size, new Set(), start, goal)! };
}

/** Run a program of moves. Stops at the first bump. */
export function runProgram(p: Puzzle, moves: Dir[]): { trail: Pos[]; bumped: boolean; reached: boolean } {
  let cur = p.start;
  const trail = [cur];
  for (const m of moves) {
    const [dx, dy] = DIRS[m];
    const n = { x: cur.x + dx, y: cur.y + dy };
    if (n.x < 0 || n.y < 0 || n.x >= p.size || n.y >= p.size || p.walls.has(key(n))) return { trail, bumped: true, reached: false };
    cur = n;
    trail.push(cur);
  }
  return { trail, bumped: false, reached: cur.x === p.goal.x && cur.y === p.goal.y };
}

export function isNeighbor(a: Pos, b: Pos) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}
