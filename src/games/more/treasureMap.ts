// Treasure Map: follow directions (or coordinates) on a grid and tap where the treasure is.
import { pick, randInt, shuffle, type Rng } from '../../core/random';

export interface MapQuestion {
  id: string; skillId: string; step: number;
  size: number;
  landmarks: { cell: number; emoji: string; name: string }[];
  target: number;
  start?: number;
  coords: boolean; // show A–F / 1–6 labels
  say: string; prompt: string;
}

const MARKS = [
  { emoji: '🌴', name: 'palm tree' }, { emoji: '🏝️', name: 'island' }, { emoji: '🦜', name: 'parrot' }, { emoji: '⛵', name: 'boat' },
  { emoji: '🗿', name: 'stone head' }, { emoji: '🐙', name: 'octopus' }, { emoji: '🏰', name: 'castle' }, { emoji: '🌋', name: 'volcano' },
  { emoji: '🐊', name: 'crocodile' }, { emoji: '⛺', name: 'tent' },
];
const COLS = 'ABCDEF';
let n = 0;

const WORDS = {
  simple: { n: 'up', s: 'down', e: 'right', w: 'left' },
  compass: { n: 'north', s: 'south', e: 'east', w: 'west' },
};
const D = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] } as const;
type Dir = keyof typeof D;

export function mapQuestion(skillId: string, step: number, rng: Rng): MapQuestion {
  n += 1;
  const id = `m${n}`;
  const size = skillId === 'ss.pk.find' ? 3 : skillId.startsWith('ss.k') ? 4 : skillId.startsWith('ss.1') || skillId.startsWith('ss.2') ? 5 : 6;
  const cells = shuffle(rng, Array.from({ length: size * size }, (_, i) => i));
  const marks = shuffle(rng, MARKS).slice(0, size === 3 ? 3 : 4).map((m, i) => ({ ...m, cell: cells[i] }));
  if (skillId === 'ss.pk.find') {
    const m = pick(rng, marks);
    return { id, skillId, step, size, landmarks: marks, target: m.cell, coords: false, say: `Find the ${m.name} on the map! Tap it.`, prompt: `Find the ${m.emoji}!` };
  }
  if (skillId === 'ss.4.coords') {
    const t = randInt(rng, 0, size * size - 1);
    const label = `${COLS[t % size]}${Math.floor(t / size) + 1}`;
    return { id, skillId, step, size, landmarks: marks.filter((m) => m.cell !== t), target: t, coords: true, say: `The treasure is buried at ${label.split('').join(' ')}. Tap that square!`, prompt: `Dig at ${label}!` };
  }
  // Walk from a start landmark following moves.
  const compass = !['ss.k.steps', 'ss.1.steps'].includes(skillId);
  const words = compass ? WORDS.compass : WORDS.simple;
  const moves = skillId === 'ss.k.steps' ? 1 : skillId === 'ss.1.steps' || skillId === 'ss.2.steps' ? 2 : 3;
  for (let tries = 0; tries < 200; tries++) {
    const start = pick(rng, marks);
    let x = start.cell % size, y = Math.floor(start.cell / size);
    const plan: string[] = [];
    let ok = true;
    let lastDir: Dir | null = null;
    for (let k = 0; k < moves; k++) {
      const dir = pick(rng, (['n', 's', 'e', 'w'] as Dir[]).filter((d) => d !== lastDir && !(lastDir && D[d][0] === -D[lastDir][0] && D[d][1] === -D[lastDir][1])));
      const steps = randInt(rng, 1, step === 1 ? 2 : 3);
      x += D[dir][0] * steps; y += D[dir][1] * steps;
      if (x < 0 || y < 0 || x >= size || y >= size) { ok = false; break; }
      plan.push(`${steps} ${steps === 1 ? 'step' : 'steps'} ${words[dir]}`);
      lastDir = dir;
    }
    const target = y * size + x;
    if (!ok || target === start.cell) continue;
    const coords = skillId === 'ss.5.coords';
    const from = coords ? `${COLS[start.cell % size]}${Math.floor(start.cell / size) + 1}` : `the ${start.name}`;
    const say = `Start at ${from}. Go ${plan.join(', then ')}. Tap where the treasure is!`;
    return { id, skillId, step, size, landmarks: marks, target, start: start.cell, coords, say, prompt: `From ${coords ? from : start.emoji}: ${plan.join(', ')}` };
  }
  return mapQuestion('ss.pk.find', step, rng);
}
