// Refresh data/repos.json for the highlighted projects.
//
// The selection is curated, not "most recent" — the nightly agent publishes a
// repository most days and would otherwise push the good work off the list.
// Metadata (language, stars, description) is still fetched live so it stays true.
//
// `blurb` overrides the repository's own description where that description is
// weak; leave it out to use whatever GitHub returns.
import { writeFile } from 'node:fs/promises'

const USER = 'singgihsaputro'
const OUT = new URL('../data/repos.json', import.meta.url)

const HIGHLIGHTS = [
  {
    name: 'pokemon-kotlin-multiplatform-mobile',
    blurb: 'Kotlin Multiplatform sample sharing business logic across Android and iOS',
  },
  { name: 'android-pomodoro-timer' },
  { name: 'ios-habit-tracker' },
  { name: 'backend-expense-splitter' },
  {
    name: 'WebChat-BottlePython',
    blurb: 'Web chat built on Bottle, Python’s micro web framework',
  },
]

const repos = []
for (const pick of HIGHLIGHTS) {
  const res = await fetch(`https://api.github.com/repos/${USER}/${pick.name}`, {
    headers: { 'User-Agent': 'singgihsaputro.github.io', Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) {
    console.warn(`skipping ${pick.name}: GitHub returned ${res.status}`)
    continue
  }
  const r = await res.json()
  repos.push({
    name: r.name,
    blurb: pick.blurb || r.description || '',
    language: r.language || '',
    stars: r.stargazers_count,
    pushed: r.pushed_at.slice(0, 10),
  })
}

if (repos.length < HIGHLIGHTS.length) {
  throw new Error(`only ${repos.length}/${HIGHLIGHTS.length} resolved — not overwriting the list`)
}

await writeFile(OUT, JSON.stringify(repos, null, 2) + '\n')
console.log('wrote:', repos.map((r) => `${r.name} (${r.language})`).join(', '))
