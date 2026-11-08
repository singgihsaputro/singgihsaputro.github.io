# singgihsaputro.github.io

Personal CV / landing page. Next.js (static export) + Tailwind CSS v4, deployed to
GitHub Pages by Actions on every push to `main`.

**Live:** https://singgihsaputro.github.io

## Editing the content

All copy lives in one file — [`data/cv.js`](data/cv.js), populated from
`CV_Singgih_2026_H2_full.pdf`. Nothing else needs touching.

```
profile     name, roles (they type themselves in the hero), email, links, summary
stats       the three numbers under the hero
skills      grouped tag pills
experience  the timeline — Gojek, Kemendikbud, DANA, Ice House
projects    shipped apps, each linking to its Play Store listing
openSource  the compact "Also on GitHub" list
awards      hackathons and competitions
education   degree cards
```

Two fields are deliberately empty:

- `profile.phone` — your CV has it, this page does not. Public pages get scraped
  by spam harvesters. Fill it in and a phone button appears in the contact section.
- `profile.resume` — drop the PDF in `public/`, set `resume: '/your-cv.pdf'`,
  and a "Download CV" button appears.

## Repositories

The **Repositories** section, last before Contact, holds two lists that come from
GitHub rather than `data/cv.js` and refresh on every daily build:

- **Highlighted projects** — a hand-picked few. Choose them in `HIGHLIGHTS` in
  [`scripts/highlight-repos.mjs`](scripts/highlight-repos.mjs); stars, language and
  description are fetched live into `data/repos.json`.
- **Every public repository** — all of them, forks and private ones left out,
  written to `data/all-repos.json` by [`scripts/all-repos.mjs`](scripts/all-repos.mjs).
  They are grouped by rules in [`data/repo-groups.mjs`](data/repo-groups.mjs) (name
  prefix, then creation year), so a new repository files itself. The profile README
  in `singgihsaputro/singgihsaputro` groups the same way; change both together.

The daily run commits both JSON files back when they changed, so a build that cannot
reach the GitHub API still shows yesterday's list.

## Local

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static site into ./out
```

## Deploying

Pushing to `main` is the deploy. `.github/workflows/deploy.yml` builds and publishes
`out/` to Pages.

One-time setup, already done for this repo: **Settings → Pages → Source: GitHub Actions**.

Because it is a static export, `next start`, server components with runtime data,
route handlers, and image optimization are all off the table. Everything renders at
build time. If you later want those, deploy to Vercel instead and drop
`output: 'export'` from `next.config.mjs`.

`public/.nojekyll` only matters if you ever switch Pages back to branch-based
publishing — Jekyll would otherwise eat the `_next/` folder.

## Animation

No animation library. CSS keyframes in `app/globals.css` plus one
`IntersectionObserver` in [`components/Reveal.js`](components/Reveal.js) that adds
`.shown` to any `.reveal` element scrolled into view.

- `.rise` — hero items fade up on load, staggered with `--i`
- `.reveal` — scroll-triggered fade up, delayed with `--d`
- `.gradient-text` — animated gradient on the name
- `.blob` — drifting background colour
- `RotatingRole` — types the job titles out one by one

All of it collapses to static under `prefers-reduced-motion: reduce`.
