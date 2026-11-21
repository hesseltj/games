# Game Design Document (D1)

Companion to [PLAN.md](PLAN.md). This doc says **what** we're building in enough detail to start
coding Phase 1. Numbers here are starting points; we'll tune them after watching the kids play.

Working title: **"Brainy Town"** (placeholder until the kids pick a name).

---

## 1. The core loop

```
 Hub (my house) ──▶ pick a subject ──▶ pick a game ──▶ play a round (1–4 min)
      ▲                                                     │
      │                                                     ▼
 decorate / dress up ◀── shop ◀── currency + surprise ◀── reward screen
```

A **round** is the basic unit of play:

| Grade band | Questions per round | Target length |
|---|---|---|
| Pre-K | 5 | ~1–2 min |
| K–1 | 8 | ~2–3 min |
| 2–5 | 10 | ~3–4 min |

Every finished round ends on the **reward screen**: currency counts up with a coin-shower sound,
the character cheers, and the progress bar toward the kid's "next goal" item fills.

---

## 2. Economy

### 2.1 Currencies

| Currency | Earned in | Buys (category) |
|---|---|---|
| 🪙 Coins | Math | Furniture & room unlocks |
| ⭐ Stars | Reading / Phonics | Clothes & accessories |
| 💎 Gems | Spelling & Vocabulary | Pets & creatures |
| 🍃 Leaves | Science | Garden, yard & outdoor |
| 🧩 Puzzle Pieces | Logic Puzzles | Toys & collectibles |

### 2.2 Earning (per round)

The same for every grade, so the youngest earns as fast as the oldest:

| Source | Amount |
|---|---|
| Finishing a round | **10** |
| Each answer right on the first try | **+1** (so +5 to +10) |
| Perfect round (all first-try) | **+5** bonus |
| First round of a subject today | **+5** "welcome back" bonus |
| **Typical round** | **~18–25** |

Other income:
- **Daily quest** (e.g. "Play 2 different subjects"): +25 of the kid's *least-earned* currency and a
  mystery gift box (random small item, never a duplicate).
- **Streak days:** day 3, 7, 14 and 30 give a free themed item.
- **Level-up** (player XP from all rounds): a free item and a new hub decoration.

Wrong answers **never cost currency**. A round can't be "failed"; the worst outcome is
earning only the base 10.

### 2.3 Price tiers

Kids play ~3–5 rounds a session (~60–100 currency spread over subjects).

| Tier | Price | Feels like | Examples |
|---|---|---|---|
| Small | 20–40 | "I can get one today" | hat, poster, small toy |
| Medium | 60–120 | 1–2 sessions | outfit, chair, basic pet |
| Large | 150–300 | ~a week | bed, big pet, swing set |
| Premium | 400–600 *or mixed* | a big goal | canopy bed, evolved creature, trophy case |
| Room unlock | 500 Coins + 100 of one other | milestone | Living room, Playroom, Yard |

Mixed-currency items (e.g. 150 🪙 + 100 ⭐) are the main reason to keep playing *all* subjects.

### 2.4 Shop behavior
- Tabs by **currency/category** (furniture, clothes, pets, garden, toys) and a filter by **theme**.
- **Daily Deal:** one item 30% off each day. It's chosen from the kid's favorite theme.
- **"Next goal" pin:** the kid taps ⭐ on an item to pin it to the hub with a progress bar.
- Items you can't afford yet are still shown, with "Need 12 more 🪙", never hidden.
- Free **starter set** for each kid at setup: basic bed, lamp, rug, outfit and 1 item from their favorite theme.

---

## 3. Shop catalog: starter set (60 items)

10 items per theme: 2 per category. IDs are what the code will use.

