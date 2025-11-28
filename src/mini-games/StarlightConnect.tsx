import { useEffect, useMemo, useState } from 'react'

import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const anchors = [
  { id: 'north', label: 'North spark', symbol: '✦' },
  { id: 'east', label: 'East glow', symbol: '✷' },
  { id: 'south', label: 'South ember', symbol: '✣' },
  { id: 'west', label: 'West drift', symbol: '✸' },
  { id: 'zenith', label: 'Zenith pulse', symbol: '✺' },
]

export default function StarlightConnect({ game, onWin }: MiniGameProps) {
  const [activeNodes, setActiveNodes] = useState<string[]>([])
  const [hasWon, setHasWon] = useState(false)

  const completion = useMemo(() => Math.round((activeNodes.length / anchors.length) * 100), [activeNodes.length])

  useEffect(() => {
    if (!hasWon && activeNodes.length === anchors.length) {
      setHasWon(true)
      onWin()
    }
  }, [activeNodes.length, hasWon, onWin])

  function handleActivate(id: string) {
    if (hasWon) return
    setActiveNodes((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }

  function handleReset() {
    setActiveNodes([])
    setHasWon(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink/50">Constellation progress</p>
        <div className="mt-2 h-3 rounded-full bg-white">
          <div className="h-full rounded-full bg-gradient-to-r from-lavender to-mint transition-all" style={{ width: `${completion}%` }} />
        </div>
        <p className="mt-1 text-sm font-semibold text-ink/70">{completion}% aligned</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {anchors.map((anchor) => {
          const isActive = activeNodes.includes(anchor.id)
          return (
            <button
              key={anchor.id}
              type="button"
              onClick={() => handleActivate(anchor.id)}
              className={cx(
                'tap-target flex flex-col items-center rounded-2xl border-2 border-ink/10 bg-white/80 py-4 text-center text-sm font-semibold text-ink/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
                isActive && 'border-lavender bg-lavender/20 text-ink',
              )}
            >
              <span aria-hidden className="text-2xl">
                {anchor.symbol}
              </span>
              <span>{anchor.label}</span>
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-sm text-ink/70">
        <button
          type="button"
          onClick={handleReset}
          className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink"
        >
          Reset pattern
        </button>
        {hasWon && <span className="tap-target rounded-2xl bg-lavender/40 text-ink">Pattern locked in ✨</span>}
      </div>
    </div>
  )
}
