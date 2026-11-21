# Learning Game App — Project Plan

**Goal:** One app for three siblings, played on their Android tablets, full of short learning
games from **preschool through 5th grade**. Every subject pays out its own currency. Kids spend it
in a shop to dress up a character and decorate a house, which gives them a reason to keep playing.
Progress lives in the cloud, so it follows each kid to new devices as they grow.

---

## 0. Players (drives priorities)

| Player | Grade now (2026–27) | What that means for the app |
|---|---|---|
| **Oldest** | 2nd | Reads short instructions; needs 2nd-grade content now and 3rd grade by next fall |
| **Middle** | Kindergarten | Pre-reader to early reader; everything spoken aloud, tap-to-answer |
| **Youngest** | Preschool | Non-reader; fully audio-driven, huge tap targets, no failure states at all |

(Names are entered in the app at profile setup and are never stored in this repo.)

**Content priority:** Pre-K, K and 2nd grade first (one per kid). Then 1st and 3rd (next year's
grades for the two older kids), then 4th and 5th. The app grows with them.

**Devices:** Android tablets (primary, installed from Chrome as a home-screen app) and a parent
iPhone for testing (Safari → Add to Home Screen).

---

## 1. Concept at a glance

```
          ┌──────────── Hub World (each kid's house + town) ───────────┐
          │                                                            │
   Learning games ──earn──▶  Subject currencies  ──spend──▶  Shop  ──▶  Character & House
   (Math, Reading,           (Coins, Stars, Gems,          (6 themed      (wear it, place it,
    Spelling, Science,        Leaves, Puzzle Pieces)        collections)    show it off)
    Logic, World)
          │                                                            │
          └── Progress synced to the cloud · streaks · badges · adaptive grade level ──┘
```

### Subjects and their currencies

| Subject | Currency | What it mostly buys | Example games |
|---|---|---|---|
| Math | 🪙 Coins | Furniture & house upgrades | Number Pop, Make Ten, Times-Table Racer, Fraction Pizza |
| Reading / Phonics | ⭐ Stars | Clothes & accessories | Letter Sounds, Word Builder, Sight-Word Splash, Story Quiz |
| Spelling & Vocabulary | 💎 Gems | Pets & companion creatures | Spelling Bee, Word Match, Rhyme Time |
| Science | 🍃 Leaves | Garden, yard & outdoor items | Sort It (living/non-living), Weather Lab, Body Parts, States of Matter |
| **Logic Puzzles** | 🧩 Puzzle Pieces | Toys, collectibles & display shelves | Pattern Train, Shape Sudoku, Maze Robot, Logic Grid Detective |
| Social Studies / Geography (later) | 🧭 Compass Shards | Room themes, wallpaper | Map Explorer, Community Helpers, Flags & Continents |

Making each currency buy a *different* category is what pushes kids to play every subject instead
of only their favorite. A few "premium" items cost a mix of currencies.

**Logic puzzles by level:**
- **Pre-K/K:** matching, sorting by color/shape, "what comes next" patterns, simple mazes
- **1–2:** 4×4 picture sudoku, longer patterns, path-planning ("move the robot 3 right, 2 up")
- **3–5:** 6×6 sudoku, logic-grid mysteries, coding-style command sequences, tangrams

### Themes (shop collections)

Each kid likes different things, so the shop is organized into **six themed collections**. Every
collection has items in every category (clothes, furniture, pets, garden, toys), so any kid can
build a house in their favorite style, or mix and match.

| Collection | Flavor |
|---|---|
| 🐾 **Animal Friends** | Cute animal pets, animal-ear hats, treehouse and barn furniture |
| 🍡 **Squishy Squad** | Soft pastel squishy characters, squishy-shaped beanbags, kawaii decor |
| 🎀 **Dollhouse Dreams** | Doll outfits, fancy dresses, canopy beds, vanity, tea sets |
| ⚽ **Sports Stars** | Jerseys, balls, trophies, mini goal, locker-room furniture |
| ⚡ **Creature Catchers** | *Our own* collectible pocket monsters to catch, evolve and display (elemental types, trading-card shelf) |
| 🧱 **Brick Builders** | Blocky building-brick furniture, minifigure-style outfits, build-your-own items |

