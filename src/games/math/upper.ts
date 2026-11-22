// Math for grades 1, 3, 4 and 5 (Number Pop and Bake Shop).
import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { choiceCount, numberChoices, question, txt } from '../shared/build';
import type { ChoiceGen, OptContent, ShapeName } from '../shared/types';

const num = (n: number): OptContent => ({ kind: 'number', n });
const opts = (rng: Rng, right: number, wrong: number[], count: number) => {
  // Pad with nearby numbers so there are always enough wrong answers.
  const pool = [...new Set(wrong.map((x) => Math.round(x)))].filter((x) => x !== right && x >= 0);
  for (let k = 1; pool.length < count - 1; k++) if (!pool.includes(right + k)) pool.push(right + k);
  const w = shuffle(rng, pool).slice(0, count - 1);
  return [{ content: num(right), correct: true }, ...w.map((x) => ({ content: num(x), correct: false }))];
};
const textOpts = (rng: Rng, right: string, wrong: string[], count: number) => {
  const w = shuffle(rng, [...new Set(wrong)].filter((x) => x !== right)).slice(0, count - 1);
  return [{ content: txt(right), correct: true }, ...w.map((x) => ({ content: txt(x), correct: false }))];
};
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const frac = (n: number, d: number) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const dec = (x: number) => String(Math.round(x * 100) / 100);
const timeText = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

