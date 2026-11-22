// Every choice-style game's question generators, by game id. Kept free of React so tests can use it.
import type { Subject } from '../core/types';
import type { ChoiceGen } from './shared/types';
import { GENERATORS as NUMBER_POP } from './numberPop/questions';
import { BAKE_SHOP } from './math/bakeShop';
import { NUMBER_POP_MORE, BAKE_SHOP_MORE } from './math/upper';
import { LETTER_LAGOON } from './reading/letterLagoon';
import { LETTER_LAGOON_MORE } from './reading/upper';
import { PICTURE_WORDS } from './spelling/pictureWords';
import { PICTURE_WORDS_MORE } from './spelling/upper';
import { SCIENCE_SAFARI, SORT_IT } from './science/scienceGames';
import { SCIENCE_SAFARI_MORE, SORT_IT_MORE } from './science/upper';
import { PATTERN_TRAIN } from './logic/patternTrain';
import { PATTERN_TRAIN_MORE } from './logic/upper';
import { HELPERS_GAME, MAP_EXPLORER, TIME_TRAVELERS } from './social/socialGames';

export type Skin = 'bubbles' | 'fish' | 'cards' | 'bins' | 'train' | 'story' | 'bakery' | 'map' | 'time';

export const CHOICE_GAMES: Record<string, { subject: Subject; skin: Skin; gens: Record<string, ChoiceGen> }> = {
  numberPop: { subject: 'math', skin: 'bubbles', gens: { ...NUMBER_POP, ...NUMBER_POP_MORE } },
  bakeShop: { subject: 'math', skin: 'bakery', gens: { ...BAKE_SHOP, ...BAKE_SHOP_MORE } },
  letterLagoon: { subject: 'reading', skin: 'fish', gens: { ...LETTER_LAGOON, ...LETTER_LAGOON_MORE } },
  pictureWords: { subject: 'spelling', skin: 'cards', gens: { ...PICTURE_WORDS, ...PICTURE_WORDS_MORE } },
  scienceSafari: { subject: 'science', skin: 'cards', gens: { ...SCIENCE_SAFARI, ...SCIENCE_SAFARI_MORE } },
  sortIt: { subject: 'science', skin: 'bins', gens: { ...SORT_IT, ...SORT_IT_MORE } },
  patternTrain: { subject: 'logic', skin: 'train', gens: { ...PATTERN_TRAIN, ...PATTERN_TRAIN_MORE } },
  helpersAndMe: { subject: 'social', skin: 'cards', gens: HELPERS_GAME },
  mapExplorer: { subject: 'social', skin: 'map', gens: MAP_EXPLORER },
  timeTravelers: { subject: 'social', skin: 'time', gens: TIME_TRAVELERS },
};