### 🐾 Animal Friends
| ID | Item | Category | Price |
|---|---|---|---|
| af_bed_doghouse | Puppy-house bed | Furniture | 180 🪙 |
| af_shelf_tree | Tree-branch bookshelf | Furniture | 80 🪙 |
| af_hat_bunny | Bunny-ear headband | Clothes | 30 ⭐ |
| af_outfit_tiger | Tiger onesie | Clothes | 100 ⭐ |
| af_pet_kitten | Kitten | Pet | 90 💎 |
| af_pet_pony | Pony | Pet | 280 💎 |
| af_yard_birdhouse | Birdhouse | Outdoor | 40 🍃 |
| af_yard_barn | Little red barn | Outdoor | 250 🍃 |
| af_toy_plush | Plush animal pile | Toy | 35 🧩 |
| af_toy_ark | Animal ark playset | Toy | 150 🧩 |

### 🍡 Squishy Squad
| ID | Item | Category | Price |
|---|---|---|---|
| sq_chair_bean | Squishy beanbag | Furniture | 90 🪙 |
| sq_lamp_cloud | Cloud lamp | Furniture | 40 🪙 |
| sq_hat_bun | Bun-shaped beanie | Clothes | 30 ⭐ |
| sq_outfit_pastel | Pastel hoodie set | Clothes | 90 ⭐ |
| sq_pet_mochi | Mochi blob buddy | Pet | 80 💎 |
| sq_pet_cat | Squishy cloud cat | Pet | 220 💎 |
| sq_yard_flowers | Marshmallow flower bed | Outdoor | 50 🍃 |
| sq_yard_pool | Jelly kiddie pool | Outdoor | 200 🍃 |
| sq_toy_squishies | Squishy collection jar | Toy | 30 🧩 |
| sq_toy_machine | Squishy capsule machine | Toy | 180 🧩 |

### 🎀 Dollhouse Dreams
| ID | Item | Category | Price |
|---|---|---|---|
| dd_bed_canopy | Canopy bed | Furniture | 450 🪙 (premium) |
| dd_vanity | Vanity with mirror | Furniture | 120 🪙 |
| dd_hat_tiara | Sparkle tiara | Clothes | 40 ⭐ |
| dd_outfit_gown | Ball gown | Clothes | 150 ⭐ |
| dd_pet_poodle | Fancy poodle | Pet | 120 💎 |
| dd_pet_unicorn | Unicorn | Pet | 400 💎 (premium) |
| dd_yard_gazebo | Garden gazebo | Outdoor | 220 🍃 |
| dd_yard_roses | Rose bushes | Outdoor | 40 🍃 |
| dd_toy_teaset | Tea party set | Toy | 60 🧩 |
| dd_toy_dollhouse | Mini dollhouse | Toy | 200 🧩 |

### ⚽ Sports Stars
| ID | Item | Category | Price |
|---|---|---|---|
| sp_bed_locker | Locker-room bunk | Furniture | 200 🪙 |
| sp_rug_field | Soccer-field rug | Furniture | 50 🪙 |
| sp_hat_cap | Team cap | Clothes | 25 ⭐ |
| sp_outfit_jersey | Jersey & shorts | Clothes | 80 ⭐ |
| sp_pet_puppy | Fetch puppy | Pet | 100 💎 |
| sp_pet_eagle | Mascot eagle | Pet | 250 💎 |
| sp_yard_hoop | Basketball hoop | Outdoor | 120 🍃 |
| sp_yard_goal | Soccer goal | Outdoor | 90 🍃 |
| sp_toy_balls | Ball basket | Toy | 35 🧩 |
| sp_toy_trophy | Trophy case | Toy | 300 🪙 + 150 🧩 (premium, mixed) |