export const NUMBER_POP_MORE: Record<string, ChoiceGen> = {
  // ---------- Grade 1 ----------
  'm.1.compare100': ({ rng, step }) => {
    const a = randInt(rng, 10, 99);
    let b = step === 3 ? Number(String(a).split('').reverse().join('')) : randInt(rng, 10, 99);
    if (b === a || b < 10) b = a + (a < 90 ? randInt(rng, 1, 9) : -randInt(rng, 1, 9));
    const nums = step === 3 ? [a, b, numberChoices(rng, a, 3, 10, 99, 15).find((x) => x !== a && x !== b) ?? a + 11] : [a, b];
    const smaller = step >= 2 && rng() < 0.5;
    const target = smaller ? Math.min(...nums) : Math.max(...nums);
    const word = smaller ? 'smaller' : 'bigger';
    return question('m.1.compare100', step, `Pop the ${word} number!`, `Pop the ${word} number!`, { kind: 'none' },
      [...new Set(nums)].map((n) => ({ content: num(n), correct: n === target })), rng);
  },
  'm.1.add10s': ({ rng, step }) => {
    const sub = step >= 2 && rng() < 0.5;
    const a = step === 3 ? randInt(rng, 2, 8) * 10 + randInt(rng, 1, 9) : randInt(rng, 1, 8) * 10;
    const b = randInt(rng, 1, sub ? Math.floor(a / 10) : 9 - Math.floor(a / 10)) * 10;
    const ans = sub ? a - b : a + b;
    const sign = sub ? '−' : '+';
    return question('m.1.add10s', step, `What is ${a} ${sub ? 'minus' : 'plus'} ${b}?`, `${a} ${sign} ${b} = ?`, { kind: 'text', text: `${a} ${sign} ${b} = ?` },
      opts(rng, ans, [ans + 10, ans - 10, ans + 1, ans - 1, a], choiceCount(step)), rng);
  },
  'm.1.missing': ({ rng, step }) => {
    const sub = step >= 2 && rng() < 0.5;
    const c = randInt(rng, 6, step === 1 ? 10 : 20);
    const a = randInt(rng, 1, c - 1);
    const b = c - a;
    const text = sub ? `${c} − ? = ${a}` : `${a} + ? = ${c}`;
    return question('m.1.missing', step, sub ? `${c} minus what equals ${a}?` : `${a} plus what equals ${c}?`, text, { kind: 'text', text },
      opts(rng, b, [c, b + 1, b - 1, a + c], choiceCount(step)), rng);
  },
  'm.1.shapes': ({ rng, step }) => {
    const facts: { q: string; right: ShapeName; wrong: ShapeName[] }[] = [
      { q: 'Which shape has 3 sides?', right: 'triangle', wrong: ['square', 'circle', 'hexagon'] },
      { q: 'Which shape has 4 sides that are all the same length?', right: 'square', wrong: ['rectangle', 'triangle', 'trapezoid'] },
      { q: 'Which shape has 6 sides?', right: 'hexagon', wrong: ['square', 'triangle', 'trapezoid'] },
      { q: 'Which shape has no corners?', right: 'circle', wrong: ['square', 'triangle', 'diamond'] },
      { q: 'Which shape has 4 sides, with 2 long and 2 short?', right: 'rectangle', wrong: ['square', 'triangle', 'hexagon'] },
    ];
    const f = pick(rng, facts);
    return question('m.1.shapes', step, f.q, f.q, { kind: 'none' },
      [{ content: { kind: 'shape', shape: f.right } as OptContent, correct: true }, ...shuffle(rng, f.wrong).slice(0, choiceCount(step) - 1).map((s) => ({ content: { kind: 'shape', shape: s } as OptContent, correct: false }))], rng);
  },

  // ---------- Grade 3 ----------
  'm.3.divide': ({ rng, step }) => {
    const pool = step === 1 ? [2, 5, 10] : step === 2 ? [3, 4, 6] : [6, 7, 8, 9];
    const b = pick(rng, pool), ans = randInt(rng, 1, 10), a = b * ans;
    return question('m.3.divide', step, `What is ${a} divided by ${b}?`, `${a} ÷ ${b} = ?`, { kind: 'text', text: `${a} ÷ ${b} = ?` },
      opts(rng, ans, [ans + 1, ans - 1, b, a - b, ans + 2], choiceCount(step)), rng);
  },
  'm.3.fractions': ({ rng, step }) => {
    const d = pick(rng, step === 1 ? [2, 3, 4] : [3, 4, 5, 6, 8]);
    const n = randInt(rng, 1, d - 1);
    const pie = step === 3;
    return question('m.3.fractions', step, 'What fraction is shaded?', 'What fraction is shaded?', { kind: 'fraction', n, d, pie },
      textOpts(rng, `${n}/${d}`, [`${d}/${n}`, `${d - n}/${d}`, `${n}/${d + 1}`, `${n + 1}/${d}`].filter((x) => !x.startsWith('0')), choiceCount(step)), rng);
  },
  'm.3.round': ({ rng, step }) => {
    const hundreds = step === 3;
    const n = hundreds ? randInt(rng, 101, 989) : randInt(rng, 11, 99);
    const unit = hundreds ? 100 : 10;
    const ans = Math.round(n / unit) * unit;
    const down = Math.floor(n / unit) * unit, up = down + unit;
    return question('m.3.round', step, `Round ${n} to the nearest ${unit === 10 ? 'ten' : 'hundred'}.`, `Round ${n} to the nearest ${unit}`, { kind: 'text', text: String(n) },
      opts(rng, ans, [down, up, n, ans + unit], choiceCount(step)), rng);
  },
  'm.3.area': ({ rng, step }) => {
    const rows = randInt(rng, 2, step === 1 ? 4 : 6), cols = randInt(rng, 2, step === 1 ? 5 : 8);
    const ans = rows * cols;
    return question('m.3.area', step, `How many squares cover this rectangle? That is its area.`, `Area = ? squares`, { kind: 'grid', rows, cols },
      opts(rng, ans, [rows + cols, 2 * (rows + cols), ans + rows, ans - cols], choiceCount(step)), rng);
  },
  'm.3.add1000': ({ rng, step }) => {
    const sub = step >= 2 && rng() < 0.5;
    let a = randInt(rng, 120, 800), b = randInt(rng, 100, 999 - a);
    if (sub) { a = randInt(rng, 300, 999); b = randInt(rng, 100, a - 50); }
    const ans = sub ? a - b : a + b;
    const sign = sub ? '−' : '+';
    return question('m.3.add1000', step, `What is ${a} ${sub ? 'minus' : 'plus'} ${b}?`, `${a} ${sign} ${b} = ?`, { kind: 'text', text: `${a} ${sign} ${b} = ?` },
      opts(rng, ans, [ans + 100, ans - 100, ans + 10, ans - 10], choiceCount(step)), rng);
  },

  // ---------- Grade 4 ----------
  'm.4.multiply': ({ rng, step }) => {
    const a = step === 3 ? randInt(rng, 11, 25) : randInt(rng, 12, 99), b = step === 3 ? randInt(rng, 11, 19) : randInt(rng, 2, step === 1 ? 5 : 9);
    const ans = a * b;
    return question('m.4.multiply', step, `What is ${a} times ${b}?`, `${a} × ${b} = ?`, { kind: 'text', text: `${a} × ${b} = ?` },
      opts(rng, ans, [ans + 10, ans - 10, ans + b, ans - a, a + b], choiceCount(step)), rng);
  },
  'm.4.divrem': ({ rng, step }) => {
    const b = randInt(rng, 3, step === 1 ? 5 : 9), q = randInt(rng, 2, 9), r = randInt(rng, 1, b - 1);
    const a = b * q + r;
    const right = `${q} R${r}`;
    return question('m.4.divrem', step, `What is ${a} divided by ${b}? Don't forget the remainder.`, `${a} ÷ ${b} = ?`, { kind: 'text', text: `${a} ÷ ${b} = ?` },
      textOpts(rng, right, [`${q + 1} R${r}`, `${q} R${(r + 1) % b || b - 1}`, `${q - 1} R${r + b}`, `${q} R0`], choiceCount(step)), rng);
  },
  'm.4.equivfrac': ({ rng, step }) => {
    const d = pick(rng, [2, 3, 4, 5]), n = randInt(rng, 1, d - 1), k = randInt(rng, 2, step === 1 ? 2 : 4);
    const ans = n * k;
    return question('m.4.equivfrac', step, `${n} over ${d} is the same as what over ${d * k}?`, `${n}/${d} = ?/${d * k}`, { kind: 'text', text: `${n}/${d} = ?/${d * k}` },
      opts(rng, ans, [n + k, n * d, ans + 1, d * k - ans], choiceCount(step)), rng);
  },
  'm.4.decimals': ({ rng, step }) => {
    if (step === 1) {
      const n = randInt(rng, 1, 9);
      return question('m.4.decimals', step, `How do you write ${n} tenths as a decimal?`, `${n}/10 = ?`, { kind: 'text', text: `${n}/10` },
        textOpts(rng, `0.${n}`, [`${n}.0`, `0.0${n}`, `${n}.10`], choiceCount(step)), rng);
    }
    const a = randInt(rng, 1, 9) / 10, b = randInt(rng, 11, 99) / 100;
    const nums = [a, b, step === 3 ? randInt(rng, 101, 199) / 1000 : (randInt(rng, 1, 9) / 10 + 0.05)].map((x) => Math.round(x * 1000) / 1000);
    const uniq = [...new Set(nums)];
    const target = Math.max(...uniq);
    return question('m.4.decimals', step, 'Which number is the biggest?', 'Pop the biggest!', { kind: 'none' },
      uniq.map((x) => ({ content: txt(String(x)), correct: x === target })), rng);
  },
  'm.4.factors': ({ rng, step }) => {
    const n = pick(rng, [12, 16, 18, 20, 24, 30, 36, 40, 42, 48]);
    const factors = Array.from({ length: n }, (_, i) => i + 1).filter((f) => n % f === 0 && f > 1 && f < n);
    const right = pick(rng, factors);
    const non = Array.from({ length: 12 }, (_, i) => i + 2).filter((x) => n % x !== 0);
    return question('m.4.factors', step, `Which number is a factor of ${n}? It divides ${n} evenly.`, `A factor of ${n}?`, { kind: 'text', text: String(n) },
      opts(rng, right, non, choiceCount(step)), rng);
  },

  // ---------- Grade 5 ----------
  'm.5.fracadd': ({ rng, step }) => {
    const d1 = pick(rng, [2, 3, 4, 5, 6, 8]);
    const d2 = step === 1 ? d1 : pick(rng, [2, 4, 8].includes(d1) ? [2, 4, 8].filter((x) => x !== d1) : [d1 * 2]);
    const L = (d1 * d2) / gcd(d1, d2);
    const n1 = randInt(rng, 1, d1 - 1), n2 = randInt(rng, 1, d2 - 1);
    const sub = step === 3 && n1 / d1 > n2 / d2;
    const top = sub ? n1 * (L / d1) - n2 * (L / d2) : n1 * (L / d1) + n2 * (L / d2);
    const right = top % L === 0 ? String(top / L) : frac(top, L);
    const sign = sub ? '−' : '+';
    return question('m.5.fracadd', step, `What is ${n1}/${d1} ${sub ? 'minus' : 'plus'} ${n2}/${d2}?`, `${n1}/${d1} ${sign} ${n2}/${d2} = ?`, { kind: 'text', text: `${n1}/${d1} ${sign} ${n2}/${d2}` },
      textOpts(rng, right, [`${sub ? Math.abs(n1 - n2) : n1 + n2}/${d1 + d2}`, `${sub ? Math.abs(n1 - n2) : n1 + n2}/${L}`, frac(top + 1, L), `${top}/${L * 2}`].filter((x) => !x.startsWith('0/')), choiceCount(step)), rng);
  },
  'm.5.decimalops': ({ rng, step }) => {
    const a = randInt(rng, 10, 99) / 10 + (step === 3 ? randInt(rng, 1, 9) / 100 : 0), b = randInt(rng, 5, 50) / (step === 1 ? 10 : 100);
    const sub = step >= 2 && rng() < 0.5 && a > b;
    const ans = sub ? a - b : a + b;
    const sign = sub ? '−' : '+';
    return question('m.5.decimalops', step, `What is ${dec(a)} ${sub ? 'minus' : 'plus'} ${dec(b)}?`, `${dec(a)} ${sign} ${dec(b)} = ?`, { kind: 'text', text: `${dec(a)} ${sign} ${dec(b)} = ?` },
      textOpts(rng, dec(ans), [dec(ans + 1), dec(ans - 0.1), dec(ans + 0.01), dec(sub ? a + b : Math.abs(a - b))], choiceCount(step)), rng);
  },
  'm.5.volume': ({ rng, step }) => {
    const l = randInt(rng, 2, 6), w = randInt(rng, 2, 5), h = randInt(rng, 2, step === 1 ? 3 : 6);
    const ans = l * w * h;
    return question('m.5.volume', step, `A box is ${l} cubes long, ${w} cubes wide and ${h} cubes tall. How many cubes fill it?`, `Volume of ${l} × ${w} × ${h}?`, { kind: 'text', text: `📦 ${l} × ${w} × ${h}` },
      opts(rng, ans, [l + w + h, l * w, ans + l * w, 2 * (l * w + w * h + l * h)], choiceCount(step)), rng);
  },
  'm.5.order': ({ rng, step }) => {
    const a = randInt(rng, 2, 9), b = randInt(rng, 2, 9), c = randInt(rng, 2, Math.min(9, b - 1 > 1 ? b - 1 : 2));
    const forms = [
      { t: `${a} + ${b} × ${c}`, v: a + b * c, wrong: (a + b) * c },
      { t: `${a} × ${b} − ${c}`, v: a * b - c, wrong: a * (b - c) },
      { t: `(${a} + ${b}) × ${c}`, v: (a + b) * c, wrong: a + b * c },
      { t: `${a * c} ÷ ${c} + ${b}`, v: a + b, wrong: (a * c) / (c + b) },
    ];
    const f = pick(rng, step === 1 ? forms.slice(0, 2) : forms);
    return question('m.5.order', step, `Remember the order of operations. What is ${f.t.replace('×', 'times').replace('÷', 'divided by').replace('−', 'minus').replace('+', 'plus')}?`, `${f.t} = ?`, { kind: 'text', text: `${f.t} = ?` },
      opts(rng, f.v, [Math.round(f.wrong), f.v + 1, f.v - 2, f.v + a], choiceCount(step)), rng);
  },
  'm.5.fracof': ({ rng, step }) => {
    const d = pick(rng, [2, 3, 4, 5, 6]), n = step === 1 ? 1 : randInt(rng, 1, d - 1), k = randInt(rng, 2, 8);
    const whole = d * k, ans = n * k;
    return question('m.5.fracof', step, `What is ${n}/${d} of ${whole}?`, `${n}/${d} of ${whole} = ?`, { kind: 'text', text: `${n}/${d} × ${whole}` },
      opts(rng, ans, [k, whole - ans, ans + n, Math.floor(whole / n)], choiceCount(step)), rng);
  },
};

