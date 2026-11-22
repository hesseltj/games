// Fraction Pizza: tap slices to put toppings on the right number of them.
import { pick, randInt, type Rng } from '../../core/random';

export interface PizzaQuestion { id: string; skillId: string; step: number; slices: number; need: number; say: string; prompt: string; hint: string }

let n = 0;
const word: Record<number, string> = { 2: 'half', 3: 'third', 4: 'fourth', 6: 'sixth', 8: 'eighth', 12: 'twelfth' };

export function pizzaQuestion(skillId: string, step: number, rng: Rng): PizzaQuestion {
  n += 1;
  const q = (slices: number, need: number, say: string, prompt: string, hint: string): PizzaQuestion => ({ id: `p${n}`, skillId, step, slices, need, say, prompt, hint });
  switch (skillId) {
    case 'm.pk.pizza': { const k = randInt(rng, 1, step === 1 ? 2 : 4); return q(4, k, `Put pepperoni on ${k} ${k === 1 ? 'slice' : 'slices'}!`, `Pepperoni on ${k} ${k === 1 ? 'slice' : 'slices'}!`, `Count to ${k}.`); }
    case 'm.k.pizza': { const k = randInt(rng, 2, step === 1 ? 5 : 8); return q(8, k, `Put pepperoni on ${k} slices!`, `Pepperoni on ${k} slices!`, `Count to ${k}.`); }
    case 'm.1.pizza': { const d = pick(rng, [2, 4]); const k = d === 2 ? 1 : randInt(rng, 1, 3); return q(d, k, d === 2 ? 'Cut in halves. Put cheese on one half!' : `Put cheese on ${k} ${k === 1 ? 'fourth' : 'fourths'}!`, d === 2 ? 'Cheese on 1 half' : `Cheese on ${k}/4`, `The pizza has ${d} equal parts.`); }
    case 'm.2.pizza': { const d = pick(rng, [2, 3, 4]); const k = randInt(rng, 1, d - 1); return q(d, k, `Cover ${k} ${word[d]}${k > 1 ? 's' : ''} of the pizza.`, `Cover ${k}/${d}`, `${d} equal parts. Cover ${k}.`); }
    case 'm.3.pizza': { const d = pick(rng, [3, 4, 6, 8]); const k = randInt(rng, 1, d - 1); return q(d, k, `Cover ${k} over ${d} of the pizza.`, `Cover ${k}/${d}`, `The bottom number is how many slices. The top is how many to cover.`); }
    case 'm.4.pizza': {
      const [num, den, slices] = pick(rng, [[1, 2, 8], [1, 2, 6], [1, 3, 6], [2, 3, 6], [1, 4, 8], [3, 4, 8], [1, 2, 4], [1, 3, 12], [3, 4, 12]]);
      const k = (num * slices) / den;
      return q(slices, k, `This pizza has ${slices} slices. Cover ${num} over ${den} of it.`, `Cover ${num}/${den} of ${slices} slices`, `${num}/${den} is the same as ${k}/${slices}.`);
    }
    default: {
      const [num, den, slices] = pick(rng, [[2, 3, 12], [3, 4, 12], [5, 6, 12], [3, 8, 8], [5, 8, 8], [2, 5, 10], [3, 5, 10], [7, 10, 10]]);
      const k = (num * slices) / den;
      return q(slices, k, `Cover ${num} over ${den} of a pizza with ${slices} slices.`, `${num}/${den} of ${slices} slices`, `Find 1/${den} first: ${slices / den} slices.`);
    }
  }
}