### ⚡ Creature Catchers (original creatures)
| ID | Item | Category | Price |
|---|---|---|---|
| cc_bed_capsule | Capture-capsule bed | Furniture | 220 🪙 |
| cc_shelf_cards | Creature-card display wall | Furniture | 100 🪙 |
| cc_hat_trainer | Explorer cap | Clothes | 30 ⭐ |
| cc_outfit_trainer | Explorer jacket & backpack | Clothes | 110 ⭐ |
| cc_pet_sparkit | **Sparkit** (zappy mouse-fox, ⚡ type) | Pet | 120 💎 |
| cc_pet_puddlepup | **Puddlepup** (bubbly water pup, 💧 type) | Pet | 120 💎 |
| cc_yard_habitat | Creature habitat pond | Outdoor | 180 🍃 |
| cc_yard_nest | **Sproutle** egg nest (leafy turtle, 🌱 type) | Outdoor | 140 🍃 |
| cc_toy_cards | Creature-card booster pack | Toy | 40 🧩 |
| cc_toy_arena | Toy battle arena | Toy | 220 🧩 |

**Evolution:** each creature has 3 stages. A creature evolves after the kid finishes **15 rounds**
and then **40 rounds** (any subject) while it's their "buddy," following them in the hub. This
gives a long-term goal that doesn't cost currency. More creatures (Embertail 🔥, Pebblet 🪨,
Glimmerwing ✨) arrive in Phase 4.

### 🧱 Brick Builders
| ID | Item | Category | Price |
|---|---|---|---|
| bb_bed_brick | Brick-built bed | Furniture | 180 🪙 |
| bb_table_build | Building table | Furniture | 90 🪙 |
| bb_hat_helmet | Blocky hard hat | Clothes | 30 ⭐ |
| bb_outfit_figure | Blocky-figure costume | Clothes | 100 ⭐ |
| bb_pet_robodog | Brick robo-dog | Pet | 140 💎 |
| bb_pet_dragon | Brick dragon | Pet | 350 💎 |
| bb_yard_castle | Brick castle tower | Outdoor | 300 🍃 |
| bb_yard_tree | Blocky tree | Outdoor | 40 🍃 |
| bb_toy_bin | Brick bin | Toy | 30 🧩 |
| bb_toy_rocket | Brick rocket kit | Toy | 160 🧩 |

**Brick Builders bonus (Phase 4):** some items come as kits. The kid snaps the pieces together
in a mini drag-and-drop build before it's placed.

### Basics (no theme)
Free/cheap wallpapers, floors, windows, plain furniture (10–40 🪙) and skin-tone, hair and eye
options in the character creator (always free).

---

## 4. Skill maps (Wave 1 grades: Pre-K, K, 2)

Each skill has an ID used for progress tracking. A skill is **mastered** when the kid gets
≥ 80% first-try correct over their last 20 questions on it, across at least 2 different days.

### 4.1 Math (🪙)
| Grade | Skill IDs & description |
|---|---|
| Pre-K | `m.pk.colors` name/match colors · `m.pk.shapes` circle/square/triangle/rectangle · `m.pk.count5` count objects 1–5 · `m.pk.count10` count 1–10 · `m.pk.moreless` which group has more |
| K | `m.k.count20` count to 20 · `m.k.numrec` recognize numerals 0–20 · `m.k.compare` greater/less/equal · `m.k.add5` add within 5 · `m.k.sub5` subtract within 5 · `m.k.make10` pairs that make 10 · `m.k.shapes3d` cube/sphere/cone |
| 2 | `m.2.add20` fluent add/sub within 20 · `m.2.add100` add/sub within 100 · `m.2.place1000` place value to 1000 · `m.2.skip` skip count 2s/5s/10s/100s · `m.2.time` time to 5 minutes · `m.2.money` count coins & bills · `m.2.evenodd` even/odd · `m.2.measure` measure length |

### 4.2 Reading / Phonics (⭐)
| Grade | Skill IDs & description |
|---|---|
| Pre-K | `r.pk.letters` recognize uppercase letters · `r.pk.name` find letters in own name · `r.pk.rhyme` hear rhymes · `r.pk.firstsound` beginning sounds (picture → sound) |
| K | `r.k.lower` lowercase letters · `r.k.sounds` letter → sound · `r.k.cvc` blend CVC words (c-a-t) · `r.k.sight1` sight words (the, a, I, see, can…) · `r.k.syllables` clap syllables |
| 2 | `r.2.vowels` long/short vowels & vowel teams · `r.2.digraphs` sh/ch/th/wh · `r.2.sight2` grade-2 sight words · `r.2.compound` compound words · `r.2.comprehend` short passage → who/what/where/why · `r.2.prefix` un-/re- prefixes |

