import type { Subject } from './types';

export interface GameInfo {
  id: string;
  subject: Subject;
  name: string;
  emoji: string;
  blurb: string;
  ready: boolean;
}

/** Wave 1 game list (docs/DESIGN.md §5). `ready: false` shows as "coming soon". */
export const GAMES: GameInfo[] = [
  { id: 'numberPop', subject: 'math', name: 'Number Pop', emoji: '🎈', blurb: 'Pop the right bubble!', ready: true },
  { id: 'mathRacer', subject: 'math', name: 'Math Racer', emoji: '🏎️', blurb: 'Answer fast to beat the robot car', ready: true },
  { id: 'numberLine', subject: 'math', name: 'Number Line Hop', emoji: '🐸', blurb: 'Hop the frog to the right spot', ready: true },
  { id: 'fractionPizza', subject: 'math', name: 'Fraction Pizza', emoji: '🍕', blurb: 'Top the right number of slices', ready: true },
  { id: 'bakeShop', subject: 'math', name: 'Bake Shop', emoji: '🧁', blurb: 'Coins, clocks, rulers and orders', ready: true },
  { id: 'letterLagoon', subject: 'reading', name: 'Letter Lagoon', emoji: '🐠', blurb: 'Catch the letter sounds', ready: true },
  { id: 'wordBuilder', subject: 'reading', name: 'Word Builder', emoji: '🏗️', blurb: 'Build words from letters', ready: true },
  { id: 'sentenceScramble', subject: 'reading', name: 'Sentence Scramble', emoji: '🧩', blurb: 'Put the words in order', ready: true },
  { id: 'storySpot', subject: 'reading', name: 'Story Spot', emoji: '📚', blurb: 'Read a story, answer questions', ready: true },
  { id: 'pictureWords', subject: 'spelling', name: 'Picture Words', emoji: '🖼️', blurb: 'Find the right picture', ready: true },
  { id: 'missingLetter', subject: 'spelling', name: 'Missing Letter Monster', emoji: '👾', blurb: 'Feed the monster the missing letter', ready: true },
  { id: 'wordSearch', subject: 'spelling', name: 'Word Search', emoji: '🔎', blurb: 'Find the hidden words', ready: true },
  { id: 'spellingBee', subject: 'spelling', name: 'Spelling Bee Garden', emoji: '🐝', blurb: 'Spell words, grow flowers', ready: true },
  { id: 'sortIt', subject: 'science', name: 'Sort It!', emoji: '🗂️', blurb: 'Put things where they belong', ready: true },
  { id: 'lifeCycle', subject: 'science', name: 'Life Cycle Line-Up', emoji: '🐛', blurb: 'Put the stages in order', ready: true },
  { id: 'factOrFib', subject: 'science', name: 'Fact or Fib?', emoji: '🧪', blurb: 'True or false science', ready: true },
  { id: 'scienceSafari', subject: 'science', name: 'Science Safari', emoji: '🔭', blurb: 'Animals, weather, bodies and more', ready: true },
  { id: 'patternTrain', subject: 'logic', name: 'Pattern Train', emoji: '🚂', blurb: 'What comes next?', ready: true },
  { id: 'robotPath', subject: 'logic', name: 'Robot Path', emoji: '🤖', blurb: 'Guide the robot home', ready: true },
  { id: 'memoryFlip', subject: 'logic', name: 'Memory Flip', emoji: '🃏', blurb: 'Find the matching pairs', ready: true },
  { id: 'ticTacToe', subject: 'logic', name: 'Tic-Tac-Toe Challenge', emoji: '❌', blurb: 'Beat the robot', ready: true },
  { id: 'pictureSudoku', subject: 'logic', name: 'Picture Sudoku', emoji: '🔲', blurb: 'One of each in every row', ready: true },
  { id: 'helpersAndMe', subject: 'social', name: 'Helpers & Me', emoji: '🧑‍🚒', blurb: 'Helpers, feelings and safety', ready: true },
  { id: 'mapExplorer', subject: 'social', name: 'Map Explorer', emoji: '🗺️', blurb: 'Maps, directions and the world', ready: true },
  { id: 'treasureMap', subject: 'social', name: 'Treasure Map', emoji: '🏴‍☠️', blurb: 'Follow the directions to the gold', ready: true },
  { id: 'timeTravelers', subject: 'social', name: 'Time Travelers', emoji: '🕰️', blurb: 'Then and now, money and history', ready: true },
];
