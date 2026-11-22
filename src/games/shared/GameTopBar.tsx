import { sfx } from '../../audio/sfx';

export function GameTopBar({ total, index, results, onQuit, onSpeak }: {
  total: number; index: number; results: boolean[]; onQuit: () => void; onSpeak?: () => void;
}) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={() => { sfx.tap(); onQuit(); }} aria-label="Quit">✕</button>
      <div className="progress-dots">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`pdot ${i < index ? (results[i] ? 'good' : 'ok') : i === index ? 'now' : ''}`} />
        ))}
      </div>
      {onSpeak ? <button className="icon-btn speak" onClick={onSpeak} aria-label="Hear it again">🔊</button> : <span style={{ width: 64 }} />}
    </div>
  );
}
