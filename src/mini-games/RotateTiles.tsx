import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const tileCount = 9

function generateTiles() {
  let tiles = Array.from({ length: tileCount }, () => Math.floor(Math.random() * 4))
  if (tiles.every((value) => value === 0)) {
    tiles = tiles.map((value, index) => (index % 2 === 0 ? 1 : 2))
  }
  return tiles
}

export default function RotateTiles({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [tiles, setTiles] = useState<number[]>(() => generateTiles())
  const [message, setMessage] = useState('Rotate each arrow until they all point north.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setTiles(generateTiles())
    setMessage('Rotate each arrow until they all point north.')
    setSolved(false)
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function rotate(index: number) {
    if (solved) return
    setTiles((prev) => {
      const next = [...prev]
      next[index] = (next[index] + 1) % 4
      if (next.every((value) => value === 0)) {
        setSolved(true)
        setMessage('Grid aligned ✨')
        const elapsed = Date.now() - startedAt
        updateBest(elapsed)
        onWin()
      } else {
        setMessage('Keep spinning until every arrow faces up.')
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest alignment saved.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Status</p>
          <p className="text-2xl font-semibold text-ink">{solved ? 'Aligned' : 'Scrambled'}</p>
          <p className="text-xs text-ink/60">Tap tiles or use enter/space with focus.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((value, index) => (
          <button
            key={`${index}-${value}-${solved}`}
            type="button"
            onClick={() => rotate(index)}
            className={cx(
              'tap-target aspect-square rounded-3xl border-2 border-ink/15 bg-white/80 text-3xl shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
              solved && 'bg-mint/40 text-ink',
            )}
          >
            <span style={{ transform: `rotate(${value * 90}deg)` }} aria-hidden>
              ↑
            </span>
            <span className="sr-only">Rotate tile {index + 1}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Shuffle arrows
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Constellation set</span>}
      </div>
    </div>
  )
}
