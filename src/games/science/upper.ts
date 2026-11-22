// Science for grades 1, 3, 4 and 5.
import { pick, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, pickOne, question } from '../shared/build';
import type { ChoiceGen, ChoiceQuestion } from '../shared/types';
import type { Item } from '../content/science';

const it = (emoji: string, name: string): Item => ({ emoji, name });

interface Fact { q: string; right: Item; wrong: Item[] }
function facts(skillId: string, list: Fact[]): ChoiceGen {
  return ({ rng, step }) => {
    const f = pick(rng, list);
    return question(skillId, step, f.q, f.q, { kind: 'none' },
      pickOne(f.right, shuffle(rng, f.wrong).slice(0, choiceCount(step) - 1), (x) => emo(x.emoji, x.name)), rng);
  };
}

interface Bin { name: string; emoji: string; items: Item[] }
function sorter(skillId: string, bins: Bin[], ask: (item: Item, names: string[]) => string, binsAtStep1 = bins.length): ChoiceGen {
  return ({ rng, step }) => {
    const use = step === 1 ? shuffle(rng, bins).slice(0, Math.min(binsAtStep1, bins.length)) : bins;
    const home = pick(rng, use);
    const item = pick(rng, home.items);
    return sortQ(skillId, step, rng, item, use.map((b) => ({ name: b.name, emoji: b.emoji, right: b === home })), ask(item, use.map((b) => b.name.toLowerCase())));
  };
}
function sortQ(skillId: string, step: number, rng: Rng, item: Item, bins: { name: string; emoji: string; right: boolean }[], say: string): ChoiceQuestion {
  return question(skillId, step, say, 'Where does it go?', { kind: 'emoji', emoji: item.emoji, label: item.name },
    bins.map((b) => ({ content: emo(b.emoji, b.name), correct: b.right })), rng);
}
const either = (names: string[]) => names.length === 2 ? `${names[0]} or ${names[1]}` : `${names.slice(0, -1).join(', ')}, or ${names[names.length - 1]}`;

