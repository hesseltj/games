import type { Currency, ThemeId } from '../core/types';

export type Category = 'furniture' | 'clothes' | 'pets' | 'outdoor' | 'toys' | 'decor';
export type Price = Partial<Record<Currency, number>>;

export type HatKind = 'cap' | 'beanie' | 'crown' | 'tiara' | 'ears' | 'helmet' | 'bow' | 'explorer' | 'witch';
export type CreatureKind = 'sparkit' | 'puddlepup' | 'sproutle' | 'embertail' | 'pebblet' | 'glimmerwing';

export interface Wear {
  hat?: { kind: HatKind; color: string; color2?: string };
  outfit?: { shirt: string; emblem?: string; skirt?: string; legs?: string };
}

export interface CatalogItem {
  id: string;
  name: string;
  theme: ThemeId | 'basic' | 'seasonal';
  category: Category;
  price: Price;
  /** Main picture. */
  emoji: string;
  /** Small corner badge that gives a generic emoji its theme flavor. */
  badge?: string;
  /** Original creature drawn as SVG instead of an emoji. */
  creature?: CreatureKind;
  /** Rug drawn as a colored oval on the floor. */
  rug?: string;
  /** Clothes: what it looks like on the character. */
  wear?: Wear;
  /** Where it can be placed in a room. Clothes can't be placed. */
  layer?: 'floor' | 'wall' | 'rug';
  /** Relative size in a room (1 = normal chair-sized). */
  size?: number;
  /** Clothes and pets: own at most one. */
  unique?: boolean;
  /** Seasonal items are only for sale during their season (kids keep them forever). */
  season?: SeasonId;
}

export type SeasonId = 'fall' | 'halloween' | 'winter' | 'valentine' | 'spring' | 'summer';
export interface Season { id: SeasonId; name: string; emoji: string; from: string; to: string }

/** Month-day ranges, inclusive. Halloween overlaps fall on purpose. */
export const SEASONS: Season[] = [
  { id: 'fall', name: 'Fall Harvest', emoji: '🍂', from: '09-15', to: '11-30' },
  { id: 'halloween', name: 'Halloween', emoji: '🎃', from: '10-01', to: '10-31' },
  { id: 'winter', name: 'Winter Wonderland', emoji: '❄️', from: '12-01', to: '01-31' },
  { id: 'valentine', name: 'Valentine’s', emoji: '💝', from: '02-01', to: '02-20' },
  { id: 'spring', name: 'Spring Bloom', emoji: '🌷', from: '03-01', to: '05-31' },
  { id: 'summer', name: 'Summer Fun', emoji: '🏖️', from: '06-01', to: '08-31' },
];

export function seasonsOn(date: Date): Season[] {
  const md = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return SEASONS.filter((s) => (s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to));
}

/** Room backgrounds. Owned like items but bought from the Rooms tab. */
export interface Backdrop {
  id: string;
  kind: 'wallpaper' | 'floor';
  name: string;
  css: string;
  price: Price;
}

