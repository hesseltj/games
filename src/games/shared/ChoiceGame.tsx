import { useEffect, useMemo, useRef, useState } from 'react';
import type { Kid, Subject } from '../../core/types';
import { useRound, type RoundSummary } from '../../core/useRound';
import type { Skill } from '../../core/skills';
import type { Rng } from '../../core/random';
import { speak, setSpeechRate, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { Shape } from '../../ui/Shape';
import { Clock, CoinRow, FractionBar, GridMap, Ruler } from '../../ui/MathArt';
import type { ChoiceOption, ChoiceQuestion, Display, OptContent } from './types';
import { GameTopBar } from './GameTopBar';
import { GameBuddy, comboOf } from './GameBuddy';

import type { Skin } from '../choiceGens';
export type { Skin };

const TINTS = ['#ffd6e7', '#d6ecff', '#e2ffd6', '#fff1c2', '#eadcff', '#ffe0cc'];
const PRAISE = ['Great job!', 'You got it!', 'Awesome!', 'Yes!', 'Super!', 'Way to go!', 'Nice!'];

export interface GameProps {
  kid: Kid;
  onFinish: (s: RoundSummary) => void;
  onQuit: () => void;
}

/**
 * Shared "pick the right answer" game. Number Pop, Letter Lagoon, Picture Words, Sort It!,
 * Science Safari, Pattern Train and Story Spot are all this component with a different skin.
 */
export function ChoiceGame({ kid, onFinish, onQuit, subject, gameId, skin, generate, total, fixedSkillId }: GameProps & {
  subject: Subject;
  gameId: string;
  skin: Skin;
  generate: (skill: Skill, step: number, rng: Rng) => ChoiceQuestion;
  total?: number;
  fixedSkillId?: string;
}) {
  const round = useRound({ kid, subject, gameId, onFinish, generate, total, fixedSkillId });
  const { question: q, index, grade } = round;
  const young = grade === 'PK' || grade === 'K';

  const [misses, setMisses] = useState(0);
  const [faded, setFaded] = useState<Set<string>>(new Set());
  const [wobble, setWobble] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const locked = useRef(false);

  useEffect(() => {
    setSpeechRate(young ? 0.85 : 0.95);
    return () => stopSpeaking();
  }, [young]);

  useEffect(() => {
    setMisses(0);
    setFaded(new Set());
    setPicked(null);
    locked.current = false;
    const t = setTimeout(() => speak(q.say), 350);
    return () => clearTimeout(t);
  }, [q]);

  function tap(o: ChoiceOption) {
    if (locked.current || faded.has(o.id)) return;
    if (o.correct) {
      locked.current = true;
      sfx.pop();
      setTimeout(() => sfx.correct(), 120);
      setPicked(o.id);
      const combo = misses === 0 ? comboOf(round.results) + 1 : 0;
      if (combo >= 3) { setTimeout(() => sfx.combo(), 350); speak(`${combo} in a row!`); }
      else speak(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      setTimeout(() => round.submit(misses === 0), 1100);
      return;
    }
    sfx.boop();
    setWobble(o.id);
    setTimeout(() => setWobble(null), 500);
    const m = misses + 1;
    setMisses(m);
    setFaded((f) => new Set(f).add(o.id));
    const again = q.repeat ?? q.say;
    speak(m === 1 ? `Try again! ${again}` : `Here it is! ${again}`);
  }

  const size = young ? 'lg' : q.options.length >= 4 ? 'sm' : 'md';
  const delays = useMemo(() => q.options.map(() => Math.random() * 1.5), [q]);

  return (
    <div className={`screen choice-game skin-${skin}`}>
      <GameTopBar total={round.total} index={index} results={round.results} onQuit={onQuit} onSpeak={() => speak(q.repeat ?? q.say)} />
      <div className="np-prompt">
        {q.display.kind !== 'story' && <div className="np-text">{q.prompt}</div>}
        <DisplayView d={q.display} />
        {q.display.kind === 'story' && <div className="np-text story-q">{q.prompt}</div>}
      </div>
      <div className={`choices n${q.options.length}`}>
        {q.options.map((o, i) => (
          <button
            key={o.id}
            className={['opt', size, faded.has(o.id) ? 'faded' : '', wobble === o.id ? 'wobble' : '',
              picked === o.id ? 'picked' : '', misses >= 2 && o.correct ? 'glow' : ''].join(' ')}
            style={{
              ['--tint' as string]: o.content.kind === 'color' ? o.content.hex : TINTS[i % TINTS.length],
              // Bubbles and fish drift out of step with each other; cards appear right away.
              animationDelay: skin === 'bubbles' || skin === 'fish' ? `${delays[i]}s, 0s` : undefined,
            }}
            onClick={() => tap(o)}
            aria-label={labelFor(o.content)}
          >
            <OptionFace c={o.content} />
            {picked === o.id && <span className="pop-burst" />}
          </button>
        ))}
      </div>
      {picked && <div className="cheer-pop">⭐</div>}
      <GameBuddy kid={kid} mood={picked ? 'cheer' : wobble ? 'oops' : 'idle'} combo={misses === 0 ? comboOf(round.results) + 1 : 0} />
    </div>
  );
}

export function labelFor(c: OptContent): string {
  switch (c.kind) {
    case 'number': return String(c.n);
    case 'text': return c.text;
    case 'color': return c.name;
    case 'shape': return c.shape;
    case 'emoji': return c.label ?? c.emoji;
    case 'group': return `${c.count}`;
    case 'coins': return `${c.coins.reduce((a, b) => a + b, 0)} cents`;
    case 'fraction': return `${c.n} out of ${c.d}`;
  }
}

export function OptionFace({ c }: { c: OptContent }) {
  switch (c.kind) {
    case 'number':
      return (
        <span className="bf-number">
          <span className={String(c.n).length >= 3 ? 'n3' : ''}>{c.n}</span>
          {c.dots && c.n <= 10 && <span className="bf-dots">{Array.from({ length: c.n }, (_, i) => <i key={i} />)}</span>}
        </span>
      );
    case 'text': return <span className={`bf-text ${c.text.length <= 2 ? 'letter' : c.text.length > 9 ? 'long' : ''}`}>{c.text}</span>;
    case 'color': return <span className="bf-color" />;
    case 'shape': return <Shape shape={c.shape} size={70} />;
    case 'emoji':
      return (
        <span className="bf-emoji-wrap">
          <span className="bf-emoji">{c.emoji}</span>
          {c.label && <span className="bf-label">{c.label}</span>}
        </span>
      );
    case 'group':
      return <span className={`bf-group c${Math.min(c.count, 8)}`}>{Array.from({ length: c.count }, (_, i) => <span key={i}>{c.emoji}</span>)}</span>;
    case 'coins':
      return <CoinRow coins={c.coins} size={c.coins.length === 1 ? 2.6 : c.coins.length > 3 ? 1 : 1.4} />;
    case 'fraction':
      return <FractionBar n={c.n} d={c.d} pie={c.pie} size={c.pie ? 1.2 : 0.8} />;
  }
}

function DisplayView({ d }: { d: Display }) {
  switch (d.kind) {
    case 'none': return null;
    case 'text': return <div className="np-display-text">{d.text}</div>;
    case 'emoji':
      return (
        <div className="np-display-emoji">
          <span>{d.emoji}</span>
          {d.label && <b>{d.label}</b>}
        </div>
      );
    case 'objects':
      return (
        <div className={`np-objects ${d.count > 10 ? 'many' : ''}`} style={{ ['--cols' as string]: d.count <= 5 ? d.count : 5 }}>
          {Array.from({ length: d.count }, (_, i) => (
            <span key={i} className={d.faded && i >= d.count - d.faded ? 'gone' : ''}>{d.emoji}</span>
          ))}
        </div>
      );
    case 'sum':
      return (
        <div className="np-sum">
          <span className="np-objects inline">{Array.from({ length: d.a }, (_, i) => <span key={i}>{d.emoji}</span>)}</span>
          <span className="np-op">+</span>
          <span className="np-objects inline">{Array.from({ length: d.b }, (_, i) => <span key={i}>{d.emoji}</span>)}</span>
        </div>
      );
    case 'tenFrame':
      return <div className="ten-frame">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < d.filled ? 'on' : ''} />)}</div>;
    case 'pattern':
      return (
        <div className="train">
          <span className="train-engine">🚂</span>
          {d.items.map((c, i) => <span key={i} className="train-car"><OptionFace c={c} /></span>)}
          <span className="train-car mystery">?</span>
        </div>
      );
    case 'coins':
      return <div className="np-display-box"><CoinRow coins={d.coins} size={1.5} /></div>;
    case 'clock':
      return <div className="np-display-box"><Clock h={d.h} m={d.m} size={210} /></div>;
    case 'ruler':
      return <div className="np-display-box wide"><Ruler start={d.start} length={d.length} emoji={d.emoji} /></div>;
    case 'fraction':
      return <div className="np-display-box"><FractionBar n={d.n} d={d.d} pie={d.pie} size={d.pie ? 1.6 : 1.4} /></div>;
    case 'map':
      return <div className="np-display-box"><GridMap size={d.size} cells={d.cells} /></div>;
    case 'grid':
      return (
        <div className="np-display-box">
          <div className="area-grid" style={{ ['--c' as string]: d.cols }}>{Array.from({ length: d.rows * d.cols }, (_, i) => <span key={i} />)}</div>
        </div>
      );
    case 'order':
      return (
        <div className="order-ticket">
          <span className="order-customer">{d.emoji}</span>
          <span className="order-text">{d.text}</span>
        </div>
      );
    case 'story':
      return (
        <div className="story">
          <div className="story-title"><span>{d.emoji}</span> {d.title}</div>
          {d.lines.map((l, i) => <p key={i}>{l}</p>)}
        </div>
      );
  }
}
