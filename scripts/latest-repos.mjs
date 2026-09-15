// Refresh data/repos.json with the five most recently pushed public repos.
// Run in CI before the build. On any failure it leaves the committed file
// alone, so a GitHub hiccup degrades to slightly stale data, never a broken build.
import { writeFile } from 'node:fs/promises'

const USER = 'singgihsaputro'
const COUNT = 5
const OUT = new URL('../data/repos.json', import.meta.url)

const res = await fetch(
  `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
  { headers: { 'User-Agent': 'singgihsaputro.github.io', Accept: 'application/vnd.github+json' } }
)
if (!res.ok) throw new Error(`GitHub returned ${res.status}`)

const repos = (await res.json())
  // skip forks, and the two repos that are this site and the profile README
  .filter((r) => !r.fork && !r.archived && r.name !== `${USER}.github.io` && r.name !== USER)
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
  .slice(0, COUNT)
  .map((r) => ({
    name: r.name,
    blurb: r.description || '',
    language: r.language || '',
    stars: r.stargazers_count,
    pushed: r.pushed_at.slice(0, 10),
  }))

if (!repos.length) throw new Error('no repositories came back — refusing to blank the list')

await writeFile(OUT, JSON.stringify(repos, null, 2) + '\n')
console.log(`wrote ${repos.length}:`, repos.map((r) => r.name).join(', '))
