import { useEffect, useState } from 'react';
import { getState, loadAll, useStore } from './data/store';
import type { Subject } from './core/types';
import type { RoundSummary } from './core/useRound';
import { Profiles } from './screens/Profiles';
import { NewKid } from './screens/NewKid';
import { Hub } from './screens/Hub';
import { SubjectMenu } from './screens/SubjectMenu';
import { Reward } from './screens/Reward';
import { NumberPop } from './games/numberPop/NumberPop';

type Screen =
  | { name: 'profiles' }
  | { name: 'newKid' }
  | { name: 'hub' }
  | { name: 'subject'; subject: Subject }
  | { name: 'play'; subject: Subject; gameId: string; key: number }
  | { name: 'reward'; subject: Subject; gameId: string; summary: RoundSummary };

const LAST_KID = 'brainy.lastKid';

export function App() {
  const loaded = useStore((s) => s.loaded);
  const kids = useStore((s) => s.kids);
  const [kidId, setKidId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: 'profiles' });

  useEffect(() => {
    loadAll().then(() => {
      // Each kid usually has their own tablet: jump straight back to whoever played last.
      let last: string | null = null;
      try { last = localStorage.getItem(LAST_KID); } catch { /* ignore */ }
      if (last && getState().kids.some((k) => k.id === last)) {
        setKidId(last);
        setScreen({ name: 'hub' });
      }
    });
  }, []);

  const kid = kids.find((k) => k.id === kidId) ?? null;

  function pickKid(id: string) {
    setKidId(id);
    try { localStorage.setItem(LAST_KID, id); } catch { /* ignore */ }
    setScreen({ name: 'hub' });
  }

  if (!loaded) return <div className="screen loading">🏠</div>;

  if (!kid || screen.name === 'profiles' || screen.name === 'newKid') {
    if (screen.name === 'newKid' || kids.length === 0) {
      return <NewKid onDone={pickKid} onCancel={() => setScreen({ name: 'profiles' })} />;
    }
    return <Profiles onPick={pickKid} onAdd={() => setScreen({ name: 'newKid' })} />;
  }

  switch (screen.name) {
    case 'hub':
      return <Hub kid={kid} onSubject={(subject) => setScreen({ name: 'subject', subject })} onSwitch={() => setScreen({ name: 'profiles' })} />;
    case 'subject':
      return <SubjectMenu subject={screen.subject} onBack={() => setScreen({ name: 'hub' })}
        onPlay={(gameId) => setScreen({ name: 'play', subject: screen.subject, gameId, key: Date.now() })} />;
    case 'play':
      return <NumberPop key={screen.key} kid={kid}
        onQuit={() => setScreen({ name: 'subject', subject: screen.subject })}
        onFinish={(summary) => setScreen({ name: 'reward', subject: screen.subject, gameId: screen.gameId, summary })} />;
    case 'reward':
      return <Reward kid={kid} summary={screen.summary}
        onAgain={() => setScreen({ name: 'play', subject: screen.subject, gameId: screen.gameId, key: Date.now() })}
        onHome={() => setScreen({ name: 'hub' })} />;
  }
}
