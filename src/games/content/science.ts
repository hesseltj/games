export interface Item { emoji: string; name: string }

export const ANIMAL_SOUNDS: (Item & { sound: string })[] = [
  { emoji: '🐮', name: 'cow', sound: 'moo' }, { emoji: '🐶', name: 'dog', sound: 'woof' }, { emoji: '🐱', name: 'cat', sound: 'meow' },
  { emoji: '🐷', name: 'pig', sound: 'oink' }, { emoji: '🦆', name: 'duck', sound: 'quack' }, { emoji: '🐑', name: 'sheep', sound: 'baa' },
  { emoji: '🦁', name: 'lion', sound: 'roar' }, { emoji: '🐴', name: 'horse', sound: 'neigh' }, { emoji: '🐔', name: 'chicken', sound: 'cluck' },
  { emoji: '🐸', name: 'frog', sound: 'ribbit' }, { emoji: '🦉', name: 'owl', sound: 'hoot' }, { emoji: '🐝', name: 'bee', sound: 'buzz' },
];

export const SENSES: (Item & { verb: string })[] = [
  { emoji: '👀', name: 'eyes', verb: 'see' }, { emoji: '👂', name: 'ears', verb: 'hear' }, { emoji: '👃', name: 'nose', verb: 'smell' },
  { emoji: '👅', name: 'tongue', verb: 'taste' }, { emoji: '✋', name: 'hands', verb: 'touch' },
];

export const BODY_PARTS: Item[] = [
  { emoji: '👂', name: 'ear' }, { emoji: '👃', name: 'nose' }, { emoji: '👀', name: 'eyes' }, { emoji: '✋', name: 'hand' },
  { emoji: '🦶', name: 'foot' }, { emoji: '🦵', name: 'leg' }, { emoji: '👄', name: 'mouth' }, { emoji: '🦷', name: 'tooth' },
  { emoji: '💪', name: 'arm' },
];

export const WEATHER: Item[] = [
  { emoji: '☀️', name: 'sunny' }, { emoji: '🌧️', name: 'rainy' }, { emoji: '❄️', name: 'snowy' }, { emoji: '⛅', name: 'cloudy' },
  { emoji: '🌬️', name: 'windy' }, { emoji: '⛈️', name: 'stormy' },
];

export const WEATHER_WEAR: { weather: Item; wear: Item[] }[] = [
  { weather: { emoji: '❄️', name: 'snowy' }, wear: [{ emoji: '🧤', name: 'mittens' }, { emoji: '🧣', name: 'scarf' }, { emoji: '🥾', name: 'boots' }] },
  { weather: { emoji: '🌧️', name: 'rainy' }, wear: [{ emoji: '☂️', name: 'umbrella' }, { emoji: '🧥', name: 'raincoat' }] },
  { weather: { emoji: '☀️', name: 'hot and sunny' }, wear: [{ emoji: '🩳', name: 'shorts' }, { emoji: '🕶️', name: 'sunglasses' }, { emoji: '👒', name: 'sun hat' }] },
];

export const NEEDS: { who: Item; needs: Item[]; notNeeds: Item[] }[] = [
  { who: { emoji: '🌱', name: 'a plant' }, needs: [{ emoji: '💧', name: 'water' }, { emoji: '☀️', name: 'sunlight' }], notNeeds: [{ emoji: '🍕', name: 'pizza' }, { emoji: '📺', name: 'TV' }, { emoji: '🧸', name: 'teddy bear' }, { emoji: '👟', name: 'shoes' }] },
  { who: { emoji: '🐶', name: 'a dog' }, needs: [{ emoji: '💧', name: 'water' }, { emoji: '🦴', name: 'food' }, { emoji: '🏠', name: 'shelter' }], notNeeds: [{ emoji: '📱', name: 'phone' }, { emoji: '🎮', name: 'video game' }, { emoji: '🕶️', name: 'sunglasses' }] },
  { who: { emoji: '🐟', name: 'a fish' }, needs: [{ emoji: '💧', name: 'water' }, { emoji: '🦐', name: 'food' }], notNeeds: [{ emoji: '🧥', name: 'coat' }, { emoji: '🛏️', name: 'bed' }, { emoji: '🚲', name: 'bike' }] },
];

export const LIVING: Item[] = [
  { emoji: '🐶', name: 'dog' }, { emoji: '🌳', name: 'tree' }, { emoji: '🐦', name: 'bird' }, { emoji: '🌻', name: 'flower' },
  { emoji: '🐟', name: 'fish' }, { emoji: '🧒', name: 'child' }, { emoji: '🐛', name: 'caterpillar' }, { emoji: '🍄', name: 'mushroom' },
  { emoji: '🐢', name: 'turtle' }, { emoji: '🌵', name: 'cactus' },
];
export const NONLIVING: Item[] = [
  { emoji: '🪨', name: 'rock' }, { emoji: '🚗', name: 'car' }, { emoji: '🧸', name: 'teddy bear' }, { emoji: '⚽', name: 'ball' },
  { emoji: '🤖', name: 'robot' }, { emoji: '✏️', name: 'pencil' }, { emoji: '🪑', name: 'chair' }, { emoji: '💧', name: 'water drop' },
  { emoji: '☁️', name: 'cloud' }, { emoji: '📱', name: 'phone' },
];

