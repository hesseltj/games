// Number Line Hop: tap the right spot on a number line.
import { pick, randInt, type Rng } from '../../core/random';

export interface LineQuestion {
  id: string; skillId: string; step: number;
  /** Ticks 0..ticks; value of tick i is label(i). */
  ticks: number;
  labels: string[];
  /** Which tick labels are printed (others are blank). */
  shown: boolean[];
  target: number; // tick index
  start?: number; // tick index the frog starts on
  say: string; prompt: string;
}

let n = 0;
const range = (k: number) => Array.from({ length: k + 1 }, (_, i) => i);
const mixed = (whole: number, num: number, den: number) => (num === 0 ? `${whole}` : whole === 0 ? `${num}/${den}` : `${whole} ${num}/${den}`);

/** A random tick that isn't printed on the line (so the kid has to estimate), if there is one. */
function unlabeled(rng: Rng, shown: boolean[], from = 1): number {
  const options = shown.map((s, i) => (s || i < from || i === shown.length - 1 ? -1 : i)).filter((i) => i >= 0);
  return options.length ? pick(rng, options) : randInt(rng, from, shown.length - 2);
}

export function lineQuestion(skillId: string, step: number, rng: Rng): LineQuestion {
  n += 1;
  const q = (ticks: number, labels: string[], shown: boolean[], target: number, say: string, prompt: string, start?: number): LineQuestion =>
    ({ id: `l${n}`, skillId, step, ticks, labels, shown, target, start, say, prompt });
  switch (skillId) {
    case 'm.pk.line': {
      const t = randInt(rng, 1, 5);
      return q(5, range(5).map(String), range(5).map(() => true), t, `Hop to the number ${t}!`, `Hop to ${t}!`);
    }
    case 'm.k.line': {
      const shown = range(10).map((i) => step === 1 || i % 2 === 0);
      const t = step === 1 ? randInt(rng, 1, 10) : unlabeled(rng, shown);
      return q(10, range(10).map(String), shown, t, `Hop to the number ${t}!`, `Hop to ${t}!`);
    }
    case 'm.1.line': {
      const start = randInt(rng, 0, 12), hop = randInt(rng, 1, 8), back = step >= 2 && rng() < 0.5 && start >= hop;
      const t = back ? start - hop : Math.min(20, start + hop);
      return q(20, range(20).map(String), range(20).map((i) => i % (step === 3 ? 5 : 1) === 0), t,
        `Start at ${start}. Hop ${back ? 'back' : 'forward'} ${back ? hop : t - start}. Where do you land?`, `${start} ${back ? '−' : '+'} ${back ? hop : t - start} = ?`, start);
    }
    case 'm.2.line': {
      const by = step === 1 ? 10 : 5;
      const ticks = 100 / by;
      const shown = range(ticks).map((i) => (i * by) % (step === 3 ? 50 : 20) === 0);
      const t = unlabeled(rng, shown);
      return q(ticks, range(ticks).map((i) => String(i * by)), shown, t, `Hop to ${t * by}!`, `Hop to ${t * by}!`);
    }
    case 'm.3.line': {
      const d = pick(rng, step === 1 ? [2, 4] : [3, 4, 6, 8]);
      const t = randInt(rng, 1, d - 1);
      return q(d, range(d).map((i) => (i === 0 ? '0' : i === d ? '1' : `${i}/${d}`)), range(d).map((i) => i === 0 || i === d || step === 1), t,
        `Hop to ${t} over ${d}.`, `Hop to ${t}/${d}!`);
    }
    case 'm.4.line': {
      const shown = range(10).map((i) => i === 0 || i === 10 || (step === 1 && i === 5));
      const t = unlabeled(rng, shown);
      return q(10, range(10).map((i) => (i === 10 ? '1' : i === 0 ? '0' : `0.${i}`)), shown, t,
        `Hop to zero point ${t}.`, `Hop to 0.${t}!`);
    }
    default: { // m.5.line: mixed numbers from 0 to 3
      const d = pick(rng, step === 1 ? [2] : [2, 3, 4]);
      const ticks = 3 * d;
      const shown = range(ticks).map((i) => i % d === 0);
      const t = unlabeled(rng, shown);
      const label = (i: number) => mixed(Math.floor(i / d), i % d, d);
      return q(ticks, range(ticks).map(label), shown, t, `Hop to ${label(t).replace('/', ' over ')}.`, `Hop to ${label(t)}!`);
    }
  }
}
