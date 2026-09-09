'use client'
import { useState } from 'react'

// Categorical slots 1-6, stepped for a dark surface. Validated on #0d0f13:
// lightness band, chroma floor, CVD separation, normal-vision floor, contrast — all pass.
// Assigned in fixed order; never cycled, never reordered by rank.
const SLOTS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300']

const GAP = 1.2 // path units of surface showing between segments

export default function LanguageDonut({ data, centerValue, centerLabel }) {
  const [active, setActive] = useState(null)

  const total = data.reduce((sum, d) => sum + d.value, 0)
  let cursor = 0
  const segments = data.map((d, i) => {
    const pct = (d.value / total) * 100
    const seg = { ...d, pct, color: SLOTS[i % SLOTS.length], rotate: -90 + cursor * 3.6 }
    cursor += pct
    return seg
  })

  const shown = active === null ? null : segments[active]

  return (
    <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-14">
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 200 200"
          className="donut size-56"
          role="img"
          aria-label={segments.map((s) => `${s.name} ${Math.round(s.pct)}%`).join(', ')}
        >
          {segments.map((s, i) => (
            <circle
              key={s.name}
              className="donut-seg"
              cx="100"
              cy="100"
              r="76"
              pathLength="100"
              fill="none"
              stroke={s.color}
              strokeWidth={active === i ? 30 : 22}
              strokeDasharray="0 100"
              transform={`rotate(${s.rotate} 100 100)`}
              style={{ '--len': `${Math.max(s.pct - GAP, 0.5)} 100`, '--seg-delay': `${i * 90}ms` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>

        {/* centre readout — the hovered slice, or the headline when nothing is hovered */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-2xl text-fg">
            {shown ? `${Math.round(shown.pct)}%` : centerValue}
          </span>
          <span className="mt-1 max-w-24 text-xs leading-tight text-muted">
            {shown ? shown.name : centerLabel}
          </span>
        </div>
      </div>

      {/* legend — every value is written out, so identity is never colour-alone */}
      <ul className="w-full max-w-xs">
        {segments.map((s, i) => (
          <li key={s.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                active === i ? 'bg-white/6' : ''
              }`}
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="grow text-sm text-fg">{s.name}</span>
              <span className="font-mono text-sm text-muted">{Math.round(s.pct)}%</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
