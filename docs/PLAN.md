# Learning Game App — Project Plan

**Goal:** One app for the kids, playable on tablets and phones, full of short learning games
from kindergarten through 5th grade. Every subject pays out its own currency. Kids spend it in
a shop to dress up a character and decorate a house, which gives them a reason to keep playing.

---

## 1. Concept at a glance

```
          ┌──────────── Hub World (the kid's house + town) ────────────┐
          │                                                            │
   Learning games ──earn──▶  Subject currencies  ──spend──▶  Shop  ──▶  Character & House
   (Math, Reading,           (Coins, Stars,                (clothes,     (wear it, place it,
    Spelling, Science,        Gems, Leaves, …)              furniture,     show it off)
    World)                                                  pets, rooms)
          │                                                            │
          └──── Progress, streaks, badges, grade-level adaptivity ─────┘
```

### Subjects and their currencies (first pass)

| Subject | Currency | What it mostly buys | Example games |
|---|---|---|---|
| Math | 🪙 Coins | Furniture & house upgrades | Number Pop, Make Ten, Times-Table Racer, Fraction Pizza |
| Reading / Phonics | ⭐ Stars | Clothes & accessories | Letter Sounds, Word Builder, Sight-Word Splash, Story Quiz |
| Spelling & Vocabulary | 💎 Gems | Pets & pet gear | Spelling Bee, Word Match, Rhyme Time |
| Science | 🍃 Leaves | Garden & outdoor items | Sort It (living/non-living), Weather Lab, Body Parts, States of Matter |
| Social Studies / Geography (later) | 🧭 Compass Shards | Room themes, wallpaper | Map Explorer, Community Helpers, Flags & Continents |

Making each currency buy a *different* category is what pushes kids to play every subject
instead of only their favorite. A few "premium" items cost a mix of currencies.

### Grade bands

Every game has 6 levels of content, **K, 1, 2, 3, 4, 5**, with sub-levels inside each. The game
starts at the kid's grade and **moves up or down by itself** based on accuracy (e.g. 3 right in
a row moves up, 2 misses moves down), so a strong 1st grader isn't bored and a struggling
4th grader isn't stuck.

Content follows the usual US grade expectations (Common Core-style), e.g. for Math:
- **K:** counting to 20, comparing quantities, shapes
- **1:** adding and subtracting within 20, place value to 100
- **2:** within 100/1000, telling time, money
- **3:** times tables, intro to fractions, area
- **4:** multi-digit multiplication, equivalent fractions, decimals
- **5:** fraction operations, volume, order of operations

**Audio for pre-readers:** K–1 kids can't read instructions, so every prompt is spoken
(text-to-speech, recorded clips later) and every answer can be picked by tapping a picture.

---

## 2. Deliverables

| # | Deliverable | Description |
|---|---|---|
| D1 | **Game Design Doc** | Subjects, currencies, economy numbers, shop catalog, skill map per grade, art direction |
| D2 | **App shell** | Installable web app (PWA): profiles, hub screen, navigation, saving, works offline |
| D3 | **Profiles & save system** | Multiple kids on one device, each with avatar, grade, wallets, inventory, progress |
| D4 | **Game framework** | Shared engine every mini-game plugs into: question generator, adaptive difficulty, rewards, sound, celebration effects |
| D5 | **Mini-games, Wave 1** | 1–2 games for each of Math, Reading, Spelling, Science, covering K–5 |
| D6 | **Economy & Shop** | Wallets, prices, shop UI, buying, daily deals |
| D7 | **Character creator & wardrobe** | Build a character, equip the clothes and accessories they buy |
| D8 | **House builder** | Rooms on a grid, drag-and-drop furniture, wallpaper/floors, unlock extra rooms |
| D9 | **Motivation layer** | Daily streaks, badges, level-ups, "daily quest," surprise gifts |
| D10 | **Parent area** | PIN-locked: progress by subject/skill, set grade, time limits, reset |
| D11 | **Art & audio pack** | Characters, items, backgrounds, sound effects, music, voice prompts |
| D12 | **Mini-games, Wave 2+** | More games per subject, Social Studies, harder 4–5 content |
| D13 | **Release** | Hosted URL + "Add to Home Screen," optionally wrapped for the App Store / Google Play |
| D14 | **Testing** | Automated tests for content and saving, playtests with the kids, phone and tablet checks |

---

## 3. Recommended tech approach

