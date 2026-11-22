import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { useKidProgress } from '../data/derived';
import { balances } from '../core/economy';
import { SUBJECTS } from '../core/subjects';
import { THEME_BY_ID } from '../core/themes';
import type { Kid, Subject } from '../core/types';
import { ITEM_BY_ID } from '../shop/catalog';
import { goalProgress } from '../shop/logic';
import { currentPrice, ensureStarter } from '../shop/actions';
import { Avatar } from '../ui/Avatar';
import { KidAvatar } from '../ui/KidAvatar';
import { House } from '../ui/House';
import { ItemArt } from '../ui/ItemArt';
import { WalletBar } from '../ui/Wallet';
import { Gifts } from './Gifts';
import { sfx } from '../audio/sfx';
import { speak } from '../audio/speech';
import { setAudioSetting, useAudioSetting } from '../audio/settings';

export type HubTarget = 'shop' | 'house' | 'wardrobe' | 'badges' | 'creatures';

export function Hub({ kid, onSubject, onSwitch, onGo }: { kid: Kid; onSubject: (s: Subject) => void; onSwitch: () => void; onGo: (t: HubTarget) => void }) {
  const ledger = useStore((s) => s.ledger);
  const wallet = useMemo(() => balances(ledger.filter((e) => e.kidId === kid.id)), [ledger, kid.id]);
  const { level, streak, quest, pending, newBadges } = useKidProgress(kid);
  const theme = THEME_BY_ID[kid.favoriteTheme];
  const goal = kid.goalItemId ? ITEM_BY_ID[kid.goalItemId] : undefined;
  const progress = goal ? goalProgress(wallet, currentPrice(kid, goal.id)) : 0;
  const [gifts, setGifts] = useState(false);
  const music = useAudioSetting('music');

  useEffect(() => { ensureStarter(kid); }, [kid]);

  const go = (t: HubTarget) => () => { sfx.tap(); onGo(t); };

  return (
    <div className="screen hub" style={{ background: `linear-gradient(180deg, #bfe3ff 0%, ${theme.bg} 55%, ${theme.bg} 100%)` }}>
      <div className="topbar">
        <div className="topbar-left">
          <button className="player-chip" onClick={() => { sfx.tap(); onSwitch(); }} aria-label="Switch player">
            <Avatar config={kid.avatar} size={34} />
            <span>{kid.name}</span>
          </button>
          <button className="level-chip" onClick={go('badges')} aria-label={`Level ${level.level}`}>
            <span className="level-star">⭐<b>{level.level}</b></span>
            <span className="xp-bar small"><span style={{ width: `${level.progress * 100}%` }} /></span>
          </button>
          <button className={`streak-chip ${streak.playedToday ? 'lit' : ''}`} onClick={() => {
            sfx.tap();
            speak(streak.current === 0 ? 'Play today to start a streak!' : streak.playedToday ? `${streak.current} days in a row! Great job!` : `You have a ${streak.current} day streak. Play today to keep it going!`);
          }} aria-label="Streak">🔥 {streak.current}</button>
        </div>
        <div className="topbar-right">
          <button className="icon-btn music-btn" onClick={() => setAudioSetting('music', !music)} aria-label={music ? 'Music off' : 'Music on'}>{music ? '🎵' : '🔇'}</button>
          <WalletBar wallet={wallet} />
        </div>
      </div>

      <button className={`quest ${quest.done ? 'done' : ''}`} onClick={() => { sfx.tap(); if (quest.done && pending.some((p) => p.kind === 'quest')) setGifts(true); else speak(quest.say); }}>
        <span className="quest-label">📜 Today’s quest</span>
        <span className="quest-text">{quest.text}</span>
        <span className="quest-bar"><span style={{ width: `${(quest.progress / quest.goal) * 100}%` }} /></span>
        <span className="quest-count">{quest.done ? '✅' : `${quest.progress}/${quest.goal}`}</span>
      </button>

      <div className="hub-scene">
        <div className="sun" />
        <button className="hub-house" onClick={go('house')} aria-label="My house"><House name={kid.name} accent={theme.accent} /></button>
        <button className="hub-kid bob" onClick={go('wardrobe')} aria-label="My closet"><KidAvatar kid={kid} size={110} /></button>
        {pending.length > 0 && (
          <button className="present wiggle" onClick={() => { sfx.shake(); setGifts(true); }} aria-label="Open presents">
            🎁<span className="present-count">{pending.length}</span>
          </button>
        )}
        <div className="hub-left">
          <button className="hub-sign shop" onClick={go('shop')}>🛍️ Shop</button>
          {goal ? (
            <button className="goal-card" onClick={go('shop')}>
              <span className="goal-label">⭐ Saving for</span>
              <ItemArt item={goal} size={54} />
              <span className="goal-bar"><span style={{ width: `${Math.round(progress * 100)}%` }} /></span>
              {progress >= 1 && <span className="goal-ready">Ready to buy!</span>}
            </button>
          ) : null}
        </div>
        <div className="hub-right">
          <button className="hub-sign" onClick={go('house')}>🏠 My House</button>
          <button className="hub-sign" onClick={go('wardrobe')}>👕 Closet</button>
          <button className="hub-sign" onClick={go('badges')}>🏅 Badges{newBadges.length > 0 && <span className="dot-new">{newBadges.length}</span>}</button>
          <button className="hub-sign" onClick={go('creatures')}>📖 Creatures</button>
        </div>
      </div>

      <div className="subject-row">
        {SUBJECTS.map((s) => (
          <button key={s.id} className="subject-tile" style={{ background: s.color }} onClick={() => { sfx.tap(); onSubject(s.id); }}>
            <span className="subject-emoji">{s.emoji}</span>
            <span className="subject-name">{s.name}</span>
          </button>
        ))}
      </div>
      {gifts && <Gifts kid={kid} pending={pending} onClose={() => setGifts(false)} />}
    </div>
  );
}
