// Refresh data/all-repos.json: every public repository, grouped, newest first.
//
// Runs in the deploy workflow before the build, so the list on the site is never
// more than a day old. Forks and private repositories are left out. On any
// failure the committed file stays as it is and the build uses that.
import { writeFile } from 'node:fs/promises'
import { GROUPS, HIDDEN, groupOf } from '../data/repo-groups.mjs'

const USER = 'singgihsaputro'
const OUT = new URL('../data/all-repos.json', import.meta.url)
const headers = {
  'User-Agent': 'singgihsaputro.github.io',
  Accept: 'application/vnd.github+json',
  // In Actions the workflow token lifts the anonymous rate limit; locally it is optional.
  ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
}

const all = []
for (let page = 1; ; page++) {
  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?type=owner&sort=created&direction=desc&per_page=100&page=${page}`,
    { headers },
  )
  if (!res.ok) throw new Error(`GitHub returned ${res.status} for page ${page}`)
  const batch = await res.json()
  all.push(...batch)
  if (batch.length < 100) break
}

const order = new Map(GROUPS.map((g, i) => [g.id, i]))
const repos = all
  .filter((r) => !r.fork && !r.private && !HIDDEN.includes(r.name))
  .map((r) => ({
    name: r.name,
    description: r.description ?? '',
    language: r.language ?? '',
    stars: r.stargazers_count,
    homepage: r.homepage || '',
    archived: r.archived,
    created: r.created_at.slice(0, 10),
    group: groupOf(r.name, r.created_at),
  }))
  .sort((a, b) => order.get(a.group) - order.get(b.group) || b.created.localeCompare(a.created) || a.name.localeCompare(b.name))

// A near-empty answer is a GitHub hiccup, not a deleted account.
if (repos.length < 10) throw new Error(`only ${repos.length} repositories came back — not overwriting the list`)

await writeFile(OUT, JSON.stringify(repos, null, 2) + '\n')
const counts = GROUPS.map((g) => `${g.id} ${repos.filter((r) => r.group === g.id).length}`).join(', ')
console.log(`wrote ${repos.length} repositories: ${counts}`)
