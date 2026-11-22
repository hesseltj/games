import { shuffle, type Rng } from '../../core/random';
import { pickOne, question, txt } from '../shared/build';
import type { ChoiceQuestion } from '../shared/types';
import { STORIES } from '../content/stories';

export const STORY_QUESTIONS_PER_STORY = 3;
export const STORIES_PER_ROUND = 3;

/** Story Spot goes through a few stories for one grade, three questions each, reading the story aloud first. */
export function makeStoryGenerator(rng: Rng, skillId = 'r.2.comprehend') {
  const grade = skillId.split('.')[1];
  const pool = STORIES.filter((s) => (s.grade ?? '2') === grade);
  const order = shuffle(rng, pool.length ? pool : STORIES);
  let n = 0;
  return (step: number): ChoiceQuestion => {
    const story = order[Math.floor(n / STORY_QUESTIONS_PER_STORY) % order.length];
    const qi = n % STORY_QUESTIONS_PER_STORY;
    n += 1;
    const { q, answers } = story.questions[qi];
    const [right, ...wrong] = answers;
    const count = step === 1 ? 2 : step === 2 ? 3 : 4;
    const storyText = `${story.title}. ${story.lines.join(' ')}`;
    return question(skillId, step, qi === 0 ? `${storyText} ... ${q}` : q, q,
      { kind: 'story', title: story.title, emoji: story.emoji, lines: story.lines },
      pickOne(right, shuffle(rng, wrong).slice(0, count - 1), txt), rng, `${storyText} ... ${q}`);
  };
}
