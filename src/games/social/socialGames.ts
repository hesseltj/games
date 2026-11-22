// World (social studies) for Pre-K through 5th grade. Earns 🧭 Compass Shards.
import { pick, randInt, shuffle, type Rng } from '../../core/random';
import { choiceCount, emo, pickOne, question, txt } from '../shared/build';
import type { ChoiceGen, ChoiceQuestion } from '../shared/types';
import type { Item } from '../content/science';

const it = (emoji: string, name: string): Item => ({ emoji, name });
interface Fact { q: string; right: Item | string; wrong: (Item | string)[] }

/** Picture or text facts. Strings become text answers. */
function facts(skillId: string, list: Fact[], showLabels = true): ChoiceGen {
  return ({ rng, step }) => {
    const f = pick(rng, list);
    const toC = (x: Item | string) => (typeof x === 'string' ? txt(x) : emo(x.emoji, showLabels || step < 3 ? x.name : undefined));
    return question(skillId, step, f.q, f.q, { kind: 'none' }, pickOne(f.right, shuffle(rng, f.wrong).slice(0, choiceCount(step) - 1), toC), rng);
  };
}

interface Bin { name: string; emoji: string; items: Item[] }
function sorter(skillId: string, bins: Bin[], ask: (i: Item) => string): ChoiceGen {
  return ({ rng, step }) => {
    const home = pick(rng, bins);
    const item = pick(rng, home.items);
    return question(skillId, step, ask(item), 'Where does it go?', { kind: 'emoji', emoji: item.emoji, label: item.name },
      bins.map((b) => ({ content: emo(b.emoji, b.name), correct: b === home })), rng);
  };
}

// ---------- Helpers & Me ----------
const HELPERS = [
  { emoji: '👩‍🚒', name: 'firefighter', does: 'puts out fires', tool: it('🧯', 'fire hose') },
  { emoji: '🧑‍⚕️', name: 'doctor', does: 'helps you when you are sick', tool: it('🩺', 'stethoscope') },
  { emoji: '👮', name: 'police officer', does: 'helps keep people safe', tool: it('🚓', 'police car') },
  { emoji: '🧑‍🏫', name: 'teacher', does: 'helps you learn', tool: it('📚', 'books') },
  { emoji: '🧑‍🌾', name: 'farmer', does: 'grows our food', tool: it('🚜', 'tractor') },
  { emoji: '🧑‍🍳', name: 'chef', does: 'cooks meals', tool: it('🍳', 'frying pan') },
  { emoji: '📮', name: 'mail carrier', does: 'brings letters and packages', tool: it('✉️', 'letters') },
  { emoji: '🧑‍🔧', name: 'mechanic', does: 'fixes cars', tool: it('🔧', 'wrench') },
  { emoji: '🦷', name: 'dentist', does: 'takes care of your teeth', tool: it('🪥', 'toothbrush') },
  { emoji: '🧑‍✈️', name: 'pilot', does: 'flies airplanes', tool: it('✈️', 'airplane') },
];
const FEELINGS = [it('😀', 'happy'), it('😢', 'sad'), it('😠', 'angry'), it('😨', 'scared'), it('😲', 'surprised'), it('😴', 'sleepy')];
const FEELING_STORIES: { story: string; feel: string }[] = [
  { story: 'Mia got a puppy for her birthday.', feel: 'happy' }, { story: 'Leo dropped his ice cream on the ground.', feel: 'sad' },
  { story: 'Someone knocked down Sam’s block tower on purpose.', feel: 'angry' }, { story: 'There was a loud thunderstorm in the night.', feel: 'scared' },
  { story: 'A friend jumped out and yelled “Boo!” at a party.', feel: 'surprised' }, { story: 'It was very late and Ava had played all day.', feel: 'sleepy' },
];