const f = (id: string, name: string, theme: CatalogItem['theme'], emoji: string, coins: number, extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({ id, name, theme, category: 'furniture', price: { coins }, emoji, layer: 'floor', size: 1, ...extra });
const c = (id: string, name: string, theme: CatalogItem['theme'], emoji: string, stars: number, wear: Wear): CatalogItem =>
  ({ id, name, theme, category: 'clothes', price: { stars }, emoji, wear, unique: true });
const p = (id: string, name: string, theme: CatalogItem['theme'], emoji: string, gems: number, extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({ id, name, theme, category: 'pets', price: { gems }, emoji, layer: 'floor', size: 0.8, unique: true, ...extra });
const o = (id: string, name: string, theme: CatalogItem['theme'], emoji: string, leaves: number, extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({ id, name, theme, category: 'outdoor', price: { leaves }, emoji, layer: 'floor', size: 1.2, ...extra });
const d = (id: string, name: string, emoji: string, shards: number, extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({ id, name, theme: 'basic', category: 'decor', price: { shards }, emoji, layer: 'floor', size: 1, ...extra });
const s = (id: string, name: string, season: SeasonId, category: Category, emoji: string, price: Price, extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({
    id, name, theme: 'seasonal', season, category, price, emoji,
    layer: category === 'clothes' ? undefined : 'floor', size: category === 'outdoor' ? 1.2 : category === 'toys' ? 0.7 : category === 'pets' ? 0.8 : 1,
    unique: category === 'clothes' || category === 'pets', ...extra,
  });
const t = (id: string, name: string, theme: CatalogItem['theme'], emoji: string, pieces: number, extra: Partial<CatalogItem> = {}): CatalogItem =>
  ({ id, name, theme, category: 'toys', price: { pieces }, emoji, layer: 'floor', size: 0.7, ...extra });

export const ITEMS: CatalogItem[] = [
  // ---- Basics (starter set + cheap staples) ----
  f('basic_bed', 'Comfy bed', 'basic', '🛏️', 60, { size: 1.8 }),
  f('basic_lamp', 'Lamp', 'basic', '💡', 15, { size: 0.7 }),
  f('basic_rug_blue', 'Blue rug', 'basic', '', 20, { rug: '#7aa5ff', layer: 'rug', size: 2.2 }),
  f('basic_rug_pink', 'Pink rug', 'basic', '', 20, { rug: '#ff9fc4', layer: 'rug', size: 2.2 }),
  f('basic_chair', 'Chair', 'basic', '🪑', 20),
  f('basic_couch', 'Couch', 'basic', '🛋️', 70, { size: 1.8 }),
  f('basic_plant', 'Potted plant', 'basic', '🪴', 25),
  f('basic_books', 'Book stack', 'basic', '📚', 20, { size: 0.7 }),
  f('basic_tv', 'TV', 'basic', '📺', 80, { size: 1.2 }),
  f('basic_window', 'Window', 'basic', '🪟', 30, { layer: 'wall', size: 1.3 }),
  f('basic_picture', 'Picture', 'basic', '🖼️', 25, { layer: 'wall' }),
  f('basic_clock', 'Clock', 'basic', '🕰️', 25, { layer: 'wall', size: 0.8 }),
  f('basic_mirror', 'Mirror', 'basic', '🪞', 30, { layer: 'wall' }),
  f('basic_fridge', 'Fridge', 'basic', '🧊', 60, { size: 1.6, badge: '🥛' }),
  f('basic_table', 'Table', 'basic', '🍽️', 40, { size: 1.2 }),
  c('basic_tee', 'Plain tee', 'basic', '👕', 0, { outfit: { shirt: '#3b82f6' } }),
  c('basic_cap_red', 'Red cap', 'basic', '🧢', 15, { hat: { kind: 'cap', color: '#ef4444' } }),
  c('basic_beanie', 'Cozy beanie', 'basic', '🧶', 15, { hat: { kind: 'beanie', color: '#22c55e', color2: '#fff' } }),
  o('basic_tree', 'Tree', 'basic', '🌳', 20, { size: 1.8 }),
  o('basic_flowers', 'Flowers', 'basic', '🌷', 10, { size: 0.7 }),
  o('basic_bench', 'Bench', 'basic', '🪵', 25),

  // ---- 🐾 Animal Friends ----
  f('af_bed_doghouse', 'Puppy-house bed', 'animals', '🛏️', 180, { badge: '🐶', size: 1.8 }),
  f('af_shelf_tree', 'Tree-branch bookshelf', 'animals', '📚', 80, { badge: '🌿', size: 1.2 }),
  c('af_hat_bunny', 'Bunny-ear headband', 'animals', '🐰', 30, { hat: { kind: 'ears', color: '#ffffff', color2: '#ffb3c7' } }),
  c('af_outfit_tiger', 'Tiger onesie', 'animals', '🐯', 100, { outfit: { shirt: '#fb923c', emblem: '🐯', legs: '#fb923c' } }),
  p('af_pet_kitten', 'Kitten', 'animals', '🐱', 90),
  p('af_pet_pony', 'Pony', 'animals', '🐴', 280, { size: 1.3 }),
  o('af_yard_birdhouse', 'Birdhouse', 'animals', '🐦', 40, { badge: '🏠' }),
  o('af_yard_barn', 'Little red barn', 'animals', '🛖', 250, { size: 2.4, badge: '🐮' }),
  t('af_toy_plush', 'Plush animal pile', 'animals', '🧸', 35),
  t('af_toy_ark', 'Animal ark playset', 'animals', '⛵', 150, { badge: '🦒', size: 1 }),

  // ---- 🍡 Squishy Squad ----
  f('sq_chair_bean', 'Squishy beanbag', 'squishy', '🛋️', 90, { badge: '💗', size: 1.1 }),
  f('sq_lamp_cloud', 'Cloud lamp', 'squishy', '☁️', 40, { layer: 'wall', badge: '✨' }),
  c('sq_hat_bun', 'Bun-shaped beanie', 'squishy', '🍡', 30, { hat: { kind: 'beanie', color: '#f9c6dd', color2: '#fff4b8' } }),
  c('sq_outfit_pastel', 'Pastel hoodie set', 'squishy', '🧁', 90, { outfit: { shirt: '#c7b8ff', emblem: '🧁', legs: '#ffc7e0' } }),
  p('sq_pet_mochi', 'Mochi blob buddy', 'squishy', '🍙', 80),
  p('sq_pet_cat', 'Squishy cloud cat', 'squishy', '😺', 220, { badge: '☁️' }),
  o('sq_yard_flowers', 'Marshmallow flower bed', 'squishy', '🌸', 50, { size: 0.9 }),
  o('sq_yard_pool', 'Jelly kiddie pool', 'squishy', '🌊', 200, { size: 1.8, badge: '🍮' }),
  t('sq_toy_squishies', 'Squishy collection jar', 'squishy', '🍯', 30, { badge: '🍡' }),
  t('sq_toy_machine', 'Squishy capsule machine', 'squishy', '🎰', 180, { size: 1.2, badge: '🍬' }),

  // ---- 🎀 Dollhouse Dreams ----
  f('dd_bed_canopy', 'Canopy bed', 'dolls', '🛏️', 450, { badge: '👑', size: 2 }),
  f('dd_vanity', 'Vanity with mirror', 'dolls', '🪞', 120, { badge: '💄', size: 1.3 }),
  c('dd_hat_tiara', 'Sparkle tiara', 'dolls', '👑', 40, { hat: { kind: 'tiara', color: '#ffd23f', color2: '#f472b6' } }),
  c('dd_outfit_gown', 'Ball gown', 'dolls', '👗', 150, { outfit: { shirt: '#f472b6', skirt: '#f9a8d4', emblem: '💖' } }),
  p('dd_pet_poodle', 'Fancy poodle', 'dolls', '🐩', 120),
  p('dd_pet_unicorn', 'Unicorn', 'dolls', '🦄', 400, { size: 1.3 }),
  o('dd_yard_gazebo', 'Garden gazebo', 'dolls', '⛩️', 220, { size: 2, badge: '🌸' }),
  o('dd_yard_roses', 'Rose bushes', 'dolls', '🌹', 40, { size: 0.9 }),
  t('dd_toy_teaset', 'Tea party set', 'dolls', '🫖', 60),
  t('dd_toy_dollhouse', 'Mini dollhouse', 'dolls', '🏡', 200, { size: 1.2 }),

  // ---- ⚽ Sports Stars ----
  f('sp_bed_locker', 'Locker-room bunk', 'sports', '🛏️', 200, { badge: '🏅', size: 1.8 }),
  f('sp_rug_field', 'Soccer-field rug', 'sports', '', 50, { rug: '#4ade80', layer: 'rug', size: 2.4 }),
  c('sp_hat_cap', 'Team cap', 'sports', '🧢', 25, { hat: { kind: 'cap', color: '#1d4ed8', color2: '#facc15' } }),
  c('sp_outfit_jersey', 'Jersey & shorts', 'sports', '🎽', 80, { outfit: { shirt: '#ef4444', emblem: '⚽', legs: '#ffffff' } }),
  p('sp_pet_puppy', 'Fetch puppy', 'sports', '🐕', 100),
  p('sp_pet_eagle', 'Mascot eagle', 'sports', '🦅', 250),
  o('sp_yard_hoop', 'Basketball hoop', 'sports', '🏀', 120, { badge: '🥅', size: 1.5 }),
  o('sp_yard_goal', 'Soccer goal', 'sports', '🥅', 90, { size: 1.6 }),
  t('sp_toy_balls', 'Ball basket', 'sports', '🧺', 35, { badge: '⚾' }),
  t('sp_toy_trophy', 'Trophy case', 'sports', '🏆', 150, { price: { coins: 300, pieces: 150 }, size: 1.1 }),

  // ---- ⚡ Creature Catchers (original creatures) ----
  f('cc_bed_capsule', 'Capture-capsule bed', 'creatures', '🛏️', 220, { badge: '⚡', size: 1.8 }),
  f('cc_shelf_cards', 'Creature-card display wall', 'creatures', '🃏', 100, { layer: 'wall', badge: '✨', size: 1.2 }),
  c('cc_hat_trainer', 'Explorer cap', 'creatures', '🧢', 30, { hat: { kind: 'explorer', color: '#ef4444', color2: '#ffffff' } }),
  c('cc_outfit_trainer', 'Explorer jacket & backpack', 'creatures', '🎒', 110, { outfit: { shirt: '#14b8a6', emblem: '⚡', legs: '#1e3a8a' } }),
  p('cc_pet_sparkit', 'Sparkit', 'creatures', '', 120, { creature: 'sparkit' }),
  p('cc_pet_puddlepup', 'Puddlepup', 'creatures', '', 120, { creature: 'puddlepup' }),
  o('cc_yard_habitat', 'Creature habitat pond', 'creatures', '🏞️', 180, { size: 1.8 }),
  o('cc_yard_nest', 'Sproutle egg nest', 'creatures', '', 140, { creature: 'sproutle', unique: true }),
  p('cc_pet_embertail', 'Embertail', 'creatures', '', 150, { creature: 'embertail' }),
  p('cc_pet_pebblet', 'Pebblet', 'creatures', '', 150, { creature: 'pebblet' }),
  p('cc_pet_glimmerwing', 'Glimmerwing', 'creatures', '', 180, { creature: 'glimmerwing' }),
  t('cc_toy_cards', 'Creature-card pack', 'creatures', '🎴', 40),
  t('cc_toy_arena', 'Toy battle arena', 'creatures', '🏟️', 220, { size: 1.4 }),

  // ---- 🧱 Brick Builders ----
  f('bb_bed_brick', 'Brick-built bed', 'bricks', '🛏️', 180, { badge: '🧱', size: 1.8 }),
  f('bb_table_build', 'Building table', 'bricks', '🧱', 90, { badge: '🔧', size: 1.2 }),
  c('bb_hat_helmet', 'Blocky hard hat', 'bricks', '⛑️', 30, { hat: { kind: 'helmet', color: '#facc15' } }),
  c('bb_outfit_figure', 'Blocky-figure costume', 'bricks', '🧱', 100, { outfit: { shirt: '#e8553e', emblem: '🧱', legs: '#2563eb' } }),
  p('bb_pet_robodog', 'Brick robo-dog', 'bricks', '🤖', 140, { badge: '🐕' }),
  p('bb_pet_dragon', 'Brick dragon', 'bricks', '🐉', 350, { size: 1.4, badge: '🧱' }),
  o('bb_yard_castle', 'Brick castle tower', 'bricks', '🏰', 300, { size: 2.2 }),
  o('bb_yard_tree', 'Blocky tree', 'bricks', '🌲', 40, { size: 1.6, badge: '🟩' }),
  t('bb_toy_bin', 'Brick bin', 'bricks', '🪣', 30, { badge: '🧱' }),
  t('bb_toy_rocket', 'Brick rocket kit', 'bricks', '🚀', 160, { size: 1.1 }),

  // ---- 🧭 Explorer decor (bought with Compass Shards from the World subject) ----
  d('ex_globe', 'Spinning globe', '🌍', 60, { size: 0.9 }),
  d('ex_map', 'World map poster', '🗺️', 40, { layer: 'wall', size: 1.3 }),
  d('ex_telescope', 'Telescope', '🔭', 120, { size: 1.1 }),
  d('ex_vase', 'Ancient vase', '🏺', 80),
  d('ex_statue', 'Stone head statue', '🗿', 150, { size: 1.3 }),
  d('ex_ship', 'Ship in a bottle', '🚢', 90, { badge: '🍾', size: 0.9 }),
  d('ex_compass', 'Giant compass', '🧭', 50, { size: 0.9 }),
  d('ex_flags', 'Flag banner', '🎏', 30, { layer: 'wall' }),
  d('ex_balloon', 'Hot-air balloon model', '🎈', 70, { badge: '🧺' }),
  d('ex_tent', 'Explorer’s tent', '⛺', 140, { size: 1.6 }),
  { id: 'ex_hat', name: 'Safari hat', theme: 'basic', category: 'clothes', price: { shards: 60 }, emoji: '👒', unique: true, wear: { hat: { kind: 'explorer', color: '#c8a26b', color2: '#8b5e3c' } } },
  { id: 'ex_outfit', name: 'Explorer vest', theme: 'basic', category: 'clothes', price: { shards: 120 }, emoji: '🦺', unique: true, wear: { outfit: { shirt: '#c8a26b', emblem: '🧭', legs: '#5b4632' } } },

  // ---- Seasonal (only sold during the season) ----
  s('sea_fall_pumpkin', 'Pumpkin patch', 'fall', 'outdoor', '🎃', { leaves: 40 }, { size: 1 }),
  s('sea_fall_leaves', 'Leaf pile', 'fall', 'outdoor', '🍂', { leaves: 30 }),
  s('sea_fall_turkey', 'Turkey plush', 'fall', 'toys', '🦃', { pieces: 45 }),
  s('sea_fall_pie', 'Apple pie', 'fall', 'furniture', '🥧', { coins: 30 }, { size: 0.7 }),
  s('sea_fall_corn', 'Corn wreath', 'fall', 'furniture', '🌽', { coins: 35 }, { layer: 'wall', badge: '🍁' }),
  { ...s('sea_fall_sweater', 'Cozy fall sweater', 'fall', 'clothes', '🧥', { stars: 70 }), wear: { outfit: { shirt: '#c2410c', emblem: '🍁', legs: '#5b4632' } } },
  s('sea_hw_ghost', 'Friendly ghost', 'halloween', 'toys', '👻', { pieces: 40 }),
  s('sea_hw_web', 'Spider web', 'halloween', 'furniture', '🕸️', { coins: 25 }, { layer: 'wall' }),
  s('sea_hw_bat', 'Pet bat', 'halloween', 'pets', '🦇', { gems: 90 }),
  s('sea_hw_candy', 'Candy bowl', 'halloween', 'toys', '🍬', { pieces: 25 }, { badge: '🍫' }),
  { ...s('sea_hw_hat', 'Witch hat', 'halloween', 'clothes', '🧙', { stars: 50 }), wear: { hat: { kind: 'witch', color: '#4c1d95', color2: '#f59e0b' } } },
  s('sea_win_snowman', 'Snowman', 'winter', 'outdoor', '⛄', { leaves: 60 }, { size: 1.4 }),
  s('sea_win_tree', 'Holiday tree', 'winter', 'furniture', '🎄', { coins: 120 }, { size: 1.8 }),
  s('sea_win_gifts', 'Pile of presents', 'winter', 'toys', '🎁', { pieces: 50 }),
  s('sea_win_lights', 'Snowflake lights', 'winter', 'furniture', '❄️', { coins: 30 }, { layer: 'wall' }),
  s('sea_win_reindeer', 'Reindeer', 'winter', 'pets', '🦌', { gems: 150 }, { size: 1.2 }),
  { ...s('sea_win_hat', 'Snowy pom-pom hat', 'winter', 'clothes', '🧶', { stars: 40 }), wear: { hat: { kind: 'beanie', color: '#dc2626', color2: '#ffffff' } } },
  s('sea_val_balloon', 'Heart balloon', 'valentine', 'toys', '💝', { pieces: 30 }),
  s('sea_val_bear', 'Love bear', 'valentine', 'toys', '🧸', { pieces: 45 }, { badge: '💖' }),
  s('sea_val_art', 'Heart art', 'valentine', 'furniture', '💌', { coins: 30 }, { layer: 'wall' }),
  { ...s('sea_val_shirt', 'Heart sweater', 'valentine', 'clothes', '💗', { stars: 60 }), wear: { outfit: { shirt: '#f472b6', emblem: '💝' } } },
  s('sea_spr_tulips', 'Tulip garden', 'spring', 'outdoor', '🌷', { leaves: 35 }),
  s('sea_spr_chick', 'Spring chick', 'spring', 'pets', '🐣', { gems: 80 }),
  s('sea_spr_rainbow', 'Rainbow art', 'spring', 'furniture', '🌈', { coins: 40 }, { layer: 'wall' }),
  s('sea_spr_butterflies', 'Butterfly garden', 'spring', 'outdoor', '🦋', { leaves: 70 }, { badge: '🌼' }),
  { ...s('sea_spr_hat', 'Flower crown', 'spring', 'clothes', '🌸', { stars: 45 }), wear: { hat: { kind: 'tiara', color: '#86efac', color2: '#f472b6' } } },
  s('sea_sum_umbrella', 'Beach umbrella', 'summer', 'outdoor', '🏖️', { leaves: 60 }, { size: 1.4 }),
  s('sea_sum_icecream', 'Ice cream cart', 'summer', 'outdoor', '🍦', { leaves: 80 }, { size: 1.2 }),
  s('sea_sum_flamingo', 'Flamingo float', 'summer', 'outdoor', '🦩', { leaves: 50 }),
  s('sea_sum_shells', 'Seashell collection', 'summer', 'toys', '🐚', { pieces: 35 }),
  { ...s('sea_sum_outfit', 'Beach outfit', 'summer', 'clothes', '🩱', { stars: 60 }), wear: { outfit: { shirt: '#22d3ee', emblem: '🌊', legs: '#facc15' } } },
];

export const SEASONAL_ITEMS = ITEMS.filter((i) => i.season);

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i])) as Record<string, CatalogItem>;

export const BACKDROPS: Backdrop[] = [
  { id: 'wall_cream', kind: 'wallpaper', name: 'Cream', css: '#fff4dc', price: {} },
  { id: 'wall_sky', kind: 'wallpaper', name: 'Sky blue', css: '#d6ecff', price: {} },
  { id: 'wall_stripes', kind: 'wallpaper', name: 'Candy stripes', css: 'repeating-linear-gradient(90deg, #ffe0ec 0 28px, #fff4f8 28px 56px)', price: { coins: 30 } },
  { id: 'wall_dots', kind: 'wallpaper', name: 'Polka dots', css: 'radial-gradient(circle, #c7b8ff 6px, transparent 7px) 0 0 / 40px 40px, #f3efff', price: { coins: 30 } },
  { id: 'wall_mint', kind: 'wallpaper', name: 'Mint', css: '#dcfce7', price: { coins: 20 } },
  { id: 'wall_stars', kind: 'wallpaper', name: 'Night stars', css: 'radial-gradient(circle, #ffe27a 3px, transparent 4px) 0 0 / 46px 46px, radial-gradient(circle, #fff 2px, transparent 3px) 23px 23px / 46px 46px, #243b7a', price: { coins: 50 } },
  { id: 'wall_bricks', kind: 'wallpaper', name: 'Brick wall', css: 'repeating-linear-gradient(0deg, #f1c6b8 0 2px, transparent 2px 30px), repeating-linear-gradient(90deg, #f1c6b8 0 2px, #ffe3d9 2px 60px)', price: { coins: 40 } },
  { id: 'floor_wood', kind: 'floor', name: 'Wood', css: 'repeating-linear-gradient(90deg, #d9a066 0 60px, #c98f55 60px 62px)', price: {} },
  { id: 'floor_carpet', kind: 'floor', name: 'Blue carpet', css: '#9cb8f0', price: {} },
  { id: 'floor_tiles', kind: 'floor', name: 'Checker tiles', css: 'repeating-conic-gradient(#ffffff 0 25%, #e2e8f0 0 50%) 0 0 / 60px 60px', price: { coins: 30 } },
  { id: 'floor_grass', kind: 'floor', name: 'Indoor grass', css: 'repeating-linear-gradient(90deg, #6bbf59 0 6px, #5aae49 6px 12px)', price: { coins: 40 } },
  { id: 'floor_pink', kind: 'floor', name: 'Pink fluffy', css: '#ffc7de', price: { coins: 30 } },
  { id: 'wall_worldmap', kind: 'wallpaper', name: 'World map', css: 'radial-gradient(ellipse 60px 34px at 30% 35%, #9bd08a 98%, transparent) , radial-gradient(ellipse 46px 60px at 70% 60%, #9bd08a 98%, transparent), radial-gradient(ellipse 30px 20px at 82% 25%, #9bd08a 98%, transparent), #8fc7f0', price: { shards: 60 } },
  { id: 'wall_castle', kind: 'wallpaper', name: 'Castle stones', css: 'repeating-linear-gradient(0deg, #8a8f9e 0 3px, transparent 3px 34px), repeating-linear-gradient(90deg, #8a8f9e 0 3px, #c3c7d1 3px 70px)', price: { shards: 50 } },
  { id: 'wall_ocean', kind: 'wallpaper', name: 'Ocean waves', css: 'radial-gradient(circle at 50% 100%, transparent 14px, #5bb8e8 15px 18px, transparent 19px) 0 0 / 40px 22px, #bfe6fb', price: { shards: 50 } },
  { id: 'floor_stone', kind: 'floor', name: 'Stone path', css: 'radial-gradient(circle at 30% 40%, #b7b2a6 30%, transparent 32%) 0 0 / 48px 48px, radial-gradient(circle at 70% 70%, #a8a296 26%, transparent 28%) 0 0 / 48px 48px, #d6d1c4', price: { shards: 40 } },
];

export const BACKDROP_BY_ID = Object.fromEntries(BACKDROPS.map((b) => [b.id, b])) as Record<string, Backdrop>;

export type RoomType = 'bedroom' | 'yard' | 'living' | 'playroom' | 'kitchen';

export interface RoomInfo {
  type: RoomType;
  name: string;
  emoji: string;
  price: Price;
  outdoor?: boolean;
}

export const ROOMS: RoomInfo[] = [
  { type: 'bedroom', name: 'Bedroom', emoji: '🛏️', price: {} },
  { type: 'yard', name: 'Yard', emoji: '🌳', price: {}, outdoor: true },
  { type: 'living', name: 'Living Room', emoji: '🛋️', price: { coins: 300, stars: 75 } },
  { type: 'playroom', name: 'Playroom', emoji: '🧸', price: { coins: 300, pieces: 75 } },
  { type: 'kitchen', name: 'Kitchen', emoji: '🍳', price: { coins: 300, gems: 75 } },
];

export const ROOM_BY_TYPE = Object.fromEntries(ROOMS.map((r) => [r.type, r])) as Record<RoomType, RoomInfo>;

/** Items every new kid starts with. */
export const STARTER_ITEMS = ['basic_bed', 'basic_lamp', 'basic_rug_blue', 'basic_tee', 'basic_tree'];
export const STARTER_THEME_ITEM: Record<ThemeId, string> = {
  animals: 'af_hat_bunny', squishy: 'sq_hat_bun', dolls: 'dd_hat_tiara', sports: 'sp_hat_cap', creatures: 'cc_hat_trainer', bricks: 'bb_hat_helmet',
};
export const FREE_BACKDROPS = BACKDROPS.filter((b) => Object.keys(b.price).length === 0).map((b) => b.id);

export function placeable(item: CatalogItem, room: RoomInfo): boolean {
  if (item.category === 'clothes') return false;
  if (room.outdoor) return item.category === 'outdoor' || item.category === 'pets';
  return item.category !== 'outdoor';
}
