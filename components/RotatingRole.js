'use client'
import { useEffect, useState } from 'react'

const TYPE_MS = 55
const DELETE_MS = 28
const HOLD_MS = 1900

/** Types each role out, holds, deletes, moves to the next. */
export default function RotatingRole({ roles }) {
  const [index, setIndex] = useState(0)
  const [len, setLen] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLen(roles[0].length)
      return
    }

    const word = roles[index]

    if (!deleting && len === word.length) {
      const t = setTimeout(() => setDeleting(true), HOLD_MS)
      return () => clearTimeout(t)
    }
    if (deleting && len === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % roles.length)
      return
    }

    const t = setTimeout(
      () => setLen((n) => n + (deleting ? -1 : 1)),
      deleting ? DELETE_MS : TYPE_MS
    )
    return () => clearTimeout(t)
  }, [len, deleting, index, roles])

  return (
    <span className="caret font-mono text-accent">
      {roles[index].slice(0, len)}
      {/* keeps the line from collapsing while empty */}
      <span className="invisible">.</span>
    </span>
  )
}
