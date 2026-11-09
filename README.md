# FROM NOISE TO SIGNAL — Hammad Rasool

A cinematic, scroll-told portfolio for **Hammad Rasool (AureVon)**.

## Creative concept

1. The visitor arrives in darkness: a loader counts to 100, then thousands of particles burst outward.
2. The particles slowly assemble into Hammad's real portrait, sampled live from his own photo, while his name lands in giant Anton type.
3. Scrolling dissolves the portrait back into noise as the story begins: who he is, what lights his way, then a single hard cut to red for THE WORK.
4. Each project gets its own pinned scene, followed by the BUILD / GROW toolkit in orbit.
5. The night ends in moonlit cyan: "LET'S TALK." One light source, one story, no invented facts.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Needs Node 20.9+.

## Edit your content

Everything you'd want to change lives in **`content.ts`**: text, links, projects, skills, photo paths.
Any text that starts with `{{TODO` shows up on the site as a dashed orange tag, so you can see what's missing.

## Photos

Photos of you go in `public/images/me/`. Project screenshots go in `public/images/projects/`.

| File | Where it's used | Status |
|---|---|---|
| `public/images/me/hero.jpg` | Hero particle portrait (sampled), reduced-motion portrait, social share image, JSON-LD | ✅ added (navy blazer, standing) |
| `public/images/me/origin.jpg` | 02/ Origin | ✅ added (blazer, holding book) |
| `public/images/me/learning.jpg` | 03/ The Lantern | ✅ added (checked shirt, reading) |
| `public/images/me/candid.jpg` | 06/ Transmission | ✅ added (casual, sofa) |
| `public/images/projects/quickpercent.jpg` | QuickPercent scene (1600×1000 recommended) | ⬜ needed |
| `public/images/projects/faunavox.jpg` | FaunaVox scene (1600×1000 recommended) | ⬜ needed |
| `public/images/projects/*.mp4` (optional) | Short muted screen recordings, used instead of the screenshot | optional |

After adding a screenshot, set `media.src` for that project in `content.ts` (e.g. `"/images/projects/quickpercent.jpg"`).
For a recording, also set `media.video` and keep `src` as the poster image.

**Swapping the hero photo:** the particle portrait is sampled from whatever `photos.hero.src` points to. It works best with a plain, evenly coloured background (it reads the background colour from the top corners).

## Easter egg

Press `/` anywhere to open the terminal. Commands: `help`, `home`, `about`, `work`, `contact`, `grain-off`, `mono`, `whoami`, `clear`, `exit`.

## Contact form

The form validates in the browser, then posts to `/api/contact`, which emails every message to
**AureVon9990@gmail.com** and **hammadrasool0009@gmail.com** (change the list with `CONTACT_TO_EMAIL`).

**One-time setup (Gmail, free):**

1. Sign in to the Gmail account that will send the messages (e.g. AureVon9990@gmail.com).
2. Google Account → **Security** → turn on **2-Step Verification**.
3. Search "App passwords" in your Google Account, create one (name it "Portfolio"), copy the 16-character code.
4. Vercel → Project → **Settings → Environment Variables**, add:
   - `GMAIL_USER` = that Gmail address
   - `GMAIL_APP_PASSWORD` = the 16-character code
5. **Redeploy** (Deployments → ⋯ → Redeploy). Env vars only apply to new deployments.

If sending ever fails, the form says "Not sent yet" and offers to open the visitor's own email app instead
of pretending it worked. Errors show up in Vercel → Project → **Logs** (search `[contact]`).

Resend is still supported as an alternative (`RESEND_API_KEY`), see `.env.example`.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Go to vercel.com → **Add New → Project** → import the repository. Vercel detects Next.js automatically; keep the defaults.
3. Click **Deploy**.
4. The site URL (canonical, sitemap, social cards) is picked up automatically from Vercel. If you add a custom domain, set `NEXT_PUBLIC_SITE_URL` in Vercel and redeploy.

Or from the terminal: `npm i -g vercel && vercel`.

## Performance & accessibility notes

- Fonts are self-hosted (Fontsource + `next/font/local`): no requests to Google, no layout shift.
- three.js loads only after first paint, when the browser is idle, and stops rendering when the hero is off-screen. Fewer particles and a lower pixel ratio on phones and low-core devices.
- The loader overlays already-rendered content, so it doesn't delay the real page; repeat visits in the same tab skip it.
- `prefers-reduced-motion`: no particles (a static duotone portrait instead), no pinning, no scrubbing, no smooth scroll, no grain/marquee/orbit animation.
- Touch devices: native scrolling, no custom cursor, colour photos revealed as they scroll into the middle of the screen.
- Semantic sections, skip link, alt text on every photo, visible focus rings, AA contrast, keyboard-reachable chapter rail and terminal.
- SEO: metadata, canonical URL, Open Graph + Twitter card (generated from your portrait), JSON-LD `Person`, `sitemap.xml`, `robots.txt`.

## Still to fill in (`{{TODO}}`)

In `content.ts`:

- `profile.socials.github`: your GitHub URL (button appears automatically once set)
- `profile.socials.linkedin`: your LinkedIn URL (same)
- `origin.story`: a line about your story, goals, or what you want next
- QuickPercent `learned`: what you learned building it
- QuickPercent `tags`: the actual stack (e.g. React · Tailwind)
- FaunaVox `learned`: what you learned building it
- FaunaVox `tags`: more stack details
- `toolkit.build`: any extra dev skills (JavaScript, Next.js, Git, Figma…), there's a commented line ready
- Project screenshots (see the photo table above)
