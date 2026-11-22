import { useEffect, useState } from 'react';
import { getState, loadAll, useStore } from './data/store';
import type { Subject } from './core/types';
import type { RoundSummary } from './core/useRound';
import { Profiles } from './screens/Profiles';
import { NewKid } from './screens/NewKid';
import { Hub } from './screens/Hub';
import { SubjectMenu } from './screens/SubjectMenu';
import { Reward } from './screens/Reward';
import { GAME_COMPONENTS } from './games/registry';
import { Shop } from './screens/Shop';
import { House } from './screens/House';
import { Wardrobe } from './screens/Wardrobe';
import { Parents } from './screens/Parents';
import { Badges } from './screens/Badges';
import { Creatures } from './screens/Creatures';
import { setMusicWanted } from './audio/music';
import { BreakTime } from './screens/BreakTime';
import { minutesLeft } from './core/report';

type Screen =
  | { name: 'profiles' }
  | { name: 'newKid' }
  | { name: 'parents' }
  | { name: 'hub' }
  | { name: 'shop' }
  | { name: 'house' }
  | { name: 'wardrobe' }
  | { name: 'badges' }
  | { name: 'break' }
  | { name: 'creatures' }
  | { name: 'subject'; subject: Subject }
  | { name: 'play'; subject: Subject; gameId: string; key: number }
  | { name: 'reward'; subject: Subject; gameId: string; summary: RoundSummary };

const LAST_KID = 'brainy.lastKid';

export function App() {
  const loaded = useStore((s) => s.loaded);
  const kids = useStore((s) => s.kids);
  const rounds = useStore((s) => s.rounds);
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

  // Calm music on the home, shop and house screens; quiet during games so prompts are clear.
  useEffect(() => {
    setMusicWanted(!['play', 'reward', 'parents'].includes(screen.name));
    // Each screen starts at the top (phones keep the old scroll position otherwise).
    window.scrollTo(0, 0);
  }, [screen.name]);

  function pickKid(id: string) {
    setKidId(id);
    try { localStorage.setItem(LAST_KID, id); } catch { /* ignore */ }
    setScreen({ name: 'hub' });
  }

  if (!loaded) return <div className="screen loading">🏠</div>;

  if (screen.name === 'parents') {
    return <Parents onDone={() => setScreen({ name: 'profiles' })} />;
  }

  if (!kid || screen.name === 'profiles' || screen.name === 'newKid') {
    if (screen.name === 'newKid' || kids.length === 0) {
      return <NewKid onDone={pickKid} onCancel={() => setScreen({ name: 'profiles' })}
        onParents={() => setScreen({ name: 'parents' })} />;
    }
    return <Profiles onPick={pickKid} onAdd={() => setScreen({ name: 'newKid' })} onParents={() => setScreen({ name: 'parents' })} />;
  }

  // Soft daily limit: the current round always finishes; new rounds wait until tomorrow.
  const timeUp = minutesLeft(kid, rounds) === 0;

  switch (screen.name) {
    case 'hub':
      return <Hub kid={kid} onSubject={(subject) => setScreen(timeUp ? { name: 'break' } : { name: 'subject', subject })} onSwitch={() => setScreen({ name: 'profiles' })}
        onGo={(t) => setScreen({ name: t } as Screen)} />;
    case 'shop':
      return <Shop kid={kid} onBack={() => setScreen({ name: 'hub' })} />;
    case 'house':
      return <House kid={kid} onBack={() => setScreen({ name: 'hub' })} onShop={() => setScreen({ name: 'shop' })} />;
    case 'break':
      return <BreakTime kid={kid} onHome={() => setScreen({ name: 'hub' })} onHouse={() => setScreen({ name: 'house' })} />;
    case 'badges':
      return <Badges kid={kid} onBack={() => setScreen({ name: 'hub' })} />;
    case 'creatures':
      return <Creatures kid={kid} onBack={() => setScreen({ name: 'hub' })} onShop={() => setScreen({ name: 'shop' })} />;
    case 'wardrobe':
      return <Wardrobe kid={kid} onBack={() => setScreen({ name: 'hub' })} onShop={() => setScreen({ name: 'shop' })} />;
    case 'subject':
      return <SubjectMenu kid={kid} subject={screen.subject} onBack={() => setScreen({ name: 'hub' })}
        onPlay={(gameId) => setScreen(timeUp ? { name: 'break' } : { name: 'play', subject: screen.subject, gameId, key: Date.now() })} />;
    case 'play': {
      const Game = GAME_COMPONENTS[screen.gameId];
      return <Game key={screen.key} kid={kid}
        onQuit={() => setScreen({ name: 'subject', subject: screen.subject })}
        onFinish={(summary) => setScreen({ name: 'reward', subject: screen.subject, gameId: screen.gameId, summary })} />;
    }
    case 'reward':
      return <Reward kid={kid} summary={screen.summary} timeUp={timeUp}
        onAgain={() => setScreen(timeUp ? { name: 'break' } : { name: 'play', subject: screen.subject, gameId: screen.gameId, key: Date.now() })}
        onHome={() => setScreen({ name: 'hub' })} />;
  }
}
