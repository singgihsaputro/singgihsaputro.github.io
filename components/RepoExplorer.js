'use client'
import { useMemo, useState } from 'react'

/**
 * Every public repository, grouped, with a filter per group and a search box.
 * Server-rendered with everything showing, so the full list is in the HTML even
 * before (or without) JavaScript.
 */
export default function RepoExplorer({ repos, groups, githubUrl }) {
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const c = Object.fromEntries(groups.map((g) => [g.id, 0]))
    for (const r of repos) c[r.group] = (c[r.group] ?? 0) + 1
    return c
  }, [repos, groups])

  const q = query.trim().toLowerCase()
  const shown = repos.filter(
    (r) =>
      (active === 'all' || r.group === active) &&
      (!q || `${r.name} ${r.description} ${r.language}`.toLowerCase().includes(q)),
  )
  const visibleGroups = groups.filter((g) => shown.some((r) => r.group === g.id))
  const nightlyCount = groups.filter((g) => g.nightly).reduce((s, g) => s + counts[g.id], 0)

  const chip = (id, label, n) => (
    <button
      key={id}
      type="button"
      onClick={() => setActive(id)}
      aria-pressed={active === id}
      className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
        active === id ? 'border-accent bg-accent/15 text-accent' : 'border-line text-muted hover:border-accent/50 hover:text-fg'
      }`}
    >
      {label} <span className="opacity-60">{n}</span>
    </button>
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-mono text-xs tracking-[0.15em] text-accent uppercase">Every public repository</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {repos.length} repositories, refreshed from GitHub every day. {nightlyCount} of them are mini projects a
            scheduled agent built one a night; the newest work, an ERP for Indonesian shops, grows by a feature a night.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories"
          aria-label="Search repositories"
          className="w-full rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-fg placeholder:text-muted focus:border-accent/60 focus:outline-none sm:w-64"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by group">
        {chip('all', 'All', repos.length)}
        {groups.filter((g) => counts[g.id] > 0).map((g) => chip(g.id, g.label, counts[g.id]))}
      </div>

      {shown.length === 0 && <p className="border-y border-line py-6 text-sm text-muted">No repository matches “{query}”.</p>}

      <div className="space-y-8">
        {visibleGroups.map((g) => (
          <section key={g.id} aria-label={g.label}>
            <h4 className="mb-2 flex flex-wrap items-baseline gap-x-3 font-mono text-xs text-muted">
              <span className="text-fg">{g.label}</span>
              {g.nightly && <span>built one a night by a scheduled agent</span>}
            </h4>
            <ul className="divide-y divide-line border-y border-line">
              {shown
                .filter((r) => r.group === g.id)
                .map((r) => (
                  <li key={r.name}>
                    <a
                      href={`${githubUrl}/${r.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 transition-colors hover:bg-white/3"
                    >
                      <span className="font-mono text-sm transition-colors group-hover:text-accent">{r.name}</span>
                      {r.archived && (
                        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] tracking-wide text-muted uppercase">
                          Archived
                        </span>
                      )}
                      <span className="min-w-[12rem] grow text-sm text-muted">{r.description}</span>
                      {r.language && <span className="font-mono text-xs text-accent">{r.language}</span>}
                      {r.stars > 0 && <span className="font-mono text-xs text-muted">★ {r.stars}</span>}
                      <span className="font-mono text-xs text-muted">{r.created.slice(0, 4)}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
