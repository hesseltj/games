# Turning on cloud backup (Supabase)

Cloud backup lets progress follow each kid to new tablets, and keeps it safe if a tablet is lost
or reset. It uses **Supabase**, a free database service. The data lives in **your own** Supabase
account: one family login, with the kids' profiles inside it.

Setup takes about 15 minutes.

## 1. Create a Supabase project

1. Go to <https://supabase.com> → **Start your project**, and sign up (signing in with GitHub is easiest).
2. Click **New project**:
   - **Name:** `brainy-town`
   - **Database password:** click *Generate*. You won't need it for the app, but keep it in your password manager.
   - **Region:** the one closest to you.
   - Plan: **Free**.
3. Wait about a minute for it to finish setting up.

## 2. Create the database table

1. In the left sidebar open **SQL Editor** → **New query**.
2. Open [`supabase/schema.sql`](../supabase/schema.sql) from this repo on GitHub, copy all of it,
   paste it into the editor and click **Run**. You should see "Success. No rows returned".

This creates one table where every family account can only read and write its own rows.

## 3. Set up sign-in

In **Authentication → Sign In / Providers → Email**:

- Leave **Email** enabled.
- Turn **Confirm email** **off**, then **Save**. (Otherwise Supabase emails a confirmation link
  that opens in the browser rather than in the app, which is confusing on a tablet.)

## 4. Connect the app to the project

1. In Supabase, open **Project Settings → API** (or **Connect → App Frameworks**) and copy:
   - **Project URL**, e.g. `https://abcdefgh.supabase.co`
   - The **anon / public** key (on newer projects it's called the **publishable** key and
     starts with `sb_publishable_`). **Not** the `service_role` / secret key.
2. In **Netlify** open your site → **Site configuration → Environment variables → Add a variable**,
   and add two variables:
   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | the Project URL |
   | `VITE_SUPABASE_ANON_KEY` | the anon / publishable key |
3. Go to **Deploys → Trigger deploy → Deploy site** so the app is rebuilt with them.

The anon/publishable key is designed to be public: it's built into the app, and the security comes
from the sign-in and the row rules created in step 2.

## 5. Create the family account (once)

1. On the **first tablet**, open Brainy Town and go to **⚙️ Grown-ups** (bottom-right of
   "Who's playing?"). Answer the multiplication question.
2. Under **Cloud backup**, type an email and a password (6+ characters) and tap
   **Create family account**. Everything on that tablet is uploaded.

Then lock it down: in Supabase **Authentication → Sign In / Providers**, turn **Allow new users
to sign up** **off** and **Save**. Your account keeps working, and nobody else can create
accounts in your project.

## 6. Every other tablet (and your iPhone)

Open **⚙️ Grown-ups** → **Sign in** with the same email and password. That device downloads all
the players and their progress, and uploads anything it already had.

- On a **brand-new tablet**, the first screen is "What's your name?". Tap
  **⚙️ Grown-ups: restore players from cloud backup** at the bottom instead of making a new player.
- Each kid then taps their own picture on "Who's playing?". After that, the tablet opens straight
  to them.

## How it behaves

- Kids can play **offline**. Changes are saved on the tablet and uploaded the next time it's online.
- Coins earned on two devices at the same time are **added together**, never lost.
- For things that can only have one value (character look, room layout), the **most recent**
  change wins.
- Status ("Up to date ✓", "Offline", …) is shown in Grown-ups → Cloud backup.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Grown-ups says "Cloud backup isn't set up yet" | The Netlify variables are missing or misspelled, or the site wasn't redeployed after adding them (step 4.3). |
| "Invalid login credentials" | Wrong email or password. Passwords can be reset in Supabase → Authentication → Users. |
| "Email not confirmed" | "Confirm email" was on when the account was made. In Supabase → Authentication → Users, open the user and choose *Confirm email*, or delete and recreate it. |
| "Problem saving" with a message about `push_records` or `records` | The SQL from step 2 didn't run. Run it again (it's safe to run more than once). |
| Free project paused | Supabase pauses free projects after a week with no activity at all. Open the Supabase dashboard and click **Restore**. Nothing is lost, and tablets keep working offline meanwhile. |
