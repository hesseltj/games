import { useState } from 'react';
import { DEFAULT_AVATAR } from '../ui/Avatar';
import { LookEditor } from '../ui/LookEditor';
import { THEMES } from '../core/themes';
import { GRADES, GRADE_LABEL, type AvatarConfig, type Grade, type Kid, type ThemeId } from '../core/types';
import { uid } from '../core/random';
import { saveKid } from '../data/store';
import { sfx } from '../audio/sfx';

type Step = 'name' | 'grade' | 'theme' | 'look';

export function NewKid({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>('K');
  const [theme, setTheme] = useState<ThemeId>('animals');
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const tap = () => sfx.tap();

  async function finish() {
    const now = Date.now();
    const kid: Kid = { id: uid(), name: name.trim(), grade, gradeBySubject: {}, favoriteTheme: theme, avatar, createdAt: now, updatedAt: now };
    await saveKid(kid);
    onDone(kid.id);
  }

  return (
    <div className="screen newkid">
      <div className="topbar">
        <button className="icon-btn" onClick={() => (step === 'name' ? onCancel() : setStep(({ grade: 'name', theme: 'grade', look: 'theme' } as const)[step]))} aria-label="Back">←</button>
        <div className="steps">{(['name', 'grade', 'theme', 'look'] as Step[]).map((s) => <span key={s} className={s === step ? 'dot on' : 'dot'} />)}</div>
        <span style={{ width: 56 }} />
      </div>

      {step === 'name' && (
        <div className="panel">
          <h2>What's your name?</h2>
          <input className="name-input" value={name} maxLength={14} autoFocus placeholder="Type a name"
            onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep('grade')} />
          <button className="big-btn" disabled={!name.trim()} onClick={() => { tap(); setStep('grade'); }}>Next →</button>
        </div>
      )}

      {step === 'grade' && (
        <div className="panel">
          <h2>What grade are you in?</h2>
          <div className="choice-grid">
            {GRADES.map((g) => (
              <button key={g} className={`choice ${grade === g ? 'sel' : ''}`} onClick={() => { tap(); setGrade(g); }}>{GRADE_LABEL[g]}</button>
            ))}
          </div>
          <button className="big-btn" onClick={() => { tap(); setStep('theme'); }}>Next →</button>
        </div>
      )}

      {step === 'theme' && (
        <div className="panel">
          <h2>Pick your favorite!</h2>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <button key={t.id} className={`theme-card ${theme === t.id ? 'sel' : ''}`} style={{ background: t.bg, borderColor: theme === t.id ? t.accent : 'transparent' }}
                onClick={() => { tap(); setTheme(t.id); }}>
                <span className="theme-emoji">{t.emoji}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
          <button className="big-btn" onClick={() => { tap(); setStep('look'); }}>Next →</button>
        </div>
      )}

      {step === 'look' && (
        <div className="panel look">
          <h2>Make your character</h2>
          <LookEditor avatar={avatar} onChange={setAvatar} />
          <button className="big-btn go" onClick={() => { sfx.fanfare(); finish(); }}>All done! 🎉</button>
        </div>
      )}
    </div>
  );
}
