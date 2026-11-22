import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { choiceCount, numberChoices, others, question, txt } from '../shared/build';
import type { ChoiceGen, OptContent } from '../shared/types';
import { COIN_INFO } from '../../ui/MathArt';

const CUSTOMERS = ['👧', '👦', '👵', '👴', '🧑', '👩', '👨', '🧒'];
const TREATS = [{ emoji: '🧁', name: 'cupcakes' }, { emoji: '🍩', name: 'donuts' }, { emoji: '🍪', name: 'cookies' }, { emoji: '🥐', name: 'croissants' }];
const BREADS = [{ emoji: '🥖', name: 'bread' }, { emoji: '🍫', name: 'chocolate bar' }, { emoji: '🥕', name: 'carrot' }, { emoji: '✏️', name: 'pencil' }];

const cents = (n: number) => `${n}¢`;
const sum = (c: number[]) => c.reduce((a, b) => a + b, 0);

function makeCoins(rng: Rng, kinds: number[], maxTotal: number, minCount = 2, maxCount = 7): number[] {
  for (let tries = 0; tries < 200; tries++) {
    const n = randInt(rng, minCount, maxCount);
    const coins = Array.from({ length: n }, () => pick(rng, kinds)).sort((a, b) => b - a);
    if (sum(coins) <= maxTotal) return coins;
  }
  return [1, 1];
}

function timeText(h: number, m: number) {
  return `${h}:${String(m).padStart(2, '0')}`;
}

export const BAKE_SHOP: Record<string, ChoiceGen> = {
  'm.pk.count5': ({ rng, step }) => {
    const t = pick(rng, TREATS);
    const n = randInt(rng, 1, 5);
    const counts = numberChoices(rng, n, step === 1 ? 2 : choiceCount(step), 1, 6, step === 1 ? 4 : 2);
    return question('m.pk.count5', step, `I would like ${n} ${n === 1 ? t.name.slice(0, -1) : t.name}, please! Which box has ${n}?`, `Which box has ${n}?`,
      { kind: 'order', emoji: pick(rng, CUSTOMERS), text: `${n} ${t.emoji}, please!` },
      counts.map((c) => ({ content: { kind: 'group', emoji: t.emoji, count: c } as OptContent, correct: c === n })), rng);
  },

  'm.k.coins': ({ rng, step }) => {
    const values = [1, 5, 10, 25];
    const v = pick(rng, values);
    const byValue = step >= 2 && rng() < 0.5;
    const wrong = others(rng, values, choiceCount(step) - 1, (x) => x === v);
    const say = byValue ? `Which coin is worth ${v} ${v === 1 ? 'cent' : 'cents'}?` : `Find the ${COIN_INFO[v].name}!`;
    // At step 1 the value is printed on the coins; that's the hint. Later we hide it by asking by name/value either way.
    return question('m.k.coins', step, say, byValue ? `Worth ${cents(v)}?` : `Find the ${COIN_INFO[v].name}!`, { kind: 'none' },
      [v, ...wrong].map((x) => ({ content: { kind: 'coins', coins: [x] } as OptContent, correct: x === v })), rng);
  },

  'm.1.place100': ({ rng, step }) => {
    const t = pick(rng, TREATS);
    const tens = randInt(rng, 1, step === 1 ? 4 : 9);
    const ones = randInt(rng, step === 1 ? 0 : 1, 9);
    const n = tens * 10 + ones;
    const opts = [...new Set([n, ones * 10 + tens, tens + ones, tens * 10, n + 10])].filter((x) => x > 0).slice(0, choiceCount(step));
    if (!opts.includes(n)) opts[0] = n;
    return question('m.1.place100', step, `Each box holds 10 ${t.name}. How many ${t.name} are there?`, `Each 📦 holds 10. How many?`,
      { kind: 'text', text: `${'📦'.repeat(tens)} ${t.emoji.repeat(ones)}` },
      opts.map((x) => ({ content: { kind: 'number', n: x } as OptContent, correct: x === n })), rng);
  },

  'm.2.money': ({ rng, step }) => {
    const kinds = step === 1 ? [1, 5] : step === 2 ? [1, 5, 10] : [1, 5, 10, 25];
    const coins = makeCoins(rng, kinds, step === 1 ? 25 : 99, 2, step === 1 ? 5 : 7);
    const total = sum(coins);
    const near = numberChoices(rng, total, choiceCount(step), Math.max(1, total - 15), total + 15, 6);
    // A common mistake: counting coins instead of their value.
    if (!near.includes(coins.length) && coins.length !== total && near.length > 1) near[near.length - 1] = coins.length;
    return question('m.2.money', step, 'How much money is this? Count the coins!', 'How much money?', { kind: 'coins', coins },
      [...new Set(near)].map((x) => ({ content: txt(cents(x)), correct: x === total })), rng);
  },

  'm.2.time': ({ rng, step }) => {
    const h = randInt(rng, 1, 12);
    const m = step === 1 ? 0 : step === 2 ? pick(rng, [0, 15, 30, 45]) : randInt(rng, 0, 11) * 5;
    const wrong = new Set<string>();
    const swapH = m === 0 ? 12 : Math.max(1, Math.round(m / 5));
    wrong.add(timeText(swapH, ((h % 12) * 5) % 60)); // reading the hands backwards
    wrong.add(timeText(h === 12 ? 1 : h + 1, m)); // reading the hour hand one ahead
    wrong.add(timeText(h, (m + 30) % 60));
    wrong.add(timeText(h === 1 ? 12 : h - 1, (m + 15) % 60));
    const right = timeText(h, m);
    const opts = shuffle(rng, [...wrong].filter((x) => x !== right)).slice(0, choiceCount(step) - 1);
    return question('m.2.time', step, 'The cookies are ready! What time does the clock show?', 'What time is it?', { kind: 'clock', h, m },
      [{ content: txt(right), correct: true }, ...opts.map((x) => ({ content: txt(x), correct: false }))], rng);
  },

  'm.2.measure': ({ rng, step }) => {
    const b = pick(rng, BREADS);
    const start = step === 1 ? 0 : randInt(rng, 1, 3);
    const length = randInt(rng, 2, 10 - start - (step === 1 ? 0 : 1));
    const end = start + length;
    const pool = [length, end, length + 1, length - 1].filter((x) => x > 0);
    const opts = [...new Set(pool)].slice(0, choiceCount(step));
    return question('m.2.measure', step, `How many inches long is the ${b.name}?`, `How long is it? (inches)`, { kind: 'ruler', start, length, emoji: b.emoji },
      opts.map((x) => ({ content: { kind: 'number', n: x } as OptContent, correct: x === length })), rng);
  },
};
