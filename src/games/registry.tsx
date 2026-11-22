import { useRef, type ComponentType } from 'react';
import type { Subject } from '../core/types';
import { THEME_BY_ID } from '../core/themes';
import { defaultRng } from '../core/random';
import { ChoiceGame, type GameProps, type Skin } from './shared/ChoiceGame';
import type { ChoiceGen } from './shared/types';
import { GENERATORS as NUMBER_POP } from './numberPop/questions';
import { LETTER_LAGOON } from './reading/letterLagoon';
import { makeStoryGenerator, STORIES_PER_ROUND, STORY_QUESTIONS_PER_STORY } from './reading/storySpot';
import { PICTURE_WORDS } from './spelling/pictureWords';
import { TileGame } from './spelling/TileGame';
import { SCIENCE_SAFARI, SORT_IT } from './science/scienceGames';
import { PATTERN_TRAIN } from './logic/patternTrain';
import { MemoryGame } from './logic/MemoryGame';
import { RobotGame } from './logic/RobotGame';

/** Choice-style games: which generators they use and how they look. */
export const CHOICE_GAMES: Record<string, { subject: Subject; skin: Skin; gens: Record<string, ChoiceGen> }> = {
  numberPop: { subject: 'math', skin: 'bubbles', gens: NUMBER_POP },
  letterLagoon: { subject: 'reading', skin: 'fish', gens: LETTER_LAGOON },
  pictureWords: { subject: 'spelling', skin: 'cards', gens: PICTURE_WORDS },
  scienceSafari: { subject: 'science', skin: 'cards', gens: SCIENCE_SAFARI },
  sortIt: { subject: 'science', skin: 'bins', gens: SORT_IT },
  patternTrain: { subject: 'logic', skin: 'train', gens: PATTERN_TRAIN },
};

function choiceGame(gameId: string): ComponentType<GameProps> {
  const cfg = CHOICE_GAMES[gameId];
  return function Choice(props: GameProps) {
    const objects = THEME_BY_ID[props.kid.favoriteTheme].objects;
    return (
      <ChoiceGame {...props} subject={cfg.subject} gameId={gameId} skin={cfg.skin}
        generate={(skill, step, rng) => cfg.gens[skill.id]({ rng, step, objects, kidName: props.kid.name })} />
    );
  };
}

function StorySpot(props: GameProps) {
  const gen = useRef(makeStoryGenerator(defaultRng));
  return <ChoiceGame {...props} subject="reading" gameId="storySpot" skin="story" total={STORIES_PER_ROUND * STORY_QUESTIONS_PER_STORY}
    generate={(_skill, step) => gen.current(step)} />;
}

export const GAME_COMPONENTS: Record<string, ComponentType<GameProps>> = {
  ...Object.fromEntries(Object.keys(CHOICE_GAMES).map((id) => [id, choiceGame(id)])),
  storySpot: StorySpot,
  wordBuilder: (p) => <TileGame {...p} subject="reading" gameId="wordBuilder" />,
  spellingBee: (p) => <TileGame {...p} subject="spelling" gameId="spellingBee" garden />,
  memoryFlip: MemoryGame,
  robotPath: RobotGame,
};