export const SCIENCE_SAFARI_MORE: Record<string, ChoiceGen> = {
  'sc.1.babies': facts('sc.1.babies', [
    { q: 'Which baby grows up to be a chicken?', right: it('🐣', 'chick'), wrong: [it('🐛', 'caterpillar'), it('🐶', 'puppy'), it('🐟', 'fish')] },
    { q: 'Which baby grows up to be a frog?', right: it('〰️', 'tadpole'), wrong: [it('🐣', 'chick'), it('🐛', 'caterpillar'), it('🐱', 'kitten')] },
    { q: 'Which baby grows up to be a butterfly?', right: it('🐛', 'caterpillar'), wrong: [it('🐣', 'chick'), it('🐜', 'ant'), it('🐌', 'snail')] },
    { q: 'Which baby grows up to be a dog?', right: it('🐶', 'puppy'), wrong: [it('🐱', 'kitten'), it('🐣', 'chick'), it('🐰', 'bunny')] },
    { q: 'Where does a baby kangaroo ride?', right: it('👝', 'in a pouch'), wrong: [it('🌳', 'in a tree'), it('🏠', 'in a house'), it('🌊', 'in the water')] },
    { q: 'How are baby birds born?', right: it('🥚', 'they hatch from eggs'), wrong: [it('🌱', 'they grow from seeds'), it('☁️', 'they fall from clouds'), it('🐛', 'they start as caterpillars')] },
  ]),
  'sc.1.plantparts': facts('sc.1.plantparts', [
    { q: 'Which part of a plant drinks water from the soil?', right: it('🥕', 'roots'), wrong: [it('🌸', 'flower'), it('🍃', 'leaf'), it('🌰', 'seed')] },
    { q: 'Which part of a plant makes food from sunlight?', right: it('🍃', 'leaves'), wrong: [it('🥕', 'roots'), it('🌰', 'seed'), it('🌸', 'flower')] },
    { q: 'Which part of a plant holds it up tall?', right: it('🎋', 'stem'), wrong: [it('🌸', 'flower'), it('🥕', 'roots'), it('🌰', 'seed')] },
    { q: 'A new plant grows from a…', right: it('🌰', 'seed'), wrong: [it('🍃', 'leaf'), it('🪨', 'rock'), it('💧', 'raindrop')] },
    { q: 'Which part of a plant makes seeds?', right: it('🌸', 'flower'), wrong: [it('🥕', 'roots'), it('🎋', 'stem'), it('🍃', 'leaf')] },
  ]),
  'sc.3.weather': facts('sc.3.weather', [
    { q: 'Which tool measures temperature?', right: it('🌡️', 'thermometer'), wrong: [it('📏', 'ruler'), it('⚖️', 'scale'), it('🧭', 'compass')] },
    { q: 'Which place is cold all year long?', right: it('🧊', 'Antarctica'), wrong: [it('🏜️', 'Sahara Desert'), it('🌴', 'rainforest'), it('🏖️', 'tropical beach')] },
    { q: 'Which place gets rain almost every day and stays warm?', right: it('🌴', 'rainforest'), wrong: [it('🏜️', 'desert'), it('🧊', 'Arctic'), it('⛰️', 'mountain top')] },
    { q: 'What do we call weather over many, many years?', right: it('🌍', 'climate'), wrong: [it('🌈', 'rainbow'), it('📅', 'calendar'), it('⛈️', 'storm')] },
    { q: 'Which tool shows which way the wind blows?', right: it('🎏', 'wind sock'), wrong: [it('🌡️', 'thermometer'), it('🔭', 'telescope'), it('📏', 'ruler')] },
  ]),
  'sc.3.fossils': facts('sc.3.fossils', [
    { q: 'What is a fossil?', right: it('🦴', 'remains of an ancient living thing in rock'), wrong: [it('💎', 'a shiny jewel'), it('🧱', 'a kind of brick'), it('🥚', 'a fresh egg')] },
    { q: 'Which scientist studies fossils?', right: it('🦕', 'paleontologist'), wrong: [it('🔭', 'astronomer'), it('🌦️', 'meteorologist'), it('🩺', 'doctor')] },
    { q: 'A fossil of a fish was found on a mountain. What does that tell us?', right: it('🌊', 'water once covered that land'), wrong: [it('🐟', 'fish can climb'), it('🌋', 'the mountain is a volcano'), it('❄️', 'it was always cold there')] },
    { q: 'Where are most fossils found?', right: it('🪨', 'in layers of rock'), wrong: [it('☁️', 'in clouds'), it('🌊', 'floating in the ocean'), it('🌳', 'inside trees')] },
  ]),
  'sc.4.adaptations': facts('sc.4.adaptations', [
    { q: 'What helps a duck swim?', right: it('🦶', 'webbed feet'), wrong: [it('🦷', 'sharp teeth'), it('👂', 'big ears'), it('🦒', 'a long neck')] },
    { q: 'What helps a polar bear stay warm?', right: it('🧥', 'thick fur and fat'), wrong: [it('🦶', 'webbed feet'), it('🕶️', 'dark eyes'), it('🐍', 'scales')] },
    { q: 'What helps a giraffe eat leaves high in trees?', right: it('🦒', 'a long neck'), wrong: [it('🦶', 'webbed feet'), it('🐢', 'a hard shell'), it('🦇', 'wings')] },
    { q: 'What helps a cactus live in the desert?', right: it('🌵', 'it stores water'), wrong: [it('🍃', 'huge thin leaves'), it('🌊', 'it lives underwater'), it('❄️', 'it likes snow')] },
    { q: 'What helps a chameleon hide?', right: it('🎨', 'it changes color'), wrong: [it('📢', 'it is very loud'), it('🏃', 'it runs very fast'), it('🦒', 'it is very tall')] },
  ]),
  'sc.4.erosion': facts('sc.4.erosion', [
    { q: 'What slowly carved the Grand Canyon?', right: it('🏞️', 'a river'), wrong: [it('🌋', 'a volcano'), it('🦕', 'dinosaurs'), it('❄️', 'snowmen')] },
    { q: 'What is it called when wind or water carries soil away?', right: it('🌬️', 'erosion'), wrong: [it('🌋', 'eruption'), it('🌱', 'pollination'), it('🧊', 'freezing')] },
    { q: 'Which can stop soil from washing away on a hill?', right: it('🌳', 'planting trees and grass'), wrong: [it('🧹', 'sweeping it'), it('💡', 'turning on lights'), it('🚗', 'driving on it')] },
    { q: 'What makes a giant ice river that carves valleys?', right: it('🏔️', 'a glacier'), wrong: [it('🌧️', 'a raindrop'), it('🌵', 'a cactus'), it('🌈', 'a rainbow')] },
  ]),
  'sc.5.space': facts('sc.5.space', [
    { q: 'Which planet is closest to the Sun?', right: it('☿', 'Mercury'), wrong: [it('🌍', 'Earth'), it('🔴', 'Mars'), it('🪐', 'Saturn')] },
    { q: 'What causes day and night?', right: it('🌍', 'Earth spinning'), wrong: [it('☀️', 'the Sun turning off'), it('🌙', 'the Moon blocking the Sun'), it('☁️', 'clouds')] },
    { q: 'What is the Sun?', right: it('⭐', 'a star'), wrong: [it('🪐', 'a planet'), it('🌙', 'a moon'), it('☄️', 'a comet')] },
    { q: 'Which planet has big rings?', right: it('🪐', 'Saturn'), wrong: [it('🔴', 'Mars'), it('☿', 'Mercury'), it('🌍', 'Earth')] },
    { q: 'How long does Earth take to go around the Sun?', right: it('📅', 'one year'), wrong: [it('🕐', 'one day'), it('🌙', 'one month'), it('⏱️', 'one hour')] },
    { q: 'Which is the red planet?', right: it('🔴', 'Mars'), wrong: [it('🪐', 'Saturn'), it('🔵', 'Neptune'), it('🌍', 'Earth')] },
  ]),
  'sc.5.water': facts('sc.5.water', [
    { q: 'When the Sun heats water and it rises as vapor, that is called…', right: it('♨️', 'evaporation'), wrong: [it('☁️', 'condensation'), it('🌧️', 'precipitation'), it('🧊', 'freezing')] },
    { q: 'When water vapor cools and forms clouds, that is called…', right: it('☁️', 'condensation'), wrong: [it('♨️', 'evaporation'), it('🌧️', 'precipitation'), it('🔥', 'burning')] },
    { q: 'Rain, snow, sleet and hail are all kinds of…', right: it('🌧️', 'precipitation'), wrong: [it('♨️', 'evaporation'), it('☁️', 'condensation'), it('🌬️', 'erosion')] },
    { q: 'Where is most of Earth’s water?', right: it('🌊', 'the oceans'), wrong: [it('🏞️', 'rivers'), it('☁️', 'clouds'), it('🧊', 'ice cubes')] },
  ]),
};

