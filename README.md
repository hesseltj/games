# Brainy Town (working title)

Learning games for kids, Pre-K through 5th grade, in one installable app for tablets and phones.
Kids play short games in six subjects, earn a different currency for each, and spend it in a shop
to dress up their character and decorate their house.

- 📋 [Project plan](docs/PLAN.md)
- 🎨 [Game design doc](docs/DESIGN.md)
- 🚀 [Hosting & installing on tablets](docs/HOSTING.md)
- ☁️ [Turning on cloud backup](docs/CLOUD_SETUP.md)
- 📲 [Putting the app on the kids' tablets](docs/INSTALL_ON_TABLETS.md)

## Status

**Phase 1 (foundation):** done.
- Installable offline web app (PWA)
- Kid profiles: name, grade, favorite theme, custom character
- Hub with house, character, wallets and subject buttons
- Shared game framework: adaptive difficulty, spoken prompts, hints, payouts, reward screen
- **Number Pop** math game with 23 skills from Pre-K through 3rd grade

**Phase 2 (core loop + cloud):** done.
- Shop: 81 items across 6 themes plus basics, daily deal, "save up for this" goals
- Closet: hats, outfits and a buddy pet shown on the character
- House: bedroom and yard, plus 3 unlockable rooms; drag, flip and put away items; walls and floors
- Cloud backup with Supabase: one family login, offline-first sync, works across devices

**Phase 3 (all subjects):** done.
- Reading ⭐: Letter Lagoon, Word Builder, Story Spot
- Spelling 💎: Picture Words, Spelling Bee Garden
- Science 🍃: Sort It!, Science Safari
- Logic 🧩: Pattern Train, Memory Flip, Robot Path
- Every subject has games at Pre-K, K and 2nd grade. Games meant only for older grades stay
  hidden until a kid reaches them.

**Phase 4 (make it sticky):** done.
- Player levels (the same XP per round at every grade), with a present at every level and a new creature at levels 5, 10, 15…
- Daily streaks (one missed day a week is forgiven), presents at 3, 7, 14 and 30 days
- A daily quest with a present when it's done
- 21+ badges, including mastery badges per subject and grade
- Creature Book: 6 original creatures, each evolving twice as a buddy (after 15 and 40 rounds)
- Background music, more sounds, the kid's character cheering in games, "3 in a row!" combos
- Rooms now unlock for 300 coins plus 75 of another currency

**Phase 5 (progress report & polish):** done.
- Every game finished: Bake Shop (coins, clocks, rulers, orders) and Picture Sudoku join, and
  shape-building is in Pattern Train. Every skill in the skill map has a game.
- Grown-ups → 📊 Progress report: level, streak, time played, "needs a little help", charts for
  minutes per day, rounds per week and first-try accuracy, and a skill-by-skill table per subject
  with a starting grade you can set per subject
- Soft daily play-time limit per kid (the round in progress finishes; house and shop stay open),
  plus "+15 min today"
- Accessibility: bigger text, slower voice, less motion, stronger contrast
- Checked on 9 screen sizes (Android tablets both ways, Fire HD 10, iPad, iPhone SE/14, Pixel 7)
  and on a slowed-down CPU

**Phase 6 (grow with them):** done.
- Content for every grade from Pre-K through 5th in all subjects
- New subject: **World** 🌎 (social studies), earning 🧭 Compass Shards: Helpers & Me, Map Explorer,
  Time Travelers
- Story Spot has stories for grades 1–5; Word Builder grows from blends to syllables to Greek and Latin
  word parts; 6×6 sudoku, bigger robot mazes and memory boards, logic puzzles
- Seasonal shop items (fall, Halloween, winter, Valentine's, spring, summer) and explorer decor
  bought with Compass Shards

**Polish round:** done.
- Upbeat generated music with drums and bass, a song per screen, game music that ducks under the voice
- Livelier voice: best natural voice picked automatically, voice picker for grown-ups, excited praise and
  streak lines (sometimes using the kid's name) shown in the character's speech bubble
- 10 more games, for 4–6 per subject: Math Racer, Number Line Hop, Fraction Pizza, Sentence Scramble,
  Missing Letter Monster, Word Search, Life Cycle Line-Up, Fact or Fib?, Tic-Tac-Toe Challenge, Treasure Map

## Development

```bash
npm install
npm run dev        # local dev server (open the printed URL on a tablet on the same Wi-Fi)
npm test           # unit tests
npm run build      # production build into dist/
```

Code layout:

| Path | What's there |
|---|---|
| `src/core/` | Pure game logic: skills, adaptive difficulty, economy, subjects, themes, round runner |
| `src/data/` | On-device storage (IndexedDB), app state and cloud sync |
| `src/shop/` | Item catalog, purchase rules and shop actions |
| `supabase/` | Database schema for cloud backup |
| `src/audio/` | Text-to-speech and synthesized sound effects |
| `src/games/` | Mini-games. Each one plugs into `useRound`; `registry.tsx` lists them, `content/` holds word lists, stories and science facts |
| `src/screens/` | Profiles, new player, hub, subject menu, reward |
| `src/ui/` | Avatar, house, shapes, confetti, wallet |
