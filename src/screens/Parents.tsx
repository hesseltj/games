import { useMemo, useState } from 'react';
import { useStore, saveKid } from '../data/store';
import { signIn, signOut, signUp, syncNow } from '../data/syncManager';
import { GRADES, GRADE_LABEL, type Grade } from '../core/types';
import { Avatar } from '../ui/Avatar';
import { sfx } from '../audio/sfx';
import { setAudioSetting, useAudioSetting } from '../audio/settings';

export function Parents({ onDone }: { onDone: () => void }) {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <div className="screen parents">
      <div className="topbar">
        <button className="icon-btn" onClick={() => { sfx.tap(); onDone(); }} aria-label="Back">←</button>
        <h1 className="title small">⚙️ Grown-ups</h1>
        <span style={{ width: 64 }} />
      </div>
      {unlocked ? <ParentPanel /> : <GrownUpGate onPass={() => setUnlocked(true)} />}
    </div>
  );
}

/** A quick check that keeps little ones out of the settings. */
function GrownUpGate({ onPass }: { onPass: () => void }) {
  const [a, b] = useMemo(() => [6 + Math.floor(Math.random() * 4), 6 + Math.floor(Math.random() * 4)], []);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  function press(k: string) {
    sfx.tap();
    setWrong(false);
    if (k === '⌫') return setValue((v) => v.slice(0, -1));
    const next = (value + k).slice(0, 3);
    setValue(next);
    if (next.length >= String(a * b).length) {
      if (Number(next) === a * b) onPass();
      else { setWrong(true); setValue(''); }
    }
  }
  return (
    <div className="panel gate">
      <h2>Grown-ups only</h2>
      <p className="gate-q">What is {a} × {b}?</p>
      <div className={`gate-answer ${wrong ? 'wrong' : ''}`}>{value || ' '}</div>
      <div className="keypad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
          k ? <button key={i} onClick={() => press(k)}>{k}</button> : <span key={i} />
        ))}
      </div>
    </div>
  );
}

function ParentPanel() {
  const sync = useStore((s) => s.sync);
  const kids = useStore((s) => s.kids);
  return (
    <div className="parent-panel">
      <section className="card">
        <h3>☁️ Cloud backup</h3>
        {!sync.configured ? (
          <p>Cloud backup isn’t set up yet. Progress is saved on this device only. See <b>docs/CLOUD_SETUP.md</b> in the project to turn it on.</p>
        ) : sync.email ? (
          <SignedIn />
        ) : (
          <SignInForm />
        )}
      </section>
      <section className="card">
        <h3>👧 Players</h3>
        {kids.length === 0 && <p>No players on this device yet.</p>}
        {kids.map((k) => (
          <div key={k.id} className="kid-row">
            <Avatar config={k.avatar} size={44} />
            <b className="kid-row-name">{k.name}</b>
            <label>
              Grade{' '}
              <select value={k.grade} onChange={(e) => saveKid({ ...k, grade: e.target.value as Grade, updatedAt: Date.now() })}>
                {GRADES.map((g) => <option key={g} value={g}>{GRADE_LABEL[g]}</option>)}
              </select>
            </label>
          </div>
        ))}
        <p className="hint">Games still adjust up and down on their own; the grade is where they start.</p>
      </section>
      <SoundSettings />
    </div>
  );
}

function SignedIn() {
  const sync = useStore((s) => s.sync);
  const label = {
    off: 'Off', idle: 'Up to date ✓', syncing: 'Saving…', offline: 'Offline. Will save when back online', error: 'Problem saving',
  }[sync.state];
  return (
    <>
      <p>Signed in as <b>{sync.email}</b></p>
      <p>Status: <b>{label}</b>{sync.lastSyncedAt && <> · last saved {new Date(sync.lastSyncedAt).toLocaleTimeString()}</>}</p>
      {sync.error && sync.state === 'error' && <p className="err">{sync.error}</p>}
      <div className="row">
        <button className="small-btn" onClick={() => syncNow(true)}>Sync now</button>
        <button className="small-btn alt" onClick={() => { if (confirm('Sign out of cloud backup on this device? Progress stays on the device.')) signOut(); }}>Sign out</button>
      </div>
    </>
  );
}

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function go(kind: 'in' | 'up') {
    setBusy(true);
    setMsg(null);
    if (kind === 'in') {
      const err = await signIn(email.trim(), password);
      if (err) setMsg(err);
    } else {
      const r = await signUp(email.trim(), password);
      if (r.error) setMsg(r.error);
      else if (r.needsConfirm) setMsg('Check your email to confirm the account, then sign in here.');
    }
    setBusy(false);
  }

  return (
    <>
      <p>Sign in with your family account to back up progress and use it on other devices. Use the same account on every tablet.</p>
      <div className="form">
        <input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" autoComplete="current-password" placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {msg && <p className="err">{msg}</p>}
      <div className="row">
        <button className="small-btn" disabled={busy || !email || password.length < 6} onClick={() => go('in')}>Sign in</button>
        <button className="small-btn alt" disabled={busy || !email || password.length < 6} onClick={() => go('up')}>Create family account</button>
      </div>
    </>
  );
}

function SoundSettings() {
  const music = useAudioSetting('music');
  const sounds = useAudioSetting('sounds');
  return (
    <section className="card">
      <h3>🔊 Sound on this device</h3>
      <label className="toggle"><input type="checkbox" checked={music} onChange={(e) => setAudioSetting('music', e.target.checked)} /> Background music</label>
      <label className="toggle"><input type="checkbox" checked={sounds} onChange={(e) => setAudioSetting('sounds', e.target.checked)} /> Sound effects</label>
      <p className="hint">Spoken instructions always stay on, since younger kids need them to play. Use the tablet’s volume buttons to make them quieter.</p>
    </section>
  );
}
