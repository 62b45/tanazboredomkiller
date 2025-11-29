import { useCallback, useEffect, useMemo, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const gridSize = 3

const templates = {
  Cozy: [0, 1, 4, 5, 8],
  Chill: [6, 3, 0, 1, 2, 5, 8],
  Spicy: [2, 5, 8, 7, 6, 3, 4, 1, 0],
}

type DifficultyKey = keyof typeof templates

function isNeighbor(a: number, b: number) {
  const rowA = Math.floor(a / gridSize)
  const rowB = Math.floor(b / gridSize)
  const colA = a % gridSize
  const colB = b % gridSize
  const sameRow = rowA === rowB && Math.abs(colA - colB) === 1
  const sameCol = colA === colB && Math.abs(rowA - rowB) === 1
  return sameRow || sameCol
}

function toLabel(index: number) {
  const row = Math.floor(index / gridSize)
  const col = index % gridSize
  return `${String.fromCharCode(65 + row)}${col + 1}`
}

export default function LineConnect({ game, onWin }: MiniGameProps) {
  const target = useMemo(() => templates[game.difficulty as DifficultyKey] ?? templates.Chill, [game.difficulty])
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [path, setPath] = useState<number[]>([])
  const [cursor, setCursor] = useState(target[0])
  const [message, setMessage] = useState('Follow the highlighted order to connect the path.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setPath([])
    setCursor(target[0])
    setSolved(false)
    setMessage('Follow the highlighted order to connect the path.')
    setStartedAt(Date.now())
  }, [target])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  const moveCursor = useCallback((deltaRow: number, deltaCol: number) => {
    setCursor((prev) => {
      const row = Math.floor(prev / gridSize)
      const col = prev % gridSize
      const nextRow = row + deltaRow
      const nextCol = col + deltaCol
      if (nextRow < 0 || nextRow >= gridSize || nextCol < 0 || nextCol >= gridSize) {
        return prev
      }
      return nextRow * gridSize + nextCol
    })
  }, [])

  const handleSelect = useCallback(
    (index: number) => {
      if (solved) return
      const expected = target[path.length]
      if (index !== expected) {
        setMessage('Stick to the glowing order.')
        return
      }
      if (path.length > 0) {
        const prev = path[path.length - 1]
        if (!isNeighbor(prev, index)) {
          setMessage('Each node must touch the last one.')
          return
        }
      }
      const nextPath = [...path, index]
      setPath(nextPath)
      if (nextPath.length === target.length) {
        setSolved(true)
        const elapsed = Date.now() - startedAt
        updateBest(elapsed)
        setMessage('Line synchronized ✨')
        onWin()
      } else {
        setMessage('Linked. Keep following the sequence.')
      }
    },
    [onWin, path, solved, startedAt, target, updateBest],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveCursor(-1, 0)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveCursor(1, 0)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        moveCursor(0, -1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveCursor(0, 1)
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleSelect(cursor)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cursor, handleSelect, moveCursor])

  const progress = Math.round((path.length / target.length) * 100)

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Progress</p>
          <p className="text-2xl font-semibold text-ink">{progress}%</p>
          <p className="text-xs text-ink/60">{path.length} / {target.length} nodes</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest trace stored locally.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Current cursor</p>
          <p className="text-2xl font-semibold text-ink">{toLabel(cursor)}</p>
          <p className="text-xs text-ink/60">Use arrows or tap nodes.</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Order</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
          {target.map((node, idx) => (
            <span
              key={node + idx}
              className={cx(
                'rounded-full px-3 py-1 text-ink/60',
                idx < path.length && 'bg-mint/40 text-ink',
                idx === path.length && !solved && 'bg-ink text-white',
              )}
            >
              {toLabel(node)}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3" role="grid">
        {Array.from({ length: gridSize * gridSize }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelect(index)}
            className={cx(
              'tap-target aspect-square rounded-3xl border-2 border-ink/15 bg-white/80 text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
              path.includes(index) && 'border-mint bg-mint/30 text-ink',
              cursor === index && 'ring-2 ring-dusk',
            )}
          >
            {toLabel(index)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset path
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Route secure</span>}
      </div>
    </div>
  )
}