### 4.3 Spelling & Vocabulary (💎)
| Grade | Skill IDs & description |
|---|---|
| Pre-K | `s.pk.picwords` picture vocabulary (tap the "apple") · `s.pk.opposites` big/small, up/down · `s.pk.categories` which belong together (fruits, animals) |
| K | `s.k.spellcvc` spell CVC words from tiles · `s.k.picwords` more vocab · `s.k.opposites` opposites |
| 2 | `s.2.spell` grade-2 spelling list (tiles, then keyboard) · `s.2.synonyms` same meaning · `s.2.antonyms` opposites · `s.2.plurals` -s/-es/irregular · `s.2.contractions` can't, I'm, it's |

### 4.4 Science (🍃)
| Grade | Skill IDs & description |
|---|---|
| Pre-K | `sc.pk.animals` animal names & sounds · `sc.pk.senses` five senses · `sc.pk.weather` sunny/rainy/snowy · `sc.pk.bodyparts` body parts |
| K | `sc.k.living` living vs. non-living · `sc.k.needs` what plants & animals need · `sc.k.weather` weather & what to wear · `sc.k.pushpull` push and pull |
| 2 | `sc.2.matter` solid/liquid/gas · `sc.2.habitats` animals & habitats · `sc.2.lifecycle` life cycles (butterfly, frog, plant) · `sc.2.earth` land & water forms · `sc.2.pollinate` seeds & pollination |

### 4.5 Logic Puzzles (🧩)
| Grade | Skill IDs & description |
|---|---|
| Pre-K | `l.pk.match` match identical pictures · `l.pk.sort` sort by color/size · `l.pk.pattern` AB patterns · `l.pk.maze` simple mazes |
| K | `l.k.pattern` AAB/ABC patterns · `l.k.oddone` which one doesn't belong · `l.k.memory` memory flip (6–8 cards) · `l.k.maze` bigger mazes |
| 2 | `l.2.sudoku4` 4×4 picture sudoku · `l.2.robot` robot path (arrow commands) · `l.2.sequence` number/shape sequences · `l.2.memory` memory flip (12–16 cards) · `l.2.tangram` simple tangrams |

---

## 5. Wave 1 games

Each game is a **mode of the shared framework**: it gets a skill and difficulty from the
framework, shows questions, and reports results back. One game can serve many grades.

| Game | Subject | Grades | How it plays |
|---|---|---|---|
| **Number Pop** | Math | Pre-K–2 | Bubbles float up holding numbers, shapes or colors. The prompt is spoken ("Pop the 7!", "Pop 8 + 5!"). Tap the right bubble. Pre-K counts objects in bubbles. |
| **Bake Shop** | Math | K–2 | A customer orders: "I want 4 cupcakes," "That's 65¢." Drag items into the box or coins onto the counter. Covers counting, adding, money, place value (boxes of 10/100). |
| **Letter Lagoon** | Reading | Pre-K–K | Fish carry letters. "Catch the fish that says /b/!" Covers letter names, letter sounds, beginning sounds with pictures. |
| **Word Builder** | Reading | K–2 | See a picture and hear a word; drag letter tiles into slots. K: CVC. 2: digraphs, vowel teams. Doubles as a reading game in "read it" mode. |
| **Story Spot** | Reading | 2 | A short illustrated 3–5 sentence story read aloud (optional), then 2–3 questions. |
| **Picture Words** | Spelling/Vocab | Pre-K–K | "Which one is the *carrot*?" Tap from 3–4 pictures. Opposites and categories variants. |
| **Spelling Bee Garden** | Spelling | K–2 | Hear a word and a sentence, build it from tiles. A correct word grows a flower in the garden. Grade 2 adds synonym/antonym "bee pairs." |
| **Sort It!** | Science | Pre-K–2 | Drag items into 2–3 bins (living/non-living, solid/liquid/gas, which habitat). |
| **Weather Watch** | Science | Pre-K–K | Look at the sky, pick the weather and dress the character for it. |
| **Life Cycle Line-Up** | Science | 2 | Put life-cycle stages in order. |
| **Pattern Train** | Logic | Pre-K–2 | Train cars follow a pattern; pick the next car. Grows from AB to number sequences. |
| **Robot Path** | Logic | K–2 | Get the robot to the battery. K: tap the next square. 2: plan a sequence of arrows, then press Go. |
| **Memory Flip** | Logic | Pre-K–2 | Classic pairs. Card count scales by grade; card art uses the kid's favorite theme. |
| **Picture Sudoku** | Logic | 2 | 4×4 grid with pictures instead of numbers. |