export const BAKE_SHOP_MORE: Record<string, ChoiceGen> = {
  'm.1.time': ({ rng, step }) => {
    const h = randInt(rng, 1, 12), m = step === 1 ? 0 : pick(rng, [0, 30]);
    const right = timeText(h, m);
    return question('m.1.time', step, 'The bread is ready! What time does the clock say?', 'What time is it?', { kind: 'clock', h, m },
      textOpts(rng, right, [timeText(h === 12 ? 1 : h + 1, m), timeText(h, m === 0 ? 30 : 0), timeText(m === 30 ? 6 : 12, (h * 5) % 60)], choiceCount(step)), rng);
  },
  'm.1.coins': ({ rng, step }) => {
    const dimes = randInt(rng, 1, step === 1 ? 3 : 6), pennies = randInt(rng, 0, step === 1 ? 4 : 9);
    const coins = [...Array(dimes).fill(10), ...Array(pennies).fill(1)];
    const total = dimes * 10 + pennies;
    return question('m.1.coins', step, 'Count by tens for the dimes, then by ones for the pennies. How much money?', 'How much money?', { kind: 'coins', coins },
      textOpts(rng, `${total}¢`, [`${dimes + pennies}¢`, `${total + 10}¢`, `${pennies * 10 + dimes}¢`, `${total - 1}¢`], choiceCount(step)), rng);
  },
  'm.3.time': ({ rng, step }) => {
    const h = randInt(rng, 1, 12), m = step === 1 ? randInt(rng, 0, 11) * 5 : randInt(rng, 0, 59);
    const right = timeText(h, m);
    const hourHand = h % 12 === 0 ? 1 : (h % 12) + 1;
    return question('m.3.time', step, 'What time does the clock say? Count the little marks for the minutes.', 'What time is it?', { kind: 'clock', h, m },
      textOpts(rng, right, [timeText(h, (m + 5) % 60), timeText(h, (m + 55) % 60), timeText(hourHand, m), timeText(h, (60 - m) % 60)], choiceCount(step)), rng);
  },
  'm.3.elapsed': ({ rng, step }) => {
    const h = randInt(rng, 1, 10), m = pick(rng, [0, 15, 30]);
    const bake = pick(rng, step === 1 ? [30, 60] : [15, 20, 25, 40, 45, 50, 75, 90]);
    const endTotal = h * 60 + m + bake;
    const eh = Math.floor(endTotal / 60), em = endTotal % 60;
    const right = timeText(((eh - 1) % 12) + 1, em);
    return question('m.3.elapsed', step, `The cookies go in the oven at ${timeText(h, m)}. They bake for ${bake} minutes. When are they done?`, `In at ${timeText(h, m)}, bake ${bake} min. Done at?`,
      { kind: 'clock', h, m },
      textOpts(rng, right, [timeText(h, (m + bake) % 60), timeText(((eh) % 12) + 1, em), timeText(((eh - 1) % 12) + 1, (em + 10) % 60), timeText(h + 1, m)], choiceCount(step)), rng);
  },
  'm.4.change': ({ rng, step }) => {
    const paid = pick(rng, step === 1 ? [100, 500] : [500, 1000, 2000]);
    const cost = randInt(rng, 1, paid / 25 - 1) * 25 - (step === 3 ? randInt(rng, 1, 4) * 5 : 0);
    const change = paid - cost;
    return question('m.4.change', step, `A cake costs ${money(cost)}. You pay with ${money(paid)}. How much change do you get?`, `Cost ${money(cost)}, paid ${money(paid)}. Change?`, { kind: 'order', emoji: '🎂', text: `${money(cost)}` },
      textOpts(rng, money(change), [money(change + 100), money(Math.abs(change - 50)), money(cost), money(change + 25)], choiceCount(step)), rng);
  },
  'm.5.money': ({ rng, step }) => {
    const price = randInt(rng, 3, 12) * 25 + (step === 3 ? randInt(rng, 1, 4) * 5 : 0), qty = randInt(rng, 2, step === 1 ? 3 : 6);
    const total = price * qty;
    return question('m.5.money', step, `Muffins cost ${money(price)} each. How much do ${qty} muffins cost?`, `${qty} muffins at ${money(price)}?`, { kind: 'order', emoji: '🧁', text: `${qty} × ${money(price)}` },
      textOpts(rng, money(total), [money(total + price), money(total - price), money(price + qty * 100), money(total + 100)], choiceCount(step)), rng);
  },
};
