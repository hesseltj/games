import { randInt, shuffle, type Rng } from '../../core/random';
import type { ChoiceOption, ChoiceQuestion, Display, OptContent } from './types';

let counter = 0;

export function question(
  skillId: string, step: number, say: string, prompt: string, display: Display,
  options: Omit<ChoiceOption, 'id'>[], rng: Rng, repeat?: string,
): ChoiceQuestion {
  counter += 1;
  return {
    id: `${skillId}-${counter}`, skillId, step, say, prompt, display, repeat,
    options: shuffle(rng, options).map((o, i) => ({ ...o, id: `${counter}-${i}` })),
  };
}

/** One correct answer plus distractors, as options. */
export function pickOne<T>(correct: T, wrong: T[], toContent: (v: T) => OptContent) {
  return [{ content: toContent(correct), correct: true }, ...wrong.map((w) => ({ content: toContent(w), correct: false }))];
}

/** `n` random items from `pool` that aren't `exclude`. */
export function others<T>(rng: Rng, pool: readonly T[], n: number, exclude: (v: T) => boolean): T[] {
  return shuffle(rng, pool.filter((v) => !exclude(v))).slice(0, n);
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

/** 2 choices at step 1, 3 at step 2, 4 at step 3 (or a custom base). */
export const choiceCount = (step: number, base = 3) => (step >= 3 ? base + 1 : step === 1 ? base - 1 : base);

export const emo = (emoji: string, label?: string): OptContent => ({ kind: 'emoji', emoji, label });
export const txt = (text: string): OptContent => ({ kind: 'text', text });
