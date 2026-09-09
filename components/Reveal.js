'use client'
import { useEffect } from 'react'

/**
 * Mounted once. Watches every .reveal element on the page and adds .shown
 * when it scrolls into view. Elements stay visible once revealed.
 */
export default function Reveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')

    // No IntersectionObserver (or motion turned off) — just show everything.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      nodes.forEach((n) => n.classList.add('shown'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('shown')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return null
}
