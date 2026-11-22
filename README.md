# Brainy Town (working title)

Learning games for kids, Pre-K through 5th grade, in one installable app for tablets and phones.
Kids play short games in five subjects, earn a different currency for each, and (soon) spend it
in a shop to dress up their character and decorate their house.

- 📋 [Project plan](docs/PLAN.md)
- 🎨 [Game design doc](docs/DESIGN.md)
- 🚀 [Hosting & installing on tablets](docs/HOSTING.md)
- ☁️ [Turning on cloud backup](docs/CLOUD_SETUP.md)

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
