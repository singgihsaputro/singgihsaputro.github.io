'use client'
import { useEffect } from 'react'

const RESCUE_MS = 2000

/**
 * Mounted once. Adds .shown to every .reveal element as it scrolls into view.
 *
 * Content is visible by default in CSS; this adds `js-reveal` to <html> to opt
 * into hiding it first. So if this script never runs — JS blocked, bundle fails,
 * old browser — the page still reads normally instead of rendering blank.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement
    const nodes = document.querySelectorAll('.reveal')
    const showAll = () => nodes.forEach((n) => n.classList.add('shown'))

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      showAll()
      return
    }

    root.classList.add('js-reveal')

    let fired = 0
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          fired++
          e.target.classList.add('shown')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    )

    nodes.forEach((n) => io.observe(n))

    // Some contexts never deliver intersection callbacks (a tab that is never
    // composited, for one). If nothing has fired by now, give up and show
    // everything — a missing animation beats an invisible page.
    const rescue = setTimeout(() => {
      if (fired === 0) {
        io.disconnect()
        showAll()
      }
    }, RESCUE_MS)

    return () => {
      clearTimeout(rescue)
      io.disconnect()
    }
  }, [])

  return null
}
