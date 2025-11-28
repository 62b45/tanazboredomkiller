import { useEffect, useMemo, useState } from 'react'

import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const tiles = [
  { id: 'sun', label: 'Sunbeam', value: 2 },
  { id: 'moon', label: 'Moon echo', value: 3 },
  { id: 'tide', label: 'Tide hum', value: 4 },
  { id: 'ember', label: 'Ember hush', value: 5 },
  { id: 'petal', label: 'Petal ping', value: 6 },
]

const goals = [7, 9, 11]

export default function HarmonySum({ game, onWin }: MiniGameProps) {
  const [activeIds, setActiveIds] = useState<string[]>([])
  const [goalIndex, setGoalIndex] = useState(0)
  const [hasWon, setHasWon] = useState(false)

  const target = goals[goalIndex]
  const total = useMemo(
    () =>
      activeIds.reduce((acc, id) => {
        const tile = tiles.find((item) => item.id === id)
        return acc + (tile?.value ?? 0)
      }, 0),
    [activeIds],
  )

  function toggle(id: string) {
    if (hasWon) return
    setActiveIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  useEffect(() => {
    if (!target && !hasWon) {
      setHasWon(true)
      onWin()
    }
  }, [hasWon, onWin, target])

  useEffect(() => {
    if (!target) return
    const solvedCurrent = total === target
    if (!solvedCurrent || hasWon) return
    if (goalIndex === goals.length - 1) {
      setHasWon(true)
      onWin()
      return
    }
    if (typeof window === 'undefined') {
      return
    }
    const timeout = window.setTimeout(() => {
      setGoalIndex((prev) => prev + 1)
      setActiveIds([])
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [goalIndex, hasWon, onWin, target, total])

  if (!target) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink/70">{game.summary}</p>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4 text-ink">
          Harmony board solved! ⭐
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/50">Goal {goalIndex + 1} / {goals.length}</p>
        <p className="mt-2 text-3xl font-semibold text-ink">Sum to {target}</p>
        <p className="text-sm text-ink/70">Current harmony: {total}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-5">
        {tiles.map((tile) => {
          const isActive = activeIds.includes(tile.id)
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => toggle(tile.id)}
              className={cx(
                'tap-target flex flex-col rounded-3xl border-2 border-ink/10 bg-white/90 py-4 text-center text-sm font-semibold text-ink/80 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
                isActive && 'border-mint bg-mint/20 text-ink shadow-card',
              )}
            >
              <span className="text-lg">{tile.label}</span>
              <span className="text-xs uppercase tracking-[0.35em] text-ink/50">+{tile.value}</span>
            </button>
          )
        })}
      </div>
      <p className="text-sm text-ink/80">Toggle tiles until their values match the goal number. They reset for each stage.</p>
      <div className="flex flex-wrap gap-3 text-sm text-ink/70">
        <button
          type="button"
          onClick={() => setActiveIds([])}
          className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink"
        >
          Clear selection
        </button>
        {hasWon && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Harmony locked 🎵</span>}
      </div>
    </div>
  )
}
