import { pick, randInt, shuffle, type Rng } from '../../core/random';

export type ShapeName = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart' | 'oval' | 'diamond';

export type BubbleContent =
  | { kind: 'number'; n: number; dots?: boolean }
  | { kind: 'text'; text: string }
  | { kind: 'color'; name: string; hex: string }
  | { kind: 'shape'; shape: ShapeName }
  | { kind: 'emoji'; emoji: string }
  | { kind: 'group'; emoji: string; count: number };

export interface BubbleOption {
  id: string;
  content: BubbleContent;
  correct: boolean;
}

export type Display =
  | { kind: 'none' }
  | { kind: 'text'; text: string }
  | { kind: 'objects'; emoji: string; count: number; faded?: number; frame?: boolean }
  | { kind: 'sum'; emoji: string; a: number; b: number }
  | { kind: 'tenFrame'; filled: number };

export interface Question {
  id: string;
  skillId: string;
  step: number;
  /** Spoken aloud. */
  say: string;
  /** Short text instruction shown above the play area (for readers and parents). */
  prompt: string;
  display: Display;
  options: BubbleOption[];
}

export interface GenContext {
  rng: Rng;
  step: number;
  /** Theme emoji used for counting objects. */
  objects: string[];
}

let qCounter = 0;
function q(skillId: string, step: number, say: string, prompt: string, display: Display, options: Omit<BubbleOption, 'id'>[], rng: Rng): Question {
  qCounter += 1;
  return {
    id: `${skillId}-${qCounter}`,
    skillId,
    step,
    say,
    prompt,
    display,
    options: shuffle(rng, options).map((o, i) => ({ ...o, id: `${qCounter}-${i}` })),
  };
}

/** `count` distinct numbers including `answer`, all within [min, max], preferring nearby values. */
export function numberChoices(rng: Rng, answer: number, count: number, min: number, max: number, spread = 3): number[] {
  const out = new Set<number>([answer]);
  let tries = 0;
  while (out.size < count && tries < 200) {
    tries += 1;
    const width = tries > 50 ? max - min : spread;
    const n = answer + randInt(rng, -width, width);
    if (n >= min && n <= max) out.add(n);
  }
  for (let n = min; out.size < count && n <= max; n++) out.add(n);
  return [...out];
}

function numberOptions(rng: Rng, answer: number, count: number, min: number, max: number, dots = false, spread = 3) {
  return numberChoices(rng, answer, count, min, max, spread).map((n) => ({
    content: { kind: 'number', n, dots } as BubbleContent,
    correct: n === answer,
  }));
}

const optionCount = (step: number, base = 3) => (step >= 3 ? base + 1 : base);

const COLORS = [
  { name: 'red', hex: '#ef4444' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'yellow', hex: '#facc15' },
  { name: 'green', hex: '#22c55e' },
  { name: 'orange', hex: '#fb923c' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'pink', hex: '#f472b6' },
  { name: 'brown', hex: '#92400e' },
];

const SHAPES_BY_STEP: ShapeName[][] = [
  ['circle', 'square', 'triangle'],
  ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart'],
  ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'oval', 'diamond'],
];

const SOLIDS = [
  { name: 'cube', hint: 'like a block', emoji: '🎲' },
  { name: 'sphere', hint: 'like a ball', emoji: '🌍' },
  { name: 'cone', hint: 'like an ice cream cone', emoji: '🍦' },
  { name: 'cylinder', hint: 'like a can', emoji: '🥫' },
];

type Gen = (ctx: GenContext) => Question;

