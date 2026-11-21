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
| `src/games/` | Mini-games. Each one plugs into `useRound` |
| `src/screens/` | Profiles, new player, hub, subject menu, reward |
| `src/ui/` | Avatar, house, shapes, confetti, wallet |