export const SORT_IT_MORE: Record<string, ChoiceGen> = {
  'sc.1.light': sorter('sc.1.light', [
    { name: 'Makes light', emoji: '💡', items: [it('🔦', 'flashlight'), it('☀️', 'sun'), it('🕯️', 'candle'), it('🔥', 'campfire'), it('💡', 'light bulb'), it('🚦', 'traffic light')] },
    { name: 'No light', emoji: '🌑', items: [it('🪨', 'rock'), it('🧸', 'teddy bear'), it('📕', 'book'), it('🪑', 'chair'), it('🍎', 'apple'), it('🧦', 'sock')] },
  ], (i) => `Does a ${i.name} make its own light?`),
  'sc.1.sky': sorter('sc.1.sky', [
    { name: 'Day sky', emoji: '☀️', items: [it('☀️', 'the Sun'), it('🌈', 'a rainbow'), it('🦋', 'a butterfly'), it('🐝', 'a busy bee')] },
    { name: 'Night sky', emoji: '🌙', items: [it('⭐', 'stars'), it('🦉', 'an owl hunting'), it('🌌', 'the Milky Way'), it('🦇', 'a bat flying')] },
  ], (i) => `Would you usually see ${i.name} in the day sky or the night sky?`),
  'sc.3.magnets': sorter('sc.3.magnets', [
    { name: 'Sticks to a magnet', emoji: '🧲', items: [it('📎', 'paper clip'), it('🧷', 'safety pin'), it('🔩', 'steel bolt'), it('🧲', 'another magnet')] },
    { name: 'Does not stick', emoji: '🚫', items: [it('🪵', 'wood'), it('🧸', 'teddy bear'), it('🪙', 'penny'), it('📄', 'paper'), it('🥤', 'plastic cup'), it('🍎', 'apple')] },
  ], (i) => `Will a ${i.name} stick to a magnet?`),
  'sc.3.traits': sorter('sc.3.traits', [
    { name: 'Born with it', emoji: '🧬', items: [it('👁️', 'eye color'), it('👩‍🦱', 'curly hair'), it('🐆', 'a leopard’s spots'), it('🐦', 'a bird’s beak shape'), it('🌸', 'a flower’s color')] },
    { name: 'Learned it', emoji: '📚', items: [it('🚲', 'riding a bike'), it('📖', 'reading'), it('🏊', 'swimming'), it('🎹', 'playing piano'), it('🐕', 'a dog doing tricks')] },
  ], (i) => `${i.name}. Were you born with it, or did you learn it?`),
  'sc.4.energy': sorter('sc.4.energy', [
    { name: 'Light', emoji: '💡', items: [it('🔦', 'flashlight beam'), it('💡', 'glowing bulb'), it('🌟', 'starlight')] },
    { name: 'Sound', emoji: '🔊', items: [it('🔔', 'ringing bell'), it('🥁', 'drum beat'), it('🎺', 'trumpet note')] },
    { name: 'Motion', emoji: '💨', items: [it('🚗', 'moving car'), it('⚽', 'rolling ball'), it('🌬️', 'blowing wind')] },
  ], (i, names) => `A ${i.name}. Is that ${either(names)} energy?`, 2),
  'sc.4.conductors': sorter('sc.4.conductors', [
    { name: 'Lets electricity through', emoji: '⚡', items: [it('🪙', 'metal coin'), it('📎', 'metal paper clip'), it('🔑', 'metal key'), it('🥄', 'metal spoon')] },
    { name: 'Blocks electricity', emoji: '🛑', items: [it('🪵', 'wood'), it('🎈', 'rubber balloon'), it('🥤', 'plastic cup'), it('🧸', 'cloth toy'), it('📄', 'paper')] },
  ], (i) => `Does a ${i.name} let electricity through, or block it?`),
  'sc.5.changes': sorter('sc.5.changes', [
    { name: 'Physical change', emoji: '✂️', items: [it('🧊', 'ice melting'), it('✂️', 'cutting paper'), it('♨️', 'boiling water'), it('📄', 'tearing paper'), it('🧈', 'butter melting')] },
    { name: 'Chemical change', emoji: '🔥', items: [it('🔥', 'burning wood'), it('🎂', 'baking a cake'), it('🔩', 'iron rusting'), it('🍳', 'cooking an egg'), it('🍌', 'a banana rotting')] },
  ], (i) => `${i.name}. Is that a physical change or a chemical change?`),
  'sc.5.ecosystem': sorter('sc.5.ecosystem', [
    { name: 'Producer', emoji: '🌳', items: [it('🌳', 'oak tree'), it('🌻', 'sunflower'), it('🌾', 'grass'), it('🌿', 'seaweed')] },
    { name: 'Consumer', emoji: '🦊', items: [it('🐰', 'rabbit'), it('🦊', 'fox'), it('🐻', 'bear'), it('🦅', 'eagle')] },
    { name: 'Decomposer', emoji: '🍄', items: [it('🍄', 'mushroom'), it('🪱', 'earthworm'), it('🦠', 'bacteria')] },
  ], (i, names) => `In an ecosystem, is a ${i.name} a ${either(names)}?`, 2),
};
