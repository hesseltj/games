import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, numberChoices, others, pickOne, question } from '../shared/build';
import type { ChoiceGen, OptContent, ShapeName } from '../shared/types';
import { CATEGORIES } from '../content/words';

const UNITS_BY_STEP: string[][] = [
  ['AB'],
  ['AB', 'AAB', 'ABB', 'ABC'],
  ['AAB', 'ABB', 'ABC', 'AABB', 'ABCC', 'ABAC'],
];

const SETS = [
  ['🔴', '🔵', '🟡', '🟢', '🟣'],
  ['🍎', '🍌', '🍇', '🍓', '🍊'],
  ['🐶', '🐱', '🐰', '🐻', '🐸'],
  ['⭐', '🌙', '☀️', '☁️', '⚡'],
  ['🚗', '🚌', '🚂', '✈️', '🚲'],
];

export function buildPattern(rng: Rng, step: number, pool: string[]) {
  if (pool.length < 4) pool = [...new Set([...pool, '🔴', '🔵', '🟡', '🟢'])];
  const unit = pick(rng, UNITS_BY_STEP[Math.min(step, 3) - 1]);
  const letters = [...new Set(unit.split(''))];
  const symbols = shuffle(rng, pool).slice(0, letters.length);
  const map = Object.fromEntries(letters.map((l, i) => [l, symbols[i]]));
  const len = Math.max(unit.length * 2, 5) + randInt(rng, 0, unit.length - 1);
  const seq = Array.from({ length: len + 1 }, (_, i) => map[unit[i % unit.length]]);
  return { shown: seq.slice(0, len), answer: seq[len], symbols, pool };
}

const COLOR_GROUPS: Record<string, string[]> = {
  red: ['🍎', '🍓', '🚒', '🍒', '❤️'],
  yellow: ['🍌', '🌻', '⭐', '🐥', '🧀'],
  green: ['🥦', '🐸', '🌲', '🥒', '🍏'],
  blue: ['🐳', '💙', '🧢', '🫐', '🔵'],
  orange: ['🍊', '🥕', '🎃', '🦊', '🏀'],
  purple: ['🍇', '🍆', '🔮', '💜', '🟣'],
};

export const PATTERN_TRAIN: Record<string, ChoiceGen> = {
  'l.pk.pattern': (ctx) => patternQ('l.pk.pattern', { ...ctx, step: Math.min(ctx.step, 1) }, ctx.step),
  'l.k.pattern': (ctx) => patternQ('l.k.pattern', { ...ctx, step: Math.min(ctx.step + 1, 3) }, ctx.step),

  'l.pk.sort': ({ rng, step }) => {
    const colors = shuffle(rng, Object.keys(COLOR_GROUPS));
    const [target, match] = shuffle(rng, COLOR_GROUPS[colors[0]]);
    const wrong = colors.slice(1, choiceCount(step)).map((c) => pick(rng, COLOR_GROUPS[c]));
    return question('l.pk.sort', step, `Find the one that is the same color as this!`, 'Same color?', { kind: 'emoji', emoji: target },
      pickOne(match, wrong, (e) => emo(e)), rng);
  },

  'l.k.oddone': ({ rng, step }) => {
    const [main, odd] = shuffle(rng, CATEGORIES);
    const same = shuffle(rng, main.items).slice(0, choiceCount(step) - 1);
    return question('l.k.oddone', step, `Which one does not belong?`, `Which one doesn't belong?`, { kind: 'none' },
      pickOne(pick(rng, odd.items), same, (e) => emo(e)), rng, `Which one does not belong? Three are ${main.plural}.`);
  },

  'l.2.sequence': ({ rng, step }) => {
    const rules = step === 1 ? [2, 5, 10] : step === 2 ? [3, 4, -2, -5, 10] : [3, 6, -3, 'x2', 9, 11];
    const rule = pick(rng, rules as (number | 'x2')[]);
    let start = rule === 'x2' ? pick(rng, [1, 2, 3, 5]) : typeof rule === 'number' && rule < 0 ? randInt(rng, 30, 60) : randInt(rng, 0, 20);
    const seq: number[] = [];
    for (let i = 0; i < 5; i++) { seq.push(start); start = rule === 'x2' ? start * 2 : start + (rule as number); }
    const ans = seq.pop()!;
    const diff = seq[1] - seq[0];
    const opts = numberChoices(rng, ans, choiceCount(step), Math.max(0, ans - 12), ans + 12, Math.max(2, Math.abs(diff)));
    const say = rule === 'x2' ? 'Each number doubles. What comes next?' : 'What number comes next?';
    return question('l.2.sequence', step, step === 3 ? 'What number comes next?' : say, 'What comes next?',
      { kind: 'pattern', items: seq.map((n): OptContent => ({ kind: 'number', n })) },
      opts.map((n) => ({ content: { kind: 'number', n } as OptContent, correct: n === ans })), rng);
  },
};