> **Note on Pokémon & LEGO:** those are trademarked brands, so we can't use their names,
> characters or look. "Creature Catchers" and "Brick Builders" are **original** themes that
> capture what kids love about them (collecting and evolving creatures; snapping blocks together)
> with our own creatures and art.

Each kid also picks a **favorite theme** at setup, which styles their hub and starter items.

### Grade bands

Every game has **7 levels of content, Pre-K, K, 1, 2, 3, 4, 5**, with sub-levels inside each. The
game starts at the kid's grade and **moves up or down by itself** based on accuracy (e.g. 3 right
in a row moves up, 2 misses moves down).

Content follows the usual US grade expectations (Common Core-style), e.g. for Math:
- **Pre-K:** colors, shapes, counting to 10, more/less, matching
- **K:** counting to 20, comparing quantities, adding within 5
- **1:** adding and subtracting within 20, place value to 100
- **2:** within 100/1000, telling time, money
- **3:** times tables, intro to fractions, area
- **4:** multi-digit multiplication, equivalent fractions, decimals
- **5:** fraction operations, volume, order of operations

**Audio for pre-readers:** every prompt is spoken, every answer can be picked by tapping a
picture, and there's a big "hear it again" button. Pre-K mode never shows a "wrong" screen; it
just gently tries again.

---

## 2. Deliverables

| # | Deliverable | Description |
|---|---|---|
| D1 | **Game Design Doc** | Subjects, currencies, economy numbers, shop catalog per theme, skill map per grade, art direction |
| D2 | **App shell** | Installable web app (PWA): hub screen, navigation, works offline, installs on Android and iPhone |
| D3 | **Family account & cloud sync** | One parent login. Kid profiles inside it, chosen by tapping their picture (no kid passwords). Progress saved on the device and synced to the cloud, so a new tablet just signs in and everything is there |
| D4 | **Game framework** | Shared engine every mini-game plugs into: question generator, adaptive difficulty, rewards, voice prompts, sound, celebration effects |
| D5 | **Mini-games, Wave 1** | 1–2 games each for Math, Reading, Spelling, Science, Logic at Pre-K, K, 2 |
| D6 | **Economy & Shop** | Five wallets, prices, shop UI with theme collections, buying, daily deals |
| D7 | **Character creator & wardrobe** | Build a character, equip the clothes and accessories they buy |
| D8 | **House builder** | Rooms on a grid, drag-and-drop furniture, wallpaper/floors, unlock extra rooms |
| D9 | **Motivation layer** | Daily streaks, badges, level-ups, daily quest, surprise gifts, creature collection book |
| D10 | **Parent progress report** | PIN-locked area: where each kid is per subject and skill, trend over time, time played. Viewable from the parent's phone thanks to sync |
| D11 | **Art & audio pack** | Characters, six themed item sets, backgrounds, sound effects, music, voice prompts |
| D12 | **Content expansion** | Grades 1 and 3 next, then 4–5; Social Studies; more games per subject |
| D13 | **Release** | Hosted URL installed to each tablet's home screen; app-store builds optional later |
| D14 | **Testing** | Automated tests for content and saving, playtests with the kids, Android tablet and iPhone checks |

---

## 3. Recommended tech approach

- **Web app built as a PWA** (Progressive Web App): one codebase. On Android tablets, Chrome
  offers "Install app," which makes it a real home-screen app that runs full-screen and offline. On the
  iPhone, use Safari's "Add to Home Screen."
- **TypeScript + React + Vite** for screens (hub, shop, house, parent area), and lightweight
  **Canvas/SVG + CSS animations** inside games.
- **Cloud sync via Supabase** (recommended; free tier covers a family easily): parent email login,
  database of kid profiles, wallets, inventory, house layout and per-skill progress. The app works
  **offline first**. It saves on the device and syncs when online, so a tablet with spotty Wi-Fi
  never loses a session. (Alternative: Firebase. Same idea.)
- **Hosting:** a free static host (Cloudflare Pages or Netlify) at a URL each tablet installs from.
  Updates deploy automatically, and the tablets pick them up next launch.
- **Voice:** start with the browser's built-in text-to-speech (works offline on Android). Later,
  swap in recorded or generated voice clips for a friendlier, consistent voice.
