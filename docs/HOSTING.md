# Hosting & installing on the tablets

The app is a static website, so any static host works. **Netlify** is recommended: it's free and
connects straight to this GitHub repo, so every update you merge goes live automatically. It also
works fine with private repos.

## One-time setup (about 10 minutes)

1. **Create a Netlify account:** go to <https://app.netlify.com/signup> and choose
   **"Sign up with GitHub"** (the free plan is plenty).
2. **Import the repo:**
   - Click **Add new site → Import an existing project → Deploy with GitHub**.
   - Authorize Netlify for GitHub when asked. You can limit it to just the `games` repo.
   - Pick **`hesseltj/games`**.
3. **Settings** (Netlify reads most of this from `netlify.toml`, so you can leave the defaults):
   - **Branch to deploy:** `main`. Until the work is merged into `main`, you can pick the
     working branch `claude/serene-cray-0eulfv` instead.
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy**. After about a minute you get a URL like `https://random-name-123.netlify.app`.
5. **Give it a nicer name (optional):** go to **Site configuration → Change site name**, e.g.
   `brainy-town-family` → `https://brainy-town-family.netlify.app`.

From then on, every push or merge to the deploy branch rebuilds the site automatically. The
installed apps on the tablets pick up the new version the next time they're opened (sometimes it
takes a second launch).

## Installing on each Android tablet

1. Open **Chrome** on the tablet and go to your Netlify URL.
2. Tap the **⋮ menu → "Install app"** (on some versions: "Add to Home screen" → "Install").
3. A **Brainy Town** icon appears on the home screen. It opens full-screen, like a normal app,
   and works offline after the first visit.
4. On first launch, set up that kid's profile (name, grade, favorite theme, character). The
   tablet remembers who played last and opens straight to their house.

Tip: if a tablet uses Android's **Family Link**, you may need to allow the app from the parent's
Family Link settings.

## Testing on your iPhone

1. Open the URL in **Safari** (it has to be Safari for home-screen install).
2. Tap the **Share** button → **"Add to Home Screen"** → **Add**.
3. Make sure the phone isn't on silent if you want to hear the voice prompts.

## Important for now: progress is stored on each device

Until cloud sync is added (Phase 2), each kid's coins and progress live **only on that tablet**.
Don't use "Clear data" for Chrome or uninstall the app, or that progress resets. Phase 2 adds the
family login so progress is backed up and follows them to new devices.

## Alternative: Cloudflare Pages

Also free, and it works the same way: <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages →
Connect to Git** → pick the repo → framework preset **Vite** (build `npm run build`, output `dist`).