**Phase 1 builds Number Pop first.** It's the simplest mechanic and covers all three kids.

---

## 6. Adaptive difficulty

- Each skill has **difficulty steps** (e.g. `m.k.add5`: step 1 = with pictures, step 2 = numbers only,
  step 3 = timed bubbles).
- A kid's starting grade comes from their profile. Within a round, the framework picks skills
  the kid hasn't mastered at their grade, mixed with ~20% review of mastered skills.
- **Move up:** 3 first-try correct in a row on a skill → next step. Finishing the last step
  of every skill in a grade unlocks the next grade's skills.
- **Move down:** 2 misses in a row → previous step, and the next question gives a hint.
- **Hints:** 1st miss → wrong option fades out and the prompt is re-spoken. 2nd miss → the
  right answer gently glows. The question then counts as "not first try" but still finishes happily.
- The parent area can **override** the grade (e.g. a kid who's ahead in math but not reading).

---

## 7. Character

- **Body:** 6 skin tones, 3 body shapes, all free.
- **Face:** eyes (8), eyebrows, smile styles, glasses (free).
- **Hair:** 12 styles × 10 colors (free).
- **Equip slots:** hat · top · bottom (or one-piece outfit) · shoes · accessory · buddy (pet/creature that follows).
- Built as **layered SVGs** so every clothing item fits every body.
- The character appears in the hub, reacts on the reward screen (cheer, dance, high-five) and
  waves from the house window.

---

## 8. House

- Starts with **1 room (Bedroom)**. Unlockable rooms: Living Room, Playroom, Kitchen, and the
  **Yard** (outdoor items go here). Unlocks cost 500 🪙 + 100 of one other currency.
- Each room is a **side-view 2D room** (like a dollhouse cutaway) with three placement layers:
  **wall** (posters, shelves, windows), **floor** (furniture, toys, pets), **rug** (under furniture).
- Drag to place, tap to flip, long-press for "put back in storage." Items snap to a soft grid so
  nothing ends up half-buried.
- Wallpaper and floor are swappable per room.
- Pets wander their room; the buddy follows the kid between rooms.
- Siblings can **visit** each other's houses on the same family account (look only, leave a sticker
  "like"). No outside contact.

---

## 9. Motivation layer

| Feature | Rule |
|---|---|
| Daily streak | Play ≥1 round a day. Missing 1 day doesn't break it (a "freeze" refills weekly). Kids that age shouldn't lose a streak to a busy day. |
| Daily quest | 1 per day, rotating: "play 2 subjects," "get 5 perfect answers," "try a new game." |
| Badges | e.g. "First Round," "10 Perfect Rounds," "Math Master: Pre-K," one per skill-group mastered. Shown on a badge wall in the house. |
| Player level | XP = 1 per question answered. Levels every ~100 XP early, slowing later. Level-ups give an item. |
| Mystery gift | Daily quest reward. Opening animation; contents favor the kid's theme. |
| Creature evolution | See §3. Long-term goal tied to rounds played, not spending. |