- **Touch-first UI:** big tap targets (≥ 64px for Pre-K/K), no typing for Pre-K–2, portrait and landscape.
- **Content as data:** questions, word lists and puzzles live in JSON or generators, so adding a
  grade is mostly adding data.
- **Later:** wrap with **Capacitor** for a Google Play build if ever wanted.

---

## 4. Attack plan, step by step

Each phase ends with something the kids can actually play, so we get their feedback early.

### Phase 0: Decisions & design ✅ answers in, design doc next
1. ~~Agree on plan, answer open questions.~~ Done.
2. Write the Game Design Doc (D1): final currency list, starter shop catalog (~10 items per theme
   to start), price curve, skill list for Pre-K, K and 2.
3. Pick an art style: bright, friendly, flat vector that can flex across all six themes.

### Phase 1: Foundation (playable skeleton)
4. Set up the project: Vite + React + TS, PWA manifest, offline service worker, tests, auto-deploy.
5. Kid profiles (local first): name, grade, favorite theme.
6. Hub screen with a placeholder house and a button for each subject.
7. Shared game framework (D4): rounds of about 8–10 questions (shorter for Pre-K), adaptive
   difficulty, spoken prompts, reward screen with confetti.
8. **Milestone:** one Math game end-to-end at Pre-K, K and 2. All three kids can play and earn Coins.
   Installed on one tablet to try.

### Phase 2: Core loop + cloud
9. Family account and cloud sync (D3). This comes early, so nothing has to be migrated later.
10. Shop (D6) with starter items from all six themes.
11. Character creator and wardrobe (D7).
12. House builder (D8): one room, place and move furniture, change wallpaper and floor.
13. **Milestone:** play → earn → buy → decorate, synced. Install on all three tablets.

### Phase 3: All subjects (Wave 1 content)
14. Reading/Phonics (Stars): letter sounds for the two youngest, reading quizzes for the oldest.
15. Spelling/Vocabulary (Gems).
16. Science (Leaves).
17. Logic Puzzles (Puzzle Pieces).
18. **Milestone:** 5 subjects × 5 currencies, solid at Pre-K, K and 2.

### Phase 4: Make it sticky
19. Daily streaks, daily quest ("play 2 subjects today"), badges, player level.
20. Creature Catchers collection book (catch and evolve creatures by playing), pets with animations.
21. Unlockable rooms and house exterior/yard.
22. Juice pass: sounds, music, animations, character reactions.
23. Economy tuning: rewards high enough to buy something small every session, with big goals that take about a week.

### Phase 5: Progress report & polish
24. Parent progress report (D10): per kid, per subject, skill-by-skill "mastered / practicing /
    not started," accuracy trend, time played.
25. Accessibility: text size, colorblind-safe colors, mute toggles, reduced motion.
26. Device testing: Android tablets (primary) and iPhone Safari. Fix layout and performance.
27. **Milestone: v1.0** installed on all three tablets.

### Phase 6: Grow with them
28. Grade 1 and 3 content (ready before the two older kids move up), then 4–5.
29. Social Studies/Geography, more games per subject, seasonal shop items.
30. Optional Google Play build.

---

## 5. Design principles (to keep it fun, not homework)

- **Short rounds** (2–4 min, about 1–2 min for Pre-K) that always end with a reward.
- **No punishment for wrong answers:** a gentle hint, then try again. You never lose currency.
- **Always something to save up for:** visible "next goal" item on the hub.
- **Choice:** the kid picks the subject, while daily quests nudge them toward variety.
- **Ownership:** their character, their house, their name on the door, their favorite theme.
- **Fair between siblings:** rewards scale with difficulty, so the preschooler earns as fast as
  the 2nd grader. Nobody falls behind in the shop for being younger.
- **Celebrate:** sound, confetti and character dances for streaks and level-ups.
- **Healthy limits:** no ads, no real-money purchases, no chat or online contact with others.
- **Privacy:** kids' names and progress live only in the family's own cloud account, never in source code.

---

## 6. Remaining decisions

1. **Cloud backend:** Supabase (recommended) or Firebase. Needs a free account in the parent's name.
2. **Hosting:** Cloudflare Pages or Netlify (both free). Same: a parent-owned account.
3. **App name:** to choose with the kids!
