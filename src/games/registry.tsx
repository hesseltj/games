import { useRef, useState, type ComponentType } from 'react';
import { THEME_BY_ID } from '../core/themes';
import { defaultRng } from '../core/random';
import { ChoiceGame, type GameProps } from './shared/ChoiceGame';
import { CHOICE_GAMES } from './choiceGens';
import { makeStoryGenerator, STORIES_PER_ROUND, STORY_QUESTIONS_PER_STORY } from './reading/storySpot';
import { TileGame } from './spelling/TileGame';
import { MemoryGame } from './logic/MemoryGame';
import { RobotGame } from './logic/RobotGame';
import { SudokuGame } from './logic/SudokuGame';
import { SequenceGame } from './more/SequenceGame';
import { NumberLineGame } from './more/NumberLineGame';
import { PizzaGame } from './more/PizzaGame';
import { WordSearchGame } from './more/WordSearchGame';
import { TicTacToeGame } from './more/TicTacToeGame';
import { TreasureMapGame } from './more/TreasureMapGame';
import { pickSkill } from '../core/adaptive';
import { skillsFor } from '../core/skills';
import { kidGrade } from '../core/useRound';
import { getState } from '../data/store';

export { CHOICE_GAMES };

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
  // One grade's stories per round, so a story never switches halfway through.
  const [skillId] = useState(() => pickSkill(skillsFor('reading', 'storySpot'), kidGrade(props.kid, 'reading'), getState().skills[props.kid.id] ?? {}, defaultRng).id);
  const gen = useRef(makeStoryGenerator(defaultRng, skillId));
  return <ChoiceGame {...props} subject="reading" gameId="storySpot" skin="story" total={STORIES_PER_ROUND * STORY_QUESTIONS_PER_STORY}
    fixedSkillId={skillId} generate={(_skill, step) => gen.current(step)} />;
}

export const GAME_COMPONENTS: Record<string, ComponentType<GameProps>> = {
  ...Object.fromEntries(Object.keys(CHOICE_GAMES).map((id) => [id, choiceGame(id)])),
  storySpot: StorySpot,
  wordBuilder: (p) => <TileGame {...p} subject="reading" gameId="wordBuilder" />,
  spellingBee: (p) => <TileGame {...p} subject="spelling" gameId="spellingBee" garden />,
  memoryFlip: MemoryGame,
  robotPath: RobotGame,
  pictureSudoku: SudokuGame,
  sentenceScramble: (p) => <SequenceGame {...p} kind="sentence" />,
  lifeCycle: (p) => <SequenceGame {...p} kind="order" />,
  numberLine: NumberLineGame,
  fractionPizza: PizzaGame,
  wordSearch: WordSearchGame,
  ticTacToe: TicTacToeGame,
  treasureMap: TreasureMapGame,
};