---

## 10. Parent area & progress report

- **Entry:** gear icon on the profile screen → 4-digit PIN (set at family setup) or a simple
  grown-up check ("tap the number thirty-seven").
- **Per kid, per subject:**
  - Current grade level and the % of that grade's skills mastered (progress bar).
  - Skill list with status: ✅ mastered · 🔄 practicing (with accuracy %) · ⬜ not started.
  - "Needs help" callout: skills with < 60% accuracy over the last 2 weeks.
  - Trend chart: questions answered and accuracy per week.
  - Time played per day and week.
- **Settings:** grade per subject, daily time limit (soft: "Time for a break!" at the end of the
  current round), sound/music, reset a profile.
- Opens on any device signed in to the family account, including the parent iPhone.

---

## 11. Art & audio direction

- **Style:** bright, friendly, flat vector with soft rounded shapes and thick outlines.
  Theme collections have their own accent palettes:
  Animal Friends (warm greens/browns) · Squishy Squad (pastels) · Dollhouse Dreams (pinks/lavender/gold) ·
  Sports Stars (bold primaries) · Creature Catchers (electric yellow/teal/red) · Brick Builders (primary
  brick colors, chunky studs).
- **Placeholder first:** Phases 1–2 use emoji and simple SVG shapes so we can test fun before
  investing in art. Custom SVG art replaces placeholders in Phase 4.
- **Layout:** big buttons (≥ 64px for Pre-K/K, ≥ 48px for 2+), lots of whitespace, the
  hear-it-again 🔊 button always in the same corner.
- **Voice:** browser text-to-speech at first (slower rate for Pre-K/K). Later, recorded clips for
  common prompts.
- **Sound:** short, soft effects (pop, chime, coin shower). Music is calm and loops, with separate
  volume. Wrong-answer sound is a gentle "boop," never a buzzer.

---

## 12. Data model (for sync)

All data belongs to one **family account**. Records sync with the cloud using `updatedAt`
timestamps. The wallet is a **ledger** (list of earn/spend events), not a single number, so two
devices offline at the same time can never lose or duplicate currency.

```
Family        { id, parentEmail, pinHash, createdAt }
Kid           { id, familyId, name, avatarConfig, gradeBySubject, favoriteTheme, createdAt, updatedAt }
LedgerEntry   { id, kidId, currency, amount (+/-), reason, refId, createdAt }        // wallet = sum
InventoryItem { id, kidId, itemId, acquiredAt, source }                             // bought / gift / reward
Equipped      { kidId, slots: {hat, top, bottom, shoes, accessory, buddy}, updatedAt }
Room          { id, kidId, roomType, wallpaper, floor, placements: [{itemId, x, y, layer, flip}], updatedAt }
SkillProgress { kidId, skillId, step, recent: [bool x20], daysPracticed, mastered, updatedAt }
RoundLog      { id, kidId, gameId, subject, skills[], correctFirstTry, total, durationSec, earned, createdAt }
Streak        { kidId, current, best, lastPlayedDate, freezes }
CreatureState { kidId, creatureId, stage, roundsAsBuddy }
```

The progress report is computed from `SkillProgress` and `RoundLog`.

---

## 13. Phase 1 build checklist (next step)

- [ ] Vite + React + TypeScript project, ESLint, Vitest, PWA manifest + offline service worker
- [ ] Local storage layer (IndexedDB) implementing the data model above (sync comes in Phase 2)
- [ ] Profile picker and "new kid" setup (name, grade, favorite theme, starter avatar)
- [ ] Hub screen: placeholder house, character, wallets, 5 subject buttons
- [ ] Game framework: round runner, skill picker, adaptive steps, hints, TTS helper, reward screen
- [ ] **Number Pop** with question generators for `m.pk.*`, `m.k.*`, `m.2.add20`, `m.2.skip`
- [ ] Unit tests: question generators, adaptivity rules, ledger math
- [ ] Deploy preview and install on one Android tablet