export const PUSH: Item[] = [
  { emoji: '🛒', name: 'shopping cart' }, { emoji: '⚽', name: 'kicking a ball' }, { emoji: '🔔', name: 'a doorbell button' }, { emoji: '🛴', name: 'a scooter' },
];
export const PULL: Item[] = [
  { emoji: '🪢', name: 'a rope' }, { emoji: '🪁', name: 'a kite string' }, { emoji: '🦷', name: 'a loose tooth' }, { emoji: '🚪', name: 'a door handle toward you' }, { emoji: '🛷', name: 'a sled' },
];

export const MATTER: Record<'solid' | 'liquid' | 'gas', Item[]> = {
  solid: [{ emoji: '🧊', name: 'ice' }, { emoji: '🪨', name: 'rock' }, { emoji: '🧱', name: 'brick' }, { emoji: '🍎', name: 'apple' }, { emoji: '🪙', name: 'coin' }, { emoji: '✏️', name: 'pencil' }],
  liquid: [{ emoji: '🥛', name: 'milk' }, { emoji: '🧃', name: 'juice' }, { emoji: '🌊', name: 'ocean water' }, { emoji: '🍯', name: 'honey' }, { emoji: '☕', name: 'hot cocoa' }, { emoji: '🌧️', name: 'rain' }],
  gas: [{ emoji: '💨', name: 'air' }, { emoji: '🎈', name: 'air in a balloon' }, { emoji: '♨️', name: 'steam' }],
};

export const HABITATS: Record<string, { emoji: string; animals: Item[] }> = {
  ocean: { emoji: '🌊', animals: [{ emoji: '🐳', name: 'whale' }, { emoji: '🐙', name: 'octopus' }, { emoji: '🦈', name: 'shark' }, { emoji: '🐠', name: 'clown fish' }] },
  forest: { emoji: '🌲', animals: [{ emoji: '🦌', name: 'deer' }, { emoji: '🦉', name: 'owl' }, { emoji: '🐿️', name: 'squirrel' }, { emoji: '🦊', name: 'fox' }] },
  desert: { emoji: '🏜️', animals: [{ emoji: '🐪', name: 'camel' }, { emoji: '🦎', name: 'lizard' }, { emoji: '🦂', name: 'scorpion' }] },
  arctic: { emoji: '🧊', animals: [{ emoji: '🐻‍❄️', name: 'polar bear' }, { emoji: '🐧', name: 'penguin' }, { emoji: '🦭', name: 'seal' }] },
};

export const LIFE_CYCLES: { name: string; stages: Item[] }[] = [
  { name: 'butterfly', stages: [{ emoji: '🥚', name: 'egg' }, { emoji: '🐛', name: 'caterpillar' }, { emoji: '🟫', name: 'chrysalis' }, { emoji: '🦋', name: 'butterfly' }] },
  { name: 'frog', stages: [{ emoji: '🥚', name: 'eggs' }, { emoji: '〰️', name: 'tadpole' }, { emoji: '🐸', name: 'frog' }] },
  { name: 'chicken', stages: [{ emoji: '🥚', name: 'egg' }, { emoji: '🐣', name: 'hatching chick' }, { emoji: '🐥', name: 'chick' }, { emoji: '🐔', name: 'hen' }] },
  { name: 'sunflower', stages: [{ emoji: '🌰', name: 'seed' }, { emoji: '🌱', name: 'sprout' }, { emoji: '🌿', name: 'young plant' }, { emoji: '🌻', name: 'sunflower' }] },
];

export const LANDFORMS: Item[] = [
  { emoji: '⛰️', name: 'mountain' }, { emoji: '🏝️', name: 'island' }, { emoji: '🌋', name: 'volcano' }, { emoji: '🏜️', name: 'desert' },
  { emoji: '🌊', name: 'ocean' }, { emoji: '🏞️', name: 'river' }, { emoji: '🏖️', name: 'beach' },
];

export const POLLINATION: { q: string; right: Item; wrong: Item[] }[] = [
  { q: 'Which animal helps flowers make seeds by carrying pollen?', right: { emoji: '🐝', name: 'bee' }, wrong: [{ emoji: '🐟', name: 'fish' }, { emoji: '🐍', name: 'snake' }, { emoji: '🐢', name: 'turtle' }] },
  { q: 'What does a seed need to start growing?', right: { emoji: '💧', name: 'water' }, wrong: [{ emoji: '🍬', name: 'candy' }, { emoji: '🧊', name: 'ice' }, { emoji: '🔦', name: 'flashlight' }] },
  { q: 'Which animal carries seeds to new places in its fur?', right: { emoji: '🐿️', name: 'squirrel' }, wrong: [{ emoji: '🐠', name: 'fish' }, { emoji: '🐌', name: 'snail' }, { emoji: '🐞', name: 'ladybug' }] },
  { q: 'Which part of the plant makes seeds?', right: { emoji: '🌸', name: 'flower' }, wrong: [{ emoji: '🍂', name: 'leaf' }, { emoji: '🪵', name: 'stem' }, { emoji: '🥕', name: 'root' }] },
  { q: 'How do dandelion seeds travel?', right: { emoji: '🌬️', name: 'by wind' }, wrong: [{ emoji: '🚗', name: 'by car' }, { emoji: '🐟', name: 'by fish' }, { emoji: '❄️', name: 'by snow' }] },
];
