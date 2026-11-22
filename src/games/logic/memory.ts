import { shuffle, type Rng } from '../../core/random';

export const PAIRS_BY_SKILL: Record<string, number[]> = {
  'l.pk.match': [2, 3, 3],
  'l.k.memory': [4, 5, 6],
  'l.2.memory': [6, 7, 8],
};

const EXTRA = ['🍎', '🚗', '🌟', '🐳', '🍩', '🎈', '🌈', '🦄', '🐢', '🚀', '🍉', '🎸'];

export interface MemoryBoard { skillId: string; step: number; cards: string[] }

export function makeBoard(skillId: string, step: number, objects: string[], rng: Rng): MemoryBoard {
  const pairs = (PAIRS_BY_SKILL[skillId] ?? [3, 4, 6])[Math.min(step, 3) - 1];
  const faces = shuffle(rng, [...new Set([...objects, ...EXTRA])]).slice(0, pairs);
  return { skillId, step, cards: shuffle(rng, [...faces, ...faces]) };
}

/**
 * A "memory slip" is flipping a card whose partner you've already seen, then picking a different card.
 * A pair counts as first-try when there was no slip since the last pair was found.
 */
export function isSlip(seen: Set<number>, cards: string[], first: number, second: number): boolean {
  if (cards[first] === cards[second]) return false;
  const partner = cards.findIndex((c, i) => i !== first && c === cards[first]);
  return seen.has(partner);
}
