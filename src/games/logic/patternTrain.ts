import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, numberChoices, others, pickOne, question } from '../shared/build';
import type { ChoiceGen, OptContent } from '../shared/types';
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