function patternQ(skillId: string, ctx: Parameters<ChoiceGen>[0], realStep: number) {
  const { rng, objects } = ctx;
  const pool = rng() < 0.4 ? [...new Set(objects)] : pick(rng, SETS);
  const p = buildPattern(rng, ctx.step, pool.length >= 3 ? pool : SETS[0]);
  const wrong = others(rng, [...new Set([...p.symbols, ...p.pool])], choiceCount(realStep) - 1, (x) => x === p.answer);
  return question(skillId, realStep, 'What comes next on the pattern train?', 'What comes next?',
    { kind: 'pattern', items: p.shown.map((e) => emo(e)) }, pickOne(p.answer, wrong, (e) => emo(e)), rng);
}

/** Putting shapes together (an early tangram skill): which new shape do these pieces make? */
const COMPOSE: { parts: ShapeName[]; makes: ShapeName; name: string; say: string }[] = [
  { parts: ['rtriangle', 'rtriangle'], makes: 'square', name: 'square', say: 'Two triangles can make a square.' },
  { parts: ['square', 'square'], makes: 'rectangle', name: 'rectangle', say: 'Two squares side by side make a rectangle.' },
  { parts: ['semicircle', 'semicircle'], makes: 'circle', name: 'circle', say: 'Two half circles make a circle.' },
  { parts: ['trapezoid', 'trapezoid'], makes: 'hexagon', name: 'hexagon', say: 'Two trapezoids make a hexagon.' },
  { parts: ['triangle', 'triangle', 'triangle', 'triangle', 'triangle', 'triangle'], makes: 'hexagon', name: 'hexagon', say: 'Six triangles make a hexagon.' },
  { parts: ['square', 'square', 'square', 'square'], makes: 'square', name: 'big square', say: 'Four squares make a bigger square.' },
  { parts: ['triangle', 'triangle'], makes: 'diamond', name: 'diamond', say: 'Two triangles, one upside down, make a diamond.' },
];
// Shapes that can never be built from straight-edged pieces (or from half circles).
const CURVY: ShapeName[] = ['circle', 'heart', 'oval', 'star'];
const STRAIGHT: ShapeName[] = ['square', 'triangle', 'rectangle', 'hexagon'];

PATTERN_TRAIN['l.2.tangram'] = ({ rng, step }) => {
  const c = pick(rng, step === 1 ? COMPOSE.slice(0, 3) : COMPOSE);
  const curved = c.makes === 'circle';
  const pool = (curved ? STRAIGHT : CURVY).filter((x) => x !== c.makes);
  const wrong = shuffle(rng, pool).slice(0, choiceCount(step + 1) - 1);
  const shapeName = (sh: ShapeName) => (sh === 'rtriangle' ? 'triangles' : sh === 'semicircle' ? 'half circles' : `${sh}s`);
  return question('l.2.tangram', step, `Put these ${c.parts.length} ${shapeName(c.parts[0])} together. What shape can they make?`, 'What shape can they make?',
    { kind: 'pattern', items: c.parts.map((sh): OptContent => ({ kind: 'shape', shape: sh })) },
    [{ content: { kind: 'shape', shape: c.makes }, correct: true }, ...wrong.map((sh) => ({ content: { kind: 'shape', shape: sh } as OptContent, correct: false }))], rng,
    `Put these shapes together. What shape can they make? ${c.say}`);
};
