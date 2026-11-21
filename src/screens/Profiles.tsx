import { useStore } from '../data/store';
import { Avatar } from '../ui/Avatar';
import { THEME_BY_ID } from '../core/themes';
import { GRADE_LABEL } from '../core/types';
import { sfx, unlockAudio } from '../audio/sfx';

export function Profiles({ onPick, onAdd, onParents }: { onPick: (id: string) => void; onAdd: () => void; onParents: () => void }) {
  const kids = useStore((s) => s.kids);
  return (
    <div className="screen profiles">
      <h1 className="title">Who's playing?</h1>
      <div className="profile-grid">
        {kids.map((k) => (
          <button key={k.id} className="profile-card" style={{ background: THEME_BY_ID[k.favoriteTheme].bg, borderColor: THEME_BY_ID[k.favoriteTheme].accent }}
            onClick={() => { unlockAudio(); sfx.tap(); onPick(k.id); }}>
            <Avatar config={k.avatar} size={110} />
            <span className="profile-name">{k.name}</span>
            <span className="profile-sub">{THEME_BY_ID[k.favoriteTheme].emoji} {GRADE_LABEL[k.grade]}</span>
          </button>
        ))}
        <button className="profile-card add" onClick={() => { unlockAudio(); sfx.tap(); onAdd(); }}>
          <span className="add-plus">＋</span>
          <span className="profile-name">Add player</span>
        </button>
      </div>
      <button className="grownups-btn" onClick={() => { sfx.tap(); onParents(); }}>⚙️ Grown-ups</button>
    </div>
  );
}