export const GENERATORS: Record<string, Gen> = {
  'm.pk.colors': ({ rng, step }) => {
    const n = step === 1 ? 2 : optionCount(step);
    const palette = step === 1 ? COLORS.slice(0, 4) : COLORS;
    const choices = shuffle(rng, palette).slice(0, n);
    const target = choices[0];
    return q('m.pk.colors', step, `Pop the ${target.name} bubble!`, `Pop the ${target.name} bubble!`, { kind: 'none' },
      choices.map((c) => ({ content: { kind: 'color', name: c.name, hex: c.hex }, correct: c === target })), rng);
  },

  'm.pk.shapes': ({ rng, step }) => {
    const pool = SHAPES_BY_STEP[step - 1] ?? SHAPES_BY_STEP[2];
    const n = step === 1 ? 2 : optionCount(step);
    const choices = shuffle(rng, pool).slice(0, n);
    const target = choices[0];
    return q('m.pk.shapes', step, `Pop the ${target}!`, `Pop the ${target}!`, { kind: 'none' },
      choices.map((c) => ({ content: { kind: 'shape', shape: c }, correct: c === target })), rng);
  },

  'm.pk.count5': ({ rng, step, objects }) => {
    const max = step === 1 ? 3 : 5;
    const n = randInt(rng, 1, max);
    const emoji = pick(rng, objects);
    return q('m.pk.count5', step, `How many? Count them, then pop the number!`, 'How many?',
      { kind: 'objects', emoji, count: n }, numberOptions(rng, n, step === 1 ? 2 : optionCount(step), 1, 5, step < 3), rng);
  },

  'm.pk.count10': ({ rng, step, objects }) => {
    const n = randInt(rng, step === 1 ? 3 : 1, step === 1 ? 7 : 10);
    const emoji = pick(rng, objects);
    return q('m.pk.count10', step, `How many? Count them, then pop the number!`, 'How many?',
      { kind: 'objects', emoji, count: n }, numberOptions(rng, n, optionCount(step), 1, 10, step === 1), rng);
  },

  'm.pk.moreless': ({ rng, step, objects }) => {
    const minGap = step === 1 ? 3 : 1;
    const max = step === 3 ? 8 : 6;
    let a = 0, b = 0;
    while (Math.abs(a - b) < minGap) { a = randInt(rng, 1, max); b = randInt(rng, 1, max); }
    const fewer = step === 3 && rng() < 0.5;
    const emoji = pick(rng, objects);
    const word = fewer ? 'fewer' : 'more';
    const target = fewer ? Math.min(a, b) : Math.max(a, b);
    return q('m.pk.moreless', step, `Pop the bubble with ${word}!`, `Which has ${word}?`, { kind: 'none' },
      [a, b].map((c) => ({ content: { kind: 'group', emoji, count: c }, correct: c === target })), rng);
  },

  'm.k.count20': ({ rng, step, objects }) => {
    const n = randInt(rng, step === 1 ? 8 : 10, step === 1 ? 14 : 20);
    return q('m.k.count20', step, 'How many? Count them, then pop the number!', 'How many?',
      { kind: 'objects', emoji: pick(rng, objects), count: n, frame: true },
      numberOptions(rng, n, optionCount(step), 1, 20, false, step === 3 ? 1 : 3), rng);
  },

  'm.k.numrec': ({ rng, step }) => {
    const max = step === 1 ? 10 : 20;
    const n = randInt(rng, 0, max);
    let opts = numberOptions(rng, n, optionCount(step), 0, max);
    if (step === 3 && n >= 12 && n <= 19 && n % 11 !== 0) {
      // Reversal confuser: 13 vs 31.
      const rev = Number(String(n).split('').reverse().join(''));
      opts = [...opts.filter((o) => o.correct || (o.content as { n: number }).n !== rev).slice(0, optionCount(step) - 1),
        { content: { kind: 'number', n: rev }, correct: false }];
    }
    return q('m.k.numrec', step, `Pop the number ${n}!`, step === 1 ? `Pop the ${n}!` : 'Listen! 🔊', { kind: 'none' }, opts, rng);
  },

  'm.k.compare': ({ rng, step }) => {
    const max = step === 1 ? 10 : 20;
    const n = step === 3 ? 3 : 2;
    const nums = numberChoices(rng, randInt(rng, 0, max), n, 0, max, 6);
    const smaller = step >= 2 && rng() < 0.5;
    const target = smaller ? Math.min(...nums) : Math.max(...nums);
    const word = smaller ? 'smaller' : 'bigger';
    return q('m.k.compare', step, `Pop the ${word} number!`, `Pop the ${word} number!`, { kind: 'none' },
      nums.map((v) => ({ content: { kind: 'number', n: v }, correct: v === target })), rng);
  },

  'm.k.add5': ({ rng, step, objects }) => {
    const a = randInt(rng, step === 1 ? 1 : 0, 4);
    const b = randInt(rng, step === 1 ? 1 : 0, 5 - a);
    const display: Display = step === 1 ? { kind: 'sum', emoji: pick(rng, objects), a, b } : { kind: 'text', text: `${a} + ${b} = ?` };
    return q('m.k.add5', step, `What is ${a} plus ${b}?`, `${a} + ${b} = ?`, display, numberOptions(rng, a + b, optionCount(step), 0, 6), rng);
  },

  'm.k.sub5': ({ rng, step, objects }) => {
    const a = randInt(rng, 2, 5);
    const b = randInt(rng, 1, a);
    const display: Display = step === 1 ? { kind: 'objects', emoji: pick(rng, objects), count: a, faded: b } : { kind: 'text', text: `${a} − ${b} = ?` };
    const say = step === 1 ? `${a} take away ${b}. How many are left?` : `What is ${a} minus ${b}?`;
    return q('m.k.sub5', step, say, `${a} − ${b} = ?`, display, numberOptions(rng, a - b, optionCount(step), 0, 5), rng);
  },

  'm.k.make10': ({ rng, step }) => {
    const a = randInt(rng, 1, 9);
    const display: Display = step === 1 ? { kind: 'tenFrame', filled: a } : { kind: 'text', text: `${a} + ? = 10` };
    return q('m.k.make10', step, `${a} and what make 10?`, `${a} + ? = 10`, display, numberOptions(rng, 10 - a, optionCount(step), 0, 10), rng);
  },

  'm.k.shapes3d': ({ rng, step }) => {
    const choices = shuffle(rng, SOLIDS).slice(0, step === 1 ? 3 : 4);
    const t = choices[0];
    return q('m.k.shapes3d', step, step === 1 ? `Pop the ${t.name}, ${t.hint}!` : `Pop the ${t.name}!`, `Pop the ${t.name}!`, { kind: 'none' },
      choices.map((c) => ({ content: { kind: 'emoji', emoji: c.emoji }, correct: c === t })), rng);
  },

  'm.1.add20': (ctx) => addSub(ctx, 'm.1.add20', ctx.step === 1 ? 10 : 20, ctx.step >= 2),

  'm.1.place100': ({ rng, step }) => {
    const tens = randInt(rng, 1, 9);
    const ones = randInt(rng, 0, 9);
    const n = tens * 10 + ones;
    if (step === 1) {
      return q('m.1.place100', step, `How many tens are in ${n}?`, `How many tens in ${n}?`, { kind: 'text', text: `${n}` },
        numberOptions(rng, tens, 3, 0, 9), rng);
    }
    return q('m.1.place100', step, `Which number has ${tens} tens and ${ones} ones?`, `${tens} tens and ${ones} ones`, { kind: 'none' },
      [...new Set([n, ones * 10 + tens, n + 10 > 99 ? n - 10 : n + 10, tens * 10 + ((ones + 1) % 10)])].slice(0, optionCount(step))
        .map((v) => ({ content: { kind: 'number', n: v }, correct: v === n })), rng);
  },

  'm.2.add20': (ctx) => addSub(ctx, 'm.2.add20', 20, ctx.step >= 2),

  'm.2.add100': ({ rng, step }) => {
    let a: number, b: number, op: '+' | '−';
    if (step === 1) { a = randInt(rng, 1, 8) * 10 + randInt(rng, 0, 5); b = randInt(rng, 1, 9 - (a % 10)); op = '+'; }
    else if (step === 2) {
      a = randInt(rng, 1, 6) * 10 + randInt(rng, 0, 5);
      b = randInt(rng, 1, 8 - Math.floor(a / 10)) * 10 + randInt(rng, 0, 9 - (a % 10));
      op = '+';
    } else {
      op = rng() < 0.5 ? '+' : '−';
      if (op === '+') { a = randInt(rng, 15, 60); b = randInt(rng, 15, 99 - a); }
      else { a = randInt(rng, 30, 99); b = randInt(rng, 10, a - 5); }
    }
    const ans = op === '+' ? a + b : a - b;
    const say = `What is ${a} ${op === '+' ? 'plus' : 'minus'} ${b}?`;
    return q('m.2.add100', step, say, `${a} ${op} ${b} = ?`, { kind: 'text', text: `${a} ${op} ${b} = ?` },
      numberOptions(rng, ans, optionCount(step), 0, 100, false, 11).map((o) => o), rng);
  },

  'm.2.place1000': ({ rng, step }) => {
    // Three different non-zero digits so every option is distinct.
    const [h, t, o] = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    const n = h * 100 + t * 10 + o;
    if (step === 1) {
      const opts = [...new Set([n, o * 100 + t * 10 + h, t * 100 + h * 10 + o, h * 100 + o * 10 + t])].slice(0, 3);
      return q('m.2.place1000', step, `Which number has ${h} hundreds, ${t} tens, and ${o} ones?`, `${h} hundreds, ${t} tens, ${o} ones`, { kind: 'none' },
        opts.map((v) => ({ content: { kind: 'number', n: v }, correct: v === n })), rng);
    }
    if (step === 2) {
      const place = pick(rng, [0, 1, 2]);
      const digit = [h, t, o][place];
      const value = digit * [100, 10, 1][place];
      const opts = [...new Set([digit, digit * 10, digit * 100])];
      const label = String(n);
      return q('m.2.place1000', step, `In ${n}, what is the ${digit} worth?`, `What is the ${digit} worth in ${label}?`, { kind: 'text', text: label },
        opts.map((v) => ({ content: { kind: 'number', n: v }, correct: v === value })), rng);
    }
    const delta = pick(rng, [10, 100]);
    const more = rng() < 0.5 || n - delta < 0;
    const ans = more ? n + delta : n - delta;
    const word = more ? 'more' : 'less';
    const opts = [...new Set([ans, more ? n + (110 - delta) : n - (110 - delta), n + (more ? 1 : -1), more ? n - delta : n + delta])].filter((v) => v >= 0).slice(0, 4);
    return q('m.2.place1000', step, `What is ${delta} ${word} than ${n}?`, `${delta} ${word} than ${n}?`, { kind: 'text', text: `${n}` },
      opts.map((v) => ({ content: { kind: 'number', n: v }, correct: v === ans })), rng);
  },

  'm.2.skip': ({ rng, step }) => {
    const by = step === 1 ? 10 : step === 2 ? pick(rng, [2, 5]) : pick(rng, [5, 10, 100]);
    const startMult = randInt(rng, 0, 6);
    const start = step === 3 && by !== 100 ? startMult * by + pick(rng, [0, by === 10 ? 3 : 0]) : startMult * by;
    const seq = [0, 1, 2].map((i) => start + i * by);
    const ans = start + 3 * by;
    const opts = [...new Set([ans, ans + by, ans - 1, ans + 1, start + 2 * by + 1])].slice(0, optionCount(step));
    return q('m.2.skip', step, `Count by ${by}s. What comes next?`, `Count by ${by}s`, { kind: 'text', text: `${seq.join(', ')}, __` },
      opts.map((v) => ({ content: { kind: 'number', n: v }, correct: v === ans })), rng);
  },

  'm.2.evenodd': ({ rng, step }) => {
    const max = step === 1 ? 20 : 100;
    const even = rng() < 0.5;
    const target = randInt(rng, 1, max / 2) * 2 - (even ? 0 : 1);
    const others = new Set<number>();
    while (others.size < 2) {
      const v = randInt(rng, 1, max / 2) * 2 - (even ? 1 : 0);
      if (v > 0) others.add(v);
    }
    const word = even ? 'even' : 'odd';
    return q('m.2.evenodd', step, `Pop the ${word} number!`, `Pop the ${word} number!`, { kind: 'none' },
      [target, ...others].map((v) => ({ content: { kind: 'number', n: v }, correct: v === target })), rng);
  },

  'm.3.times': ({ rng, step }) => {
    const pool = step === 1 ? [2, 5, 10] : step === 2 ? [3, 4] : [6, 7, 8, 9];
    const a = pick(rng, pool), b = randInt(rng, 1, 10);
    const ans = a * b;
    const opts = [...new Set([ans, ans + a, ans - a, a + b, ans + 1])].filter((v) => v >= 0).slice(0, optionCount(step));
    return q('m.3.times', step, `What is ${a} times ${b}?`, `${a} × ${b} = ?`, { kind: 'text', text: `${a} × ${b} = ?` },
      opts.map((v) => ({ content: { kind: 'number', n: v }, correct: v === ans })), rng);
  },
};

function addSub({ rng, step }: GenContext, skillId: string, max: number, allowSub: boolean): Question {
  const sub = allowSub && rng() < 0.5;
  let a: number, b: number;
  if (sub) { a = randInt(rng, 2, max); b = randInt(rng, 1, a); }
  else { a = randInt(rng, 0, max - 1); b = randInt(rng, 1, max - a); }
  const ans = sub ? a - b : a + b;
  const op = sub ? '−' : '+';
  return q(skillId, step, `What is ${a} ${sub ? 'minus' : 'plus'} ${b}?`, `${a} ${op} ${b} = ?`, { kind: 'text', text: `${a} ${op} ${b} = ?` },
    numberOptions(rng, ans, optionCount(step), 0, max), rng);
}

export function generateQuestion(skillId: string, ctx: GenContext): Question {
  const gen = GENERATORS[skillId];
  if (!gen) throw new Error(`No Number Pop generator for ${skillId}`);
  return gen(ctx);
}