export const HELPERS_GAME: Record<string, ChoiceGen> = {
  'ss.pk.helpers': ({ rng, step }) => {
    const h = pick(rng, HELPERS);
    const wrong = shuffle(rng, HELPERS.filter((x) => x !== h)).slice(0, choiceCount(step) - 1);
    return question('ss.pk.helpers', step, `Who ${h.does}?`, `Who ${h.does}?`, { kind: 'none' },
      pickOne(h, wrong, (x) => emo(x.emoji, x.name)), rng);
  },
  'ss.pk.feelings': ({ rng, step }) => {
    const s = pick(rng, FEELING_STORIES);
    const right = FEELINGS.find((f) => f.name === s.feel)!;
    return question('ss.pk.feelings', step, `${s.story} How do you think they feel?`, 'How do they feel?', { kind: 'text', text: s.story },
      pickOne(right, shuffle(rng, FEELINGS.filter((f) => f !== right)).slice(0, choiceCount(step) - 1), (x) => emo(x.emoji, x.name)), rng);
  },
  'ss.k.tools': ({ rng, step }) => {
    const h = pick(rng, HELPERS);
    const wrong = shuffle(rng, HELPERS.filter((x) => x !== h)).slice(0, choiceCount(step) - 1);
    return question('ss.k.tools', step, `Who uses a ${h.tool.name}?`, `Who uses this?`, { kind: 'emoji', emoji: h.tool.emoji, label: h.tool.name },
      pickOne(h, wrong, (x) => emo(x.emoji, x.name)), rng);
  },
  'ss.1.rules': facts('ss.1.rules', [
    { q: 'What should you do before crossing the street?', right: it('👀', 'stop and look both ways'), wrong: [it('🏃', 'run fast'), it('🙈', 'close your eyes'), it('📱', 'play a game')] },
    { q: 'Why do we have rules at school?', right: it('🛡️', 'to keep everyone safe and fair'), wrong: [it('😠', 'to make kids sad'), it('🍬', 'to get candy'), it('🎮', 'so we can play all day')] },
    { q: 'What should you do if you want a turn on the swing?', right: it('🙋', 'wait and ask nicely'), wrong: [it('🤚', 'push someone off'), it('😭', 'cry loudly'), it('🙉', 'ignore everyone')] },
    { q: 'What do you wear to stay safe on a bike?', right: it('⛑️', 'a helmet'), wrong: [it('🎩', 'a top hat'), it('🩴', 'flip-flops'), it('🕶️', 'sunglasses only')] },
    { q: 'What number do you call in an emergency in the U.S.?', right: '911', wrong: ['411', '123', '000'] },
    { q: 'Someone is being left out at recess. What can you do?', right: it('🤝', 'invite them to play'), wrong: [it('🙈', 'pretend not to see'), it('😂', 'laugh at them'), it('🏃', 'run away')] },
  ]),
};

// ---------- Map Explorer ----------
const PLACES = ['🏫', '🏠', '🌳', '🏥', '⛲', '🏪', '🚒', '🏰'];
const PLACE_NAMES: Record<string, string> = { '🏫': 'school', '🏠': 'house', '🌳': 'tree', '🏥': 'hospital', '⛲': 'fountain', '🏪': 'store', '🚒': 'fire station', '🏰': 'castle' };

