import { pick, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, others, pickOne, question } from '../shared/build';
import type { ChoiceGen, ChoiceQuestion } from '../shared/types';
import {
  ANIMAL_SOUNDS, BODY_PARTS, HABITATS, LANDFORMS, LIFE_CYCLES, LIVING, MATTER, NEEDS, NONLIVING, POLLINATION, PULL, PUSH,
  SENSES, WEATHER, WEATHER_WEAR, type Item,
} from '../content/science';

/** Science Safari: picture questions. */
export const SCIENCE_SAFARI: Record<string, ChoiceGen> = {
  'sc.pk.animals': ({ rng, step }) => {
    const a = pick(rng, ANIMAL_SOUNDS);
    return question('sc.pk.animals', step, `Which animal says ${a.sound}?`, `Who says "${a.sound}"?`, { kind: 'none' },
      pickOne(a, others(rng, ANIMAL_SOUNDS, choiceCount(step) - 1, (x) => x === a), (x) => emo(x.emoji)), rng);
  },
  'sc.pk.senses': ({ rng, step }) => {
    const s = pick(rng, SENSES);
    return question('sc.pk.senses', step, `What do you use to ${s.verb}?`, `What do you ${s.verb} with?`, { kind: 'none' },
      pickOne(s, others(rng, SENSES, choiceCount(step) - 1, (x) => x === s), (x) => emo(x.emoji)), rng);
  },
  'sc.pk.weather': ({ rng, step }) => {
    const w = pick(rng, WEATHER);
    return question('sc.pk.weather', step, `Which picture shows ${w.name} weather?`, `Find ${w.name}!`, { kind: 'none' },
      pickOne(w, others(rng, WEATHER, choiceCount(step) - 1, (x) => x === w), (x) => emo(x.emoji)), rng);
  },
  'sc.pk.bodyparts': ({ rng, step }) => {
    const b = pick(rng, BODY_PARTS);
    return question('sc.pk.bodyparts', step, `Tap the ${b.name}!`, `Tap the ${b.name}!`, { kind: 'none' },
      pickOne(b, others(rng, BODY_PARTS, choiceCount(step) - 1, (x) => x === b), (x) => emo(x.emoji)), rng);
  },
  'sc.k.needs': ({ rng, step }) => {
    const n = pick(rng, NEEDS);
    const right = pick(rng, n.needs);
    return question('sc.k.needs', step, `What does ${n.who.name} need to live?`, `What does ${n.who.name} need?`, { kind: 'emoji', emoji: n.who.emoji },
      pickOne(right, shuffle(rng, n.notNeeds).slice(0, choiceCount(step) - 1), (x) => emo(x.emoji, x.name)), rng);
  },
  'sc.k.weather': ({ rng, step }) => {
    const w = pick(rng, WEATHER_WEAR);
    const right = pick(rng, w.wear);
    const wrong = shuffle(rng, WEATHER_WEAR.filter((x) => x !== w).flatMap((x) => x.wear)).slice(0, choiceCount(step) - 1);
    return question('sc.k.weather', step, `It is ${w.weather.name} outside. What should you wear?`, `It's ${w.weather.name}! Wear…`, { kind: 'emoji', emoji: w.weather.emoji },
      pickOne(right, wrong, (x) => emo(x.emoji, x.name)), rng);
  },
  'sc.2.lifecycle': ({ rng, step }) => {
    const c = pick(rng, LIFE_CYCLES);
    const i = Math.floor(rng() * (c.stages.length - 1));
    const right = c.stages[i + 1];
    const wrong = others(rng, c.stages, choiceCount(step) - 1, (x) => x === right);
    return question('sc.2.lifecycle', step, `In a ${c.name}'s life cycle, what comes after the ${c.stages[i].name}?`, `${c.name}: what comes next?`,
      { kind: 'pattern', items: c.stages.slice(0, i + 1).map((x) => emo(x.emoji, x.name)) },
      pickOne(right, wrong, (x) => emo(x.emoji, x.name)), rng);
  },
  'sc.2.earth': ({ rng, step }) => {
    const l = pick(rng, LANDFORMS);
    return question('sc.2.earth', step, `Which one is a ${l.name}?`, `Find the ${l.name}!`, { kind: 'none' },
      pickOne(l, others(rng, LANDFORMS, choiceCount(step) - 1, (x) => x === l), (x) => emo(x.emoji, step < 3 ? x.name : undefined)), rng);
  },
  'sc.2.pollinate': ({ rng, step }) => {
    const p = pick(rng, POLLINATION);
    return question('sc.2.pollinate', step, p.q, p.q, { kind: 'none' },
      pickOne(p.right, shuffle(rng, p.wrong).slice(0, choiceCount(step) - 1), (x) => emo(x.emoji, x.name)), rng);
  },
};

/** Sort It!: one thing at a time goes into the right bin. */
function sortQ(skillId: string, step: number, rng: Rng, item: Item, bins: { name: string; emoji: string; right: boolean }[], say: string): ChoiceQuestion {
  return question(skillId, step, say, 'Where does it go?', { kind: 'emoji', emoji: item.emoji, label: item.name },
    bins.map((b) => ({ content: emo(b.emoji, b.name), correct: b.right })), rng);
}

export const SORT_IT: Record<string, ChoiceGen> = {
  'sc.k.living': ({ rng, step }) => {
    const living = rng() < 0.5;
    const item = pick(rng, living ? LIVING : NONLIVING);
    return sortQ('sc.k.living', step, rng, item,
      [{ name: 'Living', emoji: '🌱', right: living }, { name: 'Not living', emoji: '🪨', right: !living }], `${item.name}. Is it living or not living?`);
  },
  'sc.k.pushpull': ({ rng, step }) => {
    const push = rng() < 0.5;
    const item = pick(rng, push ? PUSH : PULL);
    return sortQ('sc.k.pushpull', step, rng, item,
      [{ name: 'Push', emoji: '👐', right: push }, { name: 'Pull', emoji: '🤜', right: !push }], `${item.name}. Do you push it or pull it?`);
  },
  'sc.2.matter': ({ rng, step }) => {
    const states = (step === 1 ? ['solid', 'liquid'] : ['solid', 'liquid', 'gas']) as (keyof typeof MATTER)[];
    const state = pick(rng, states);
    const item = pick(rng, MATTER[state]);
    const icons = { solid: '🧱', liquid: '💧', gas: '💨' };
    return sortQ('sc.2.matter', step, rng, item,
      states.map((s) => ({ name: s[0].toUpperCase() + s.slice(1), emoji: icons[s], right: s === state })), `${item.name}. Is it a solid, a liquid, or a gas?`);
  },
  'sc.2.habitats': ({ rng, step }) => {
    const names = shuffle(rng, Object.keys(HABITATS)).slice(0, step === 1 ? 2 : step === 2 ? 3 : 4);
    const home = names[0];
    const item = pick(rng, HABITATS[home].animals);
    return sortQ('sc.2.habitats', step, rng, item,
      names.map((n) => ({ name: n[0].toUpperCase() + n.slice(1), emoji: HABITATS[n].emoji, right: n === home })), `Where does the ${item.name} live?`);
  },
};
