import type { CatalogItem } from '../shop/catalog';
import { useCreatureStage } from '../data/derived';
import { ItemArt } from './ItemArt';

/** An owned item, drawn at its evolution stage if it's a creature. */
export function InvArt({ invId, item, size }: { invId: string; item: CatalogItem; size: number }) {
  const { stage } = useCreatureStage(item.creature ? invId : null);
  return <ItemArt item={item} size={size * (item.creature ? 1 + (stage - 1) * 0.12 : 1)} stage={stage} />;
}
