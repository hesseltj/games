import type { Kid } from '../core/types';
import { ITEM_BY_ID, type Wear } from '../shop/catalog';
import { useStore } from '../data/store';
import { Avatar } from './Avatar';
import { ItemArt } from './ItemArt';
import { useCreatureStage } from '../data/derived';

export function wearFor(kid: Kid, override?: { hat?: string | null; outfit?: string | null }): Wear {
  const hatId = override && 'hat' in override ? override.hat : kid.equipped?.hat;
  const outfitId = override && 'outfit' in override ? override.outfit : kid.equipped?.outfit;
  return {
    hat: hatId ? ITEM_BY_ID[hatId]?.wear?.hat : undefined,
    outfit: outfitId ? ITEM_BY_ID[outfitId]?.wear?.outfit : undefined,
  };
}

/** The kid's character wearing their equipped clothes, with their buddy pet beside them. */
export function KidAvatar({ kid, size = 120, mood, buddy = true }: { kid: Kid; size?: number; mood?: 'happy' | 'cheer'; buddy?: boolean }) {
  const inventory = useStore((s) => s.inventory);
  const buddyItem = buddy && kid.equipped?.buddy ? ITEM_BY_ID[inventory.find((i) => i.id === kid.equipped?.buddy)?.itemId ?? ''] : undefined;
  const { stage } = useCreatureStage(kid.equipped?.buddy);
  return (
    <span className="kid-avatar">
      <Avatar config={kid.avatar} size={size} mood={mood} wear={wearFor(kid)} />
      {buddyItem && <span className="buddy hop"><ItemArt item={buddyItem} size={size * (0.5 + (stage - 1) * 0.08)} stage={stage} /></span>}
    </span>
  );
}
