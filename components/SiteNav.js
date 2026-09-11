'use client'
import { useEffect, useState } from 'react'

const NAV = [
  ['About', 'about'],
  ['Languages', 'languages'],
  ['Experience', 'experience'],
  ['Work', 'projects'],
  ['Awards', 'awards'],
  ['Contact', 'contact'],
]

export default function SiteNav({ links = [] }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  // Scroll progress + which section is currently under the header.
  useEffect(() => {
    const sections = NAV.map(([, id]) => document.getElementById(id)).filter(Boolean)

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)

      // The last section whose top has passed the header line wins.
      let current = ''
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= 120) current = s.id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Close the mobile menu on Escape, and lock the page behind it.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const link = (label, id, extra = '') => (
    <a
      key={id}
      href={`#${id}`}
      onClick={() => setOpen(false)}
      aria-current={active === id ? 'true' : undefined}
      className={`nav-link ${active === id ? 'is-active' : ''} ${extra}`}
    >
      {label}
    </a>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-md">
      {/* how far down the page you are */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-accent to-accent-2"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-mono text-sm font-medium tracking-tight focus-ring rounded">
          singgih<span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map(([label, id]) => link(label, id))}
        </div>

        <div className="flex items-center gap-3">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="focus-ring hidden rounded-full border border-line px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg sm:block"
            >
              {label}
            </a>
          ))}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
            className="focus-ring -mr-2 rounded-md p-2 text-muted transition-colors hover:text-fg md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d={open ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 10h14M3 14h14'}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu. Anchored to the header (which is the positioned
          ancestor), so it animates on opacity and translate alone — no
          height to measure and nothing that can collapse to zero. */}
      <div
        id="mobile-menu"
        className="absolute inset-x-0 top-full border-b border-line bg-ink/95 backdrop-blur-md md:hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 260ms ease, transform 260ms ease',
        }}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {NAV.map(([label, id]) => link(label, id, 'py-2 text-base'))}
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="nav-link py-2 text-base"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </div>

    </header>
  )
}