function compassQ(skillId: string, rng: Rng, step: number, withDiagonal: boolean): ChoiceQuestion {
  const size = 3;
  const center = { x: 1, y: 1 };
  const placesEmoji = shuffle(rng, PLACES);
  const dirs: [string, number, number][] = [['north', 0, -1], ['south', 0, 1], ['east', 1, 0], ['west', -1, 0]];
  if (withDiagonal) dirs.push(['northeast', 1, -1], ['southwest', -1, 1], ['northwest', -1, -1], ['southeast', 1, 1]);
  const used = shuffle(rng, dirs).slice(0, step === 1 ? 2 : 4);
  const cells = [{ x: center.x, y: center.y, emoji: placesEmoji[0] }, ...used.map(([, dx, dy], i) => ({ x: center.x + dx, y: center.y + dy, emoji: placesEmoji[i + 1] }))];
  const ask = randInt(rng, 0, used.length - 1);
  const [dir] = used[ask];
  const right = placesEmoji[ask + 1];
  const wrong = used.map((_, i) => placesEmoji[i + 1]).filter((e) => e !== right).slice(0, choiceCount(step) - 1);
  const c = placesEmoji[0];
  return question(skillId, step, `Look at the map. North is up. What is ${dir} of the ${PLACE_NAMES[c]}?`, `What is ${dir} of the ${c}?`, { kind: 'map', size, cells },
    pickOne(right, wrong, (e) => emo(e, PLACE_NAMES[e])), rng);
}

