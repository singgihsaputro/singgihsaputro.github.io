'use client'
import { useEffect } from 'react'

/**
 * Mounted once. Tracks the pointer over .card elements and writes its position
 * to CSS variables, so the card can light up under the cursor. Pointer-only —
 * touch devices never fire this and simply get the plain card.
 */
export default function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (e) => {
      const card = e.target.closest?.('.card')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  return null
}