- **Web app built as a PWA** (Progressive Web App): one codebase that runs on iPad, Android
  tablets and phones. It installs to the home screen, runs full-screen and works offline. No
  app store needed to start.
- **TypeScript + React + Vite** for screens (hub, shop, house, parent area), and lightweight
  **Canvas/SVG + CSS animations** inside games. A game engine (Phaser) only if a game needs physics.
- **Local-first saving** in IndexedDB on the device, with optional cloud sync later so progress
  follows a kid between devices.
- **Touch-first UI:** big tap targets (≥ 48px), no hover-only interactions, works in portrait
  and landscape, no typing required for K–2.
- **Content as data:** questions and word lists live in JSON or generators, not hard-coded, so
  adding levels is easy.
- **Later:** wrap with **Capacitor** if we want real App Store / Play Store builds.

---

## 4. Attack plan, step by step

Each phase ends with something the kids can actually play, so we get their feedback early.

### Phase 0: Decisions & design (this step)
1. Agree on this plan, then answer the open questions (section 6).
2. Write the Game Design Doc (D1): final subject and currency list, starter shop catalog
   (~40 items), price curve, grade-by-grade skill list.
3. Pick an art style (e.g. bright flat vector, chunky friendly characters).

### Phase 1: Foundation (playable skeleton)
4. Set up the project: Vite + React + TS, PWA manifest, offline service worker, linting, tests, deploy preview.
5. Build profiles and saving (D3): pick a kid, pick a grade, wallets start at 0.
6. Build the hub screen with a placeholder house and buttons for each subject.
7. Build the shared game framework (D4): round structure (≈10 questions, 2–4 min), adaptive
   difficulty, reward payout screen with confetti and sound.
8. **Milestone:** one Math game end-to-end. Play, earn Coins, see the wallet go up.

### Phase 2: Core loop (earn → shop → show off)
9. Shop (D6) with a starter catalog, category tabs per currency.
10. Character creator and wardrobe (D7).
11. House builder (D8): one room, place, move and rotate furniture, change wallpaper and floor.
12. **Milestone:** the full loop works. Play Math, buy a couch, put it in the house.

### Phase 3: All subjects (Wave 1 content)
13. Reading/Phonics games with spoken prompts (Stars).
14. Spelling/Vocabulary games (Gems).
15. Science games (Leaves).
16. Fill out K–5 content for every Wave 1 game. Spot-check each grade.
17. **Milestone:** 4 subjects × 4 currencies, playable at every grade.

### Phase 4: Make it sticky
18. Daily streaks, daily quest ("play 2 subjects today"), badges, player level.
19. Unlockable rooms and house exterior, pets with simple animations.
20. Juice pass: sounds, music, animations, celebrations, character reactions.
21. Economy tuning: rewards high enough to buy something small every session, with big
    goals that take about a week.

### Phase 5: Parent area & polish
22. Parent dashboard (D10): accuracy per skill, time played, grade override, daily time limit.
23. Accessibility: adjustable text size, colorblind-safe colors, mute toggles, reduced motion.
24. Test on real devices (iPhone, iPad, Android phone and tablet). Fix layout and performance.
25. **Milestone: v1.0 release.** Hosted and installable on the kids' devices.

### Phase 6: Grow it
26. Wave 2 games, Social Studies and Geography, seasonal shop items (holidays, summer).
27. Optional cloud sync between devices, and app-store builds.

---

## 5. Design principles (to keep it fun, not homework)

- **Short rounds** (2–4 min) that always end with a reward.
- **No punishment for wrong answers:** a gentle hint, then try again. You never lose currency.
- **Always something to save up for:** visible "next goal" item on the hub.
- **Choice:** the kid picks the subject, while daily quests nudge them toward variety.
- **Ownership:** their character, their house, their name on the door.
- **Celebrate:** sound, confetti and character dances for streaks and level-ups.
- **Healthy limits:** no ads, no real-money purchases, optional parent time limit.

---

## 6. Open questions for you

1. How many kids, and what grades are they in right now? (This tells us which grades to fill first.)
2. Which devices: iPad, Android tablet, iPhone, Android phone?
3. Is it OK to host it as a web app you add to the home screen, or do you need it in the App Store / Play Store?
4. Should progress sync between devices, or is each device on its own fine?
5. Any subjects to add or drop (e.g. typing, music, Spanish, coding/logic puzzles)?
6. Art style or theme the kids would love (animals, space, fantasy, Minecraft-like blocks, etc.)?
7. Any must-have features for you as a parent (time limits, progress reports, specific skills to target)?
