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
  { id: 'numberPop', subject: 'math', name: 'Number Pop', emoji: '🫧', blurb: 'Pop the right bubble!', ready: true },
  { id: 'bakeShop', subject: 'math', name: 'Bake Shop', emoji: '🧁', blurb: 'Count, add and make change', ready: false },
  { id: 'letterLagoon', subject: 'reading', name: 'Letter Lagoon', emoji: '🐠', blurb: 'Catch the letter sounds', ready: false },
  { id: 'wordBuilder', subject: 'reading', name: 'Word Builder', emoji: '🏗️', blurb: 'Build words from letters', ready: false },
  { id: 'storySpot', subject: 'reading', name: 'Story Spot', emoji: '📚', blurb: 'Read a story, answer questions', ready: false },
  { id: 'pictureWords', subject: 'spelling', name: 'Picture Words', emoji: '🖼️', blurb: 'Find the right picture', ready: false },
  { id: 'spellingBee', subject: 'spelling', name: 'Spelling Bee Garden', emoji: '🐝', blurb: 'Spell words, grow flowers', ready: false },
  { id: 'sortIt', subject: 'science', name: 'Sort It!', emoji: '🗂️', blurb: 'Put things where they belong', ready: false },
  { id: 'weatherWatch', subject: 'science', name: 'Weather Watch', emoji: '🌦️', blurb: 'Dress for the weather', ready: false },
  { id: 'lifeCycle', subject: 'science', name: 'Life Cycle Line-Up', emoji: '🐛', blurb: 'Put the stages in order', ready: false },
  { id: 'patternTrain', subject: 'logic', name: 'Pattern Train', emoji: '🚂', blurb: 'What comes next?', ready: false },
  { id: 'robotPath', subject: 'logic', name: 'Robot Path', emoji: '🤖', blurb: 'Guide the robot home', ready: false },
  { id: 'memoryFlip', subject: 'logic', name: 'Memory Flip', emoji: '🃏', blurb: 'Find the matching pairs', ready: false },
  { id: 'pictureSudoku', subject: 'logic', name: 'Picture Sudoku', emoji: '🔲', blurb: 'Fill the grid', ready: false },
];
