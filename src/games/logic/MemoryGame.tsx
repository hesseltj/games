import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { THEME_BY_ID } from '../../core/themes';
import { kidGrade } from '../../core/useRound';
import { pickSkill } from '../../core/adaptive';
import { skillsFor } from '../../core/skills';
import { defaultRng } from '../../core/random';
import { getState } from '../../data/store';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import type { GameProps } from '../shared/ChoiceGame';
import { PAIRS_BY_SKILL, isSlip, makeBoard, type MemoryBoard } from './memory';

/** Memory Flip: each pair found is one "answer" for the round. */
export function MemoryGame(props: GameProps) {
  // Pick the skill and board size up front, so the round length equals the number of pairs.
  const [plan] = useState(() => {
    const skills = skillsFor('logic', 'memoryFlip');
    const skill = pickSkill(skills, kidGrade(props.kid, 'logic'), getState().skills[props.kid.id] ?? {}, defaultRng);
    const step = getState().skills[props.kid.id]?.[skill.id]?.step ?? 1;
    return makeBoard(skill.id, step, THEME_BY_ID[props.kid.favoriteTheme].objects, defaultRng);
  });
  return <MemoryRound {...props} board={plan} />;
}

function MemoryRound({ kid, onFinish, onQuit, board }: GameProps & { board: MemoryBoard }) {
  const pairs = board.cards.length / 2;
  const round = useRound<MemoryBoard>({ kid, subject: 'logic', gameId: 'memoryFlip', onFinish, total: pairs, fixedSkillId: board.skillId, generate: () => board });
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const seen = useRef<Set<number>>(new Set());
  const slips = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    speak(pairs <= 3 ? 'Find the matching pictures!' : 'Flip two cards. Find all the pairs!');
    return () => stopSpeaking();
  }, [pairs]);

  function flip(i: number) {
    if (busy.current || open.includes(i) || matched.has(i)) return;
    sfx.tap();
    if (open.length === 0) { setOpen([i]); return; }
    const first = open[0];
    setOpen([first, i]);
    busy.current = true;
    if (board.cards[first] === board.cards[i]) {
      setTimeout(() => {
        sfx.correct();
        setMatched((m) => new Set(m).add(first).add(i));
        setOpen([]);
        busy.current = false;
        round.submit(slips.current === 0);
        slips.current = 0;
      }, 450);
    } else {
      if (isSlip(seen.current, board.cards, first, i)) slips.current += 1;
      seen.current.add(first).add(i);
      setTimeout(() => { sfx.boop(); setOpen([]); busy.current = false; }, 900);
    }
  }

  const cols = board.cards.length <= 4 ? 2 : board.cards.length <= 6 ? 3 : board.cards.length <= 12 ? 4 : 4;
  return (
    <div className="screen memory-game">
      <GameTopBar total={round.total} index={matched.size / 2} results={round.results} onQuit={onQuit} />
      <div className="np-text center">{pairs <= 3 ? 'Find the matches!' : 'Find all the pairs!'}</div>
      <div className="memory-grid" style={{ ['--cols' as string]: cols }}>
        {board.cards.map((c, i) => {
          const up = open.includes(i) || matched.has(i);
          return (
            <button key={i} className={`mcard ${up ? 'up' : ''} ${matched.has(i) ? 'matched' : ''}`} onClick={() => flip(i)} aria-label={up ? c : 'card'}>
              <span className="mcard-inner">
                <span className="mcard-back">?</span>
                <span className="mcard-front">{c}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { PAIRS_BY_SKILL };
