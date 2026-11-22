import { useEffect, useRef, useState } from 'react';
import { useRound } from '../../core/useRound';
import { speak, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { GameTopBar } from '../shared/GameTopBar';
import { GameBuddy } from '../shared/GameBuddy';
import type { GameProps } from '../shared/ChoiceGame';
import { ARROW, isNeighbor, key, makePuzzle, runProgram, type Dir, type Pos, type Puzzle } from './robot';

const MAX_PROGRAM = 10;

/** Robot Path: tap to walk the robot (Pre-K/K) or plan arrow moves and press Go (grade 2). */
export function RobotGame({ kid, onFinish, onQuit }: GameProps) {
  const round = useRound<Puzzle>({ kid, subject: 'logic', gameId: 'robotPath', onFinish, generate: (skill, step, rng) => makePuzzle(skill.id, step, rng) });
  const p = round.question;
  const [pos, setPos] = useState<Pos>(p.start);
  const [visited, setVisited] = useState<string[]>([]);
  const [program, setProgram] = useState<Dir[]>([]);
  const [misses, setMisses] = useState(0);
  const [bump, setBump] = useState(false);
  const [won, setWon] = useState(false);
  const running = useRef(false);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setPos(p.start);
    setVisited([key(p.start)]);
    setProgram([]);
    setMisses(0);
    setWon(false);
    running.current = false;
    const t = setTimeout(() => speak(p.mode === 'tap' ? 'Help the robot get to the battery! Tap a square next to the robot.' : 'Plan the robot’s moves with the arrows, then press Go!'), 350);
    return () => clearTimeout(t);
  }, [p]);

  function miss(msg: string) {
    sfx.boop();
    setBump(true);
    setTimeout(() => setBump(false), 400);
    setMisses((m) => m + 1);
    speak(msg);
  }

  function win() {
    setWon(true);
    sfx.correct();
    speak('Beep boop! Battery found!');
    setTimeout(() => round.submit(misses === 0), 1300);
  }

  function tapCell(c: Pos) {
    if (p.mode !== 'tap' || won) return;
    if (key(c) === key(pos)) return;
    if (!isNeighbor(c, pos)) return miss('The robot can only move one square at a time.');
    if (p.walls.has(key(c))) return miss('Oops, that’s a wall!');
    sfx.tap();
    setPos(c);
    setVisited((v) => [...v, key(c)]);
    if (key(c) === key(p.goal)) win();
  }

  async function go() {
    if (running.current || program.length === 0 || won) return;
    running.current = true;
    const result = runProgram(p, program);
    for (const step of result.trail.slice(1)) {
      setPos(step);
      sfx.tap();
      await new Promise((r) => setTimeout(r, 380));
    }
    if (result.reached) { win(); return; }
    await new Promise((r) => setTimeout(r, 300));
    miss(result.bumped ? 'Bonk! The robot hit a wall. Try a new plan!' : 'Not quite there. Try again!');
    setPos(p.start);
    running.current = false;
  }

  // Hint after two misses: show the shortest path.
  const hint = misses >= 2 ? new Set(p.path.slice(1, -1).map(key)) : new Set<string>();
  const nextHint = p.mode === 'tap' && misses >= 1 ? p.path[Math.max(1, p.path.findIndex((q) => key(q) === key(pos)) + 1)] : null;

  return (
    <div className="screen robot-game">
      <GameTopBar total={round.total} index={round.index} results={round.results} onQuit={onQuit}
        onSpeak={() => speak(p.mode === 'tap' ? 'Tap a square next to the robot to move it to the battery.' : 'Use the arrows to plan the moves, then press Go.')} />
      <GameBuddy kid={kid} mood={won ? 'cheer' : bump ? 'oops' : 'idle'} combo={0} />
      <div className="robot-body">
        <div className={`robot-grid ${p.mode === 'program' ? 'prog' : ''}`} style={{ ['--n' as string]: p.size }}>
          {Array.from({ length: p.size * p.size }, (_, i) => {
            const c = { x: i % p.size, y: Math.floor(i / p.size) };
            const k = key(c);
            const isRobot = k === key(pos);
            return (
              <button key={k} className={['cell', p.walls.has(k) ? 'wall' : '', visited.includes(k) && p.mode === 'tap' ? 'trail' : '',
                hint.has(k) ? 'hint' : '', nextHint && key(nextHint) === k ? 'next' : ''].join(' ')} onClick={() => tapCell(c)}>
                {p.walls.has(k) ? '🪨' : k === key(p.goal) && !isRobot ? '🔋' : ''}
                {isRobot && <span className={`robot ${bump ? 'wobble' : ''} ${won ? 'bounce' : ''}`}>🤖</span>}
              </button>
            );
          })}
        </div>
        {p.mode === 'program' && (
          <div className="program">
            <div className="program-line">
              {program.length === 0 ? <span className="program-empty">Tap arrows to plan</span> : program.map((d, i) => <span key={i}>{ARROW[d]}</span>)}
            </div>
            <div className="arrows">
              <span />
              <button onClick={() => add('up')}>{ARROW.up}</button>
              <span />
              <button onClick={() => add('left')}>{ARROW.left}</button>
              <button onClick={() => add('down')}>{ARROW.down}</button>
              <button onClick={() => add('right')}>{ARROW.right}</button>
            </div>
            <div className="row">
              <button className="small-btn alt" onClick={() => { sfx.tap(); setProgram((x) => x.slice(0, -1)); }}>⌫ Undo</button>
              <button className="small-btn go" onClick={go}>▶ Go!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function add(d: Dir) {
    if (running.current || program.length >= MAX_PROGRAM) return;
    sfx.tap();
    setProgram((x) => [...x, d]);
  }
}
