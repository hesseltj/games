import { useEffect, useMemo, useRef, useState } from 'react';
import type { Kid } from '../../core/types';
import { useRound, type RoundSummary } from '../../core/useRound';
import { THEME_BY_ID } from '../../core/themes';
import { generateQuestion, type BubbleContent, type BubbleOption, type Display } from './questions';
import { speak, setSpeechRate, stopSpeaking } from '../../audio/speech';
import { sfx } from '../../audio/sfx';
import { Shape } from '../../ui/Shape';

const BUBBLE_TINTS = ['#ffd6e7', '#d6ecff', '#e2ffd6', '#fff1c2', '#eadcff', '#ffe0cc'];

export function NumberPop({ kid, onFinish, onQuit }: { kid: Kid; onFinish: (s: RoundSummary) => void; onQuit: () => void }) {
  const objects = THEME_BY_ID[kid.favoriteTheme].objects;
  const round = useRound({
    kid, subject: 'math', gameId: 'numberPop', onFinish,
    generate: (skill, step, rng) => generateQuestion(skill.id, { rng, step, objects }),
  });
  const { question: q, index, total, grade } = round;
  const young = grade === 'PK' || grade === 'K';

  const [misses, setMisses] = useState(0);
  const [faded, setFaded] = useState<Set<string>>(new Set());
  const [wobble, setWobble] = useState<string | null>(null);
  const [popped, setPopped] = useState<string | null>(null);
  const [cheer, setCheer] = useState(false);
  const locked = useRef(false);

  useEffect(() => {
    setSpeechRate(young ? 0.85 : 0.95);
    return () => stopSpeaking();
  }, [young]);

  // New question: reset state and read it aloud.
  useEffect(() => {
    setMisses(0);
    setFaded(new Set());
    setPopped(null);
    setCheer(false);
    locked.current = false;
    const t = setTimeout(() => speak(q.say), 350);
    return () => clearTimeout(t);
  }, [q]);

  function tapBubble(o: BubbleOption) {
    if (locked.current || faded.has(o.id)) return;
    if (o.correct) {
      locked.current = true;
      sfx.pop();
      setTimeout(() => sfx.correct(), 120);
      setPopped(o.id);
      setCheer(true);
      speak(pickPraise());
      setTimeout(() => round.submit(misses === 0), 1100);
      return;
    }
    sfx.boop();
    setWobble(o.id);
    setTimeout(() => setWobble(null), 500);
    const m = misses + 1;
    setMisses(m);
    setFaded((f) => new Set(f).add(o.id));
    speak(m === 1 ? `Try again! ${q.say}` : `Here it is! ${q.say}`);
  }

  const showGlow = misses >= 2;
  const bubbleSize = young ? 'lg' : q.options.length >= 4 ? 'sm' : 'md';
  const delays = useMemo(() => q.options.map(() => Math.random() * 1.5), [q]);

  return (
    <div className="screen numberpop">
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onQuit(); }} aria-label="Quit">✕</button>
        <div className="progress-dots">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`pdot ${i < index ? (round.results[i] ? 'good' : 'ok') : i === index ? 'now' : ''}`} />
          ))}
        </div>
        <button className="icon-btn speak" onClick={() => speak(q.say)} aria-label="Hear it again">🔊</button>
      </div>

      <div className="np-prompt">
        <div className="np-text">{q.prompt}</div>
        <DisplayView d={q.display} />
      </div>

      <div className={`np-bubbles n${q.options.length}`}>
        {q.options.map((o, i) => (
          <button
            key={o.id}
            className={[
              'bubble', bubbleSize,
              faded.has(o.id) ? 'faded' : '',
              wobble === o.id ? 'wobble' : '',
              popped === o.id ? 'popped' : '',
              showGlow && o.correct ? 'glow' : '',
            ].join(' ')}
            style={{
              ['--tint' as string]: o.content.kind === 'color' ? o.content.hex : BUBBLE_TINTS[i % BUBBLE_TINTS.length],
              animationDelay: `${delays[i]}s, 0s`,
            }}
            onClick={() => tapBubble(o)}
            aria-label={labelFor(o.content)}
          >
            <BubbleFace c={o.content} />
            {popped === o.id && <span className="pop-burst" />}
          </button>
        ))}
      </div>
      {cheer && <div className="cheer-pop">⭐</div>}
    </div>
  );
}

const PRAISE = ['Great job!', 'You got it!', 'Awesome!', 'Yes!', 'Super!', 'Nice popping!', 'Way to go!'];
function pickPraise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)];
}

function labelFor(c: BubbleContent): string {
  switch (c.kind) {
    case 'number': return String(c.n);
    case 'text': return c.text;
    case 'color': return c.name;
    case 'shape': return c.shape;
    case 'emoji': return c.emoji;
    case 'group': return `${c.count}`;
  }
}

function BubbleFace({ c }: { c: BubbleContent }) {
  switch (c.kind) {
    case 'number':
      return (
        <span className="bf-number">
          <span className={String(c.n).length >= 3 ? 'n3' : ''}>{c.n}</span>
          {c.dots && c.n <= 10 && <span className="bf-dots">{Array.from({ length: c.n }, (_, i) => <i key={i} />)}</span>}
        </span>
      );
    case 'text': return <span className="bf-text">{c.text}</span>;
    case 'color': return <span className="bf-color" />;
    case 'shape': return <Shape shape={c.shape} size={70} />;
    case 'emoji': return <span className="bf-emoji">{c.emoji}</span>;
    case 'group':
      return <span className={`bf-group c${Math.min(c.count, 8)}`}>{Array.from({ length: c.count }, (_, i) => <span key={i}>{c.emoji}</span>)}</span>;
  }
}

function DisplayView({ d }: { d: Display }) {
  switch (d.kind) {
    case 'none': return null;
    case 'text': return <div className="np-display-text">{d.text}</div>;
    case 'objects':
      return (
        // Rows of 5 make counting easier (like a ten-frame).
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
      return (
        <div className="ten-frame">
          {Array.from({ length: 10 }, (_, i) => <span key={i} className={i < d.filled ? 'on' : ''} />)}
        </div>
      );
  }
}
