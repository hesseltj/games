import { pick, shuffle, type Rng } from '../../core/random';
import { ALPHABET, CHUNK_DISTRACTORS, CHUNK_WORDS, CVC, SPELL2, VOWELS } from '../content/words';

export interface TileQuestion {
  id: string;
  skillId: string;
  step: number;
  word: string;
  emoji: string;
  /** The answer, one tile per slot (letters or chunks like "sh"). */
  slots: string[];
  /** Tiles to choose from: the answer plus distractors, shuffled. */
  tiles: string[];
  /** Slots already filled in for the kid at easy steps. */
  given: number[];
  say: string;
}

let n = 0;

function letterDistractors(rng: Rng, word: string, count: number): string[] {
  // Mix of vowels (common mistakes) and other letters not in the word.
  const vowels = shuffle(rng, VOWELS.filter((v) => !word.includes(v))).slice(0, Math.ceil(count / 2));
  const rest = shuffle(rng, ALPHABET.filter((l) => !word.includes(l) && !vowels.includes(l))).slice(0, count - vowels.length);
  return [...vowels, ...rest];
}

export function tileQuestion(skillId: string, step: number, rng: Rng): TileQuestion {
  n += 1;
  if (skillId === 'r.2.digraphs' || skillId === 'r.2.vowels') {
    const pool = CHUNK_WORDS.filter((w) => w.pattern === (skillId === 'r.2.digraphs' ? 'digraph' : 'vowel'));
    const w = pick(rng, pool);
    const extra = shuffle(rng, CHUNK_DISTRACTORS.filter((c) => !w.chunks.includes(c))).slice(0, step + 1);
    const given = step === 1 ? w.chunks.map((c, i) => (c.length === 1 ? i : -1)).filter((i) => i >= 0).slice(0, 1) : [];
    return {
      id: `t${n}`, skillId, step, word: w.word, emoji: w.emoji, slots: w.chunks, given,
      tiles: shuffle(rng, [...w.chunks.filter((_, i) => !given.includes(i)), ...extra]),
      say: `Build the word ${w.word}.`,
    };
  }
  const pool = skillId === 's.2.spell' ? SPELL2 : CVC;
  const w = pick(rng, pool);
  const letters = w.word.split('');
  const extra = letterDistractors(rng, w.word, step === 1 ? 1 : step === 2 ? 3 : 5);
  // Kindergarten step 1: first letter given.
  const given = step === 1 && skillId !== 's.2.spell' ? [0] : [];
  const sayIt = skillId === 'r.k.cvc' ? `${w.word}. ${letters.join('... ')}. ${w.word}.` : `Spell ${w.word}.`;
  return {
    id: `t${n}`, skillId, step, word: w.word, emoji: w.emoji, slots: letters, given,
    tiles: shuffle(rng, [...letters.filter((_, i) => !given.includes(i)), ...extra]),
    say: sayIt,
  };
}
