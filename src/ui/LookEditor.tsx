import type { AvatarConfig } from '../core/types';
import { Avatar, HAIR_COLORS, HAIR_STYLES, SHIRT_COLORS, SKIN_TONES } from './Avatar';
import { sfx } from '../audio/sfx';
import type { Wear } from '../shop/catalog';

export function LookEditor({ avatar, onChange, wear, showShirt = true }: { avatar: AvatarConfig; onChange: (a: AvatarConfig) => void; wear?: Wear; showShirt?: boolean }) {
  return (
    <div className="look-row">
      <div className="look-preview"><Avatar config={avatar} size={150} wear={wear} /></div>
      <div className="look-options">
        <Swatches label="Skin" values={SKIN_TONES} value={avatar.skin} onPick={(v) => onChange({ ...avatar, skin: v })} />
        <div className="swatch-row">
          <span className="swatch-label">Hair</span>
          {Array.from({ length: HAIR_STYLES }, (_, i) => (
            <button key={i} className={`hair-btn ${avatar.hairStyle === i ? 'sel' : ''}`} onClick={() => { sfx.tap(); onChange({ ...avatar, hairStyle: i }); }}>
              <Avatar config={{ ...avatar, hairStyle: i }} size={40} />
            </button>
          ))}
        </div>
        <Swatches label="Color" values={HAIR_COLORS} value={avatar.hairColor} onPick={(v) => onChange({ ...avatar, hairColor: v })} />
        {showShirt && <Swatches label="Shirt" values={SHIRT_COLORS} value={avatar.shirt} onPick={(v) => onChange({ ...avatar, shirt: v })} />}
      </div>
    </div>
  );
}

function Swatches({ label, values, value, onPick }: { label: string; values: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="swatch-row">
      <span className="swatch-label">{label}</span>
      {values.map((v) => (
        <button key={v} className={`swatch ${v === value ? 'sel' : ''}`} style={{ background: v }} aria-label={v} onClick={() => { sfx.tap(); onPick(v); }} />
      ))}
    </div>
  );
}