export const MAP_EXPLORER: Record<string, ChoiceGen> = {
  'ss.k.position': ({ rng, step }) => {
    // Next to / above / below on a small map, no compass words yet.
    const size = 3;
    const e = shuffle(rng, PLACES);
    const rels: [string, number, number][] = [['above', 0, -1], ['below', 0, 1], ['to the left of', -1, 0], ['to the right of', 1, 0]];
    const used = shuffle(rng, rels).slice(0, step === 1 ? 2 : 3);
    const cells = [{ x: 1, y: 1, emoji: e[0] }, ...used.map(([, dx, dy], i) => ({ x: 1 + dx, y: 1 + dy, emoji: e[i + 1] }))];
    const k = randInt(rng, 0, used.length - 1);
    const right = e[k + 1];
    const wrong = used.map((_, i) => e[i + 1]).filter((x) => x !== right);
    return question('ss.k.position', step, `What is ${used[k][0]} the ${PLACE_NAMES[e[0]]}?`, `What is ${used[k][0]} the ${e[0]}?`, { kind: 'map', size, cells },
      pickOne(right, wrong, (x) => emo(x, PLACE_NAMES[x])), rng);
  },
  'ss.1.mapsymbols': facts('ss.1.mapsymbols', [
    { q: 'On a map, blue usually means…', right: it('🌊', 'water'), wrong: [it('🌳', 'forest'), it('🏜️', 'desert'), it('🏙️', 'city')] },
    { q: 'What part of a map tells you what the symbols mean?', right: it('🔑', 'the map key'), wrong: [it('🧭', 'the compass'), it('📏', 'the ruler'), it('🖍️', 'the crayon')] },
    { q: 'A globe is a model of…', right: it('🌍', 'Earth'), wrong: [it('🌙', 'the Moon'), it('☀️', 'the Sun'), it('🏀', 'a ball game')] },
    { q: 'What does a map show?', right: it('🗺️', 'where places are'), wrong: [it('🕐', 'what time it is'), it('🌡️', 'how hot it is'), it('🎵', 'a song')] },
    { q: 'Which is the biggest?', right: it('🌎', 'Earth'), wrong: [it('🇺🇸', 'a country'), it('🏙️', 'a city'), it('🏠', 'a house')] },
  ]),
  'ss.2.compass': ({ rng, step }) => compassQ('ss.2.compass', rng, step, false),
  'ss.3.compass': ({ rng, step }) => compassQ('ss.3.compass', rng, step, true),
  'ss.2.continents': facts('ss.2.continents', [
    { q: 'Which continent is covered in ice and has penguins?', right: 'Antarctica', wrong: ['Africa', 'Asia', 'Europe'] },
    { q: 'Which continent do we live on in the United States?', right: 'North America', wrong: ['South America', 'Australia', 'Africa'] },
    { q: 'Which is the biggest ocean?', right: 'Pacific Ocean', wrong: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'] },
    { q: 'Which continent has kangaroos and koalas?', right: 'Australia', wrong: ['Europe', 'North America', 'Antarctica'] },
    { q: 'How many continents are there?', right: '7', wrong: ['5', '4', '10'] },
    { q: 'Which continent is the biggest?', right: 'Asia', wrong: ['Australia', 'Europe', 'Antarctica'] },
    { q: 'Which ocean is between North America and Europe?', right: 'Atlantic Ocean', wrong: ['Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'] },
    { q: 'Which continent has the Sahara Desert?', right: 'Africa', wrong: ['Asia', 'South America', 'Europe'] },
  ]),
  'ss.3.flags': facts('ss.3.flags', [
    { q: 'Which flag belongs to the United States?', right: it('🇺🇸', 'United States'), wrong: [it('🇨🇦', 'Canada'), it('🇲🇽', 'Mexico'), it('🇬🇧', 'United Kingdom')] },
    { q: 'Which flag belongs to Canada?', right: it('🇨🇦', 'Canada'), wrong: [it('🇺🇸', 'United States'), it('🇯🇵', 'Japan'), it('🇫🇷', 'France')] },
    { q: 'Which flag belongs to Mexico?', right: it('🇲🇽', 'Mexico'), wrong: [it('🇮🇹', 'Italy'), it('🇧🇷', 'Brazil'), it('🇨🇦', 'Canada')] },
    { q: 'Which flag belongs to Japan?', right: it('🇯🇵', 'Japan'), wrong: [it('🇨🇳', 'China'), it('🇰🇷', 'South Korea'), it('🇫🇷', 'France')] },
    { q: 'Which flag belongs to Brazil?', right: it('🇧🇷', 'Brazil'), wrong: [it('🇲🇽', 'Mexico'), it('🇮🇹', 'Italy'), it('🇦🇺', 'Australia')] },
    { q: 'Which flag belongs to France?', right: it('🇫🇷', 'France'), wrong: [it('🇮🇹', 'Italy'), it('🇬🇧', 'United Kingdom'), it('🇩🇪', 'Germany')] },
  ], false),
  'ss.4.regions': facts('ss.4.regions', [
    { q: 'Which is the largest U.S. state?', right: 'Alaska', wrong: ['Texas', 'California', 'Rhode Island'] },
    { q: 'Which U.S. state is made of islands in the Pacific Ocean?', right: 'Hawaii', wrong: ['Florida', 'Maine', 'Alaska'] },
    { q: 'What is the capital of the United States?', right: 'Washington, D.C.', wrong: ['New York City', 'Los Angeles', 'Chicago'] },
    { q: 'Which is the longest river in the United States?', right: 'Missouri River', wrong: ['Hudson River', 'Ohio River', 'Colorado River'] },
    { q: 'How many states are in the United States?', right: '50', wrong: ['48', '13', '52'] },
    { q: 'Which mountains run along the western U.S.?', right: 'Rocky Mountains', wrong: ['Appalachian Mountains', 'Alps', 'Himalayas'] },
    { q: 'Which U.S. state is shaped like a mitten?', right: 'Michigan', wrong: ['Ohio', 'Florida', 'Texas'] },
    { q: 'Which ocean is on the East Coast of the U.S.?', right: 'Atlantic Ocean', wrong: ['Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'] },
  ]),
  'ss.5.mapskills': facts('ss.5.mapskills', [
    { q: 'Lines that run east to west around the globe measure…', right: 'latitude', wrong: ['longitude', 'altitude', 'attitude'] },
    { q: 'Lines that run from the North Pole to the South Pole measure…', right: 'longitude', wrong: ['latitude', 'the equator', 'elevation'] },
    { q: 'The imaginary line around the middle of Earth is the…', right: 'equator', wrong: ['prime meridian', 'North Pole', 'tropics'] },
    { q: 'The equator splits Earth into the Northern and…', right: 'Southern Hemisphere', wrong: ['Eastern Hemisphere', 'Western Hemisphere', 'Upper Hemisphere'] },
    { q: 'The map tool that shows real distances is the…', right: 'scale', wrong: ['key', 'title', 'compass rose'] },
    { q: 'Places near the equator are usually…', right: 'warm', wrong: ['frozen', 'snowy all year', 'dark all day'] },
  ]),
};

// ---------- Time Travelers ----------
export const TIME_TRAVELERS: Record<string, ChoiceGen> = {
  'ss.k.pastpresent': sorter('ss.k.pastpresent', [
    { name: 'Long ago', emoji: '🕰️', items: [it('🕯️', 'candle for light'), it('🐎', 'horse and buggy'), it('☎️', 'old phone'), it('✉️', 'handwritten letter'), it('📻', 'old radio')] },
    { name: 'Today', emoji: '📱', items: [it('💡', 'light bulb'), it('🚗', 'car'), it('📱', 'smartphone'), it('💻', 'computer'), it('📺', 'flat TV')] },
  ], (i) => `${i.name}. Is it from long ago or today?`),
  'ss.k.needswants': sorter('ss.k.needswants', [
    { name: 'Need', emoji: '💧', items: [it('💧', 'water'), it('🍎', 'food'), it('🏠', 'a home'), it('🧥', 'warm clothes')] },
    { name: 'Want', emoji: '🎁', items: [it('🧸', 'a new toy'), it('🍭', 'candy'), it('🎮', 'a video game'), it('🎢', 'a theme park trip')] },
  ], (i) => `${i.name}. Is it a need or a want?`),
  'ss.k.holidays': facts('ss.k.holidays', [
    { q: 'Which holiday has jack-o’-lanterns?', right: it('🎃', 'Halloween'), wrong: [it('🦃', 'Thanksgiving'), it('🎆', 'Fourth of July'), it('💝', 'Valentine’s Day')] },
    { q: 'Which holiday has fireworks for America’s birthday?', right: it('🎆', 'Fourth of July'), wrong: [it('🎃', 'Halloween'), it('🦃', 'Thanksgiving'), it('🍀', 'St. Patrick’s Day')] },
    { q: 'Which holiday is about giving thanks with a big meal?', right: it('🦃', 'Thanksgiving'), wrong: [it('🎃', 'Halloween'), it('💝', 'Valentine’s Day'), it('🎆', 'Fourth of July')] },
    { q: 'Which holiday has hearts and cards for friends?', right: it('💝', 'Valentine’s Day'), wrong: [it('🦃', 'Thanksgiving'), it('🎃', 'Halloween'), it('🎆', 'Fourth of July')] },
    { q: 'On which day do people start a brand-new year?', right: it('🎊', 'New Year’s Day'), wrong: [it('🎃', 'Halloween'), it('🦃', 'Thanksgiving'), it('💝', 'Valentine’s Day')] },
  ]),
  'ss.1.symbols': facts('ss.1.symbols', [
    { q: 'Which bird is a symbol of the United States?', right: it('🦅', 'bald eagle'), wrong: [it('🦉', 'owl'), it('🦆', 'duck'), it('🦜', 'parrot')] },
    { q: 'Which statue in New York holds up a torch?', right: it('🗽', 'Statue of Liberty'), wrong: [it('🗿', 'stone head'), it('🏰', 'castle'), it('🎡', 'Ferris wheel')] },
    { q: 'How many stars are on the U.S. flag?', right: '50', wrong: ['13', '10', '100'] },
    { q: 'What do the 13 stripes on the U.S. flag stand for?', right: 'the first 13 colonies', wrong: ['13 presidents', '13 oceans', '13 holidays'] },
    { q: 'Which song is the U.S. national anthem?', right: 'The Star-Spangled Banner', wrong: ['Happy Birthday', 'Twinkle, Twinkle', 'Jingle Bells'] },
  ]),
  'ss.2.goods': sorter('ss.2.goods', [
    { name: 'Goods', emoji: '📦', items: [it('🍎', 'apples at a store'), it('👟', 'new shoes'), it('🧸', 'a toy'), it('📕', 'a book'), it('🍞', 'a loaf of bread')] },
    { name: 'Services', emoji: '🧑‍🔧', items: [it('✂️', 'a haircut'), it('🧑‍⚕️', 'a checkup at the doctor'), it('🚌', 'a bus ride'), it('🧑‍🔧', 'fixing a car'), it('🧑‍🏫', 'a teacher teaching')] },
  ], (i) => `${i.name}. Is that a good or a service?`),
  'ss.3.government': facts('ss.3.government', [
    { q: 'Who is the leader of a city?', right: 'the mayor', wrong: ['the governor', 'the president', 'the principal'] },
    { q: 'Who is the leader of a state?', right: 'the governor', wrong: ['the mayor', 'the president', 'the judge'] },
    { q: 'Who is the leader of the whole country?', right: 'the president', wrong: ['the mayor', 'the governor', 'the sheriff'] },
    { q: 'What do we call it when citizens choose leaders?', right: 'voting', wrong: ['shopping', 'marching', 'guessing'] },
    { q: 'What are taxes used for?', right: 'to pay for things like roads and schools', wrong: ['to buy toys for leaders', 'to make money disappear', 'nothing'] },
    { q: 'A person who belongs to a country is called a…', right: 'citizen', wrong: ['tourist', 'visitor', 'stranger'] },
  ]),
  'ss.4.economics': facts('ss.4.economics', [
    { q: 'When lots of people want something and there is only a little of it, the price usually…', right: 'goes up', wrong: ['goes down', 'stays at zero', 'disappears'] },
    { q: 'Money you put away to use later is called…', right: 'savings', wrong: ['a tax', 'a loan', 'a fee'] },
    { q: 'A person who starts a business is called an…', right: 'entrepreneur', wrong: ['engineer', 'explorer', 'astronaut'] },
    { q: 'Trading a toy for a friend’s book without money is called…', right: 'bartering', wrong: ['borrowing', 'banking', 'budgeting'] },
    { q: 'A plan for how to spend and save money is a…', right: 'budget', wrong: ['receipt', 'coupon', 'tax'] },
    { q: 'Giving up one choice to get another is called the…', right: 'opportunity cost', wrong: ['sale price', 'interest', 'profit'] },
  ]),
  'ss.5.history': facts('ss.5.history', [
    { q: 'In what year was the Declaration of Independence signed?', right: '1776', wrong: ['1492', '1865', '1920'] },
    { q: 'Who was the first President of the United States?', right: 'George Washington', wrong: ['Abraham Lincoln', 'Thomas Jefferson', 'Benjamin Franklin'] },
    { q: 'Who wrote most of the Declaration of Independence?', right: 'Thomas Jefferson', wrong: ['George Washington', 'Paul Revere', 'Abraham Lincoln'] },
    { q: 'How many colonies joined to form the United States?', right: '13', wrong: ['50', '7', '20'] },
    { q: 'What document sets up the U.S. government and its laws?', right: 'the Constitution', wrong: ['the Mayflower', 'the Liberty Bell', 'a newspaper'] },
    { q: 'The first ten amendments to the Constitution are called the…', right: 'Bill of Rights', wrong: ['Gettysburg Address', 'Pledge of Allegiance', 'Star-Spangled Banner'] },
  ]),
  'ss.5.government': sorter('ss.5.government', [
    { name: 'Makes laws', emoji: '📜', items: [it('🏛️', 'Congress'), it('🗳️', 'Senators and Representatives')] },
    { name: 'Carries out laws', emoji: '🏢', items: [it('🧑‍💼', 'the President'), it('🇺🇸', 'the Vice President')] },
    { name: 'Explains laws', emoji: '⚖️', items: [it('👩‍⚖️', 'the Supreme Court'), it('⚖️', 'federal judges')] },
  ], (i) => `${i.name}. Which branch of government is that: makes laws, carries out laws, or explains laws?`),
};
