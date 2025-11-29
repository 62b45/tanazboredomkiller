import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const gridSize = 5
const startCell = { row: 0, col: 0 }
const goalCell = { row: gridSize - 1, col: gridSize - 1 }
const walls = new Set(['1-2', '2-2', '2-3', '3-1', '3-3'])

function keyFor(row: number, col: number) {
  return `${row}-${col}`
}

export default function PathFinder({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [position, setPosition] = useState(() => ({ ...startCell }))
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState('Guide the marker to the portal without touching fog blocks.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setPosition({ ...startCell })
    setMoves(0)
    setSolved(false)
    setMessage('Guide the marker to the portal without touching fog blocks.')
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  const move = useCallback(
    (deltaRow: number, deltaCol: number) => {
      if (solved) return
      const nextRow = position.row + deltaRow
      const nextCol = position.col + deltaCol
      if (nextRow < 0 || nextRow >= gridSize || nextCol < 0 || nextCol >= gridSize) {
        setMessage('Edge of the map. Nudge another way.')
        return
      }
      if (walls.has(keyFor(nextRow, nextCol))) {
        setMessage('Fog wall detected — reroute.')
        return
      }
      const arriving = { row: nextRow, col: nextCol }
      setPosition(arriving)
      const nextMoves = moves + 1
      setMoves(nextMoves)
      if (arriving.row === goalCell.row && arriving.col === goalCell.col) {
        setSolved(true)
        const elapsed = Date.now() - startedAt
        updateBest(elapsed)
        setMessage('Portal reached!')
        onWin()
      } else {
        setMessage('Good step. Keep weaving forward.')
      }
    },
    [moves, onWin, position.col, position.row, solved, startedAt, updateBest],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        move(-1, 0)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        move(1, 0)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        move(0, -1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        move(0, 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [move])

  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    const isWall = walls.has(keyFor(row, col))
    const isCurrent = position.row === row && position.col === col
    const isGoal = goalCell.row === row && goalCell.col === col
    const isStart = startCell.row === row && startCell.col === col
    return { row, col, isWall, isCurrent, isGoal, isStart }
  })

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Moves</p>
          <p className="text-2xl font-semibold text-ink">{moves}</p>
          <p className="text-xs text-ink/60">Stay calm and efficient.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest run saved locally.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Status</p>
          <p className="text-2xl font-semibold text-ink">{solved ? 'Arrived' : 'En route'}</p>
          <p className="text-xs text-ink/60">Tap pad or arrow keys.</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {cells.map((cell) => (
          <div
            key={keyFor(cell.row, cell.col)}
            className={cx(
              'aspect-square rounded-2xl border-2 border-ink/10 bg-white/70 text-center text-xl font-semibold text-ink/60',
              cell.isWall && 'bg-ink/10 text-ink/20',
              cell.isGoal && 'bg-mint/40 text-ink',
              cell.isStart && 'bg-blush/30',
              cell.isCurrent && 'bg-ink text-white shadow-card',
            )}
          >
            <span className="flex h-full items-center justify-center">
              {cell.isCurrent ? '🧭' : cell.isGoal ? '🎯' : cell.isStart ? '🚪' : cell.isWall ? '⬛' : ''}
            </span>
          </div>
        ))}
      </div>
      <div className="grid w-full max-w-xs grid-cols-3 gap-2 text-xl text-ink">
        <span />
        <button
          type="button"
          onClick={() => move(-1, 0)}
          className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3"
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          onClick={() => move(0, -1)}
          className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => move(1, 0)}
          className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => move(0, 1)}
          className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3"
        >
          →
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset trail
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Navigator synced</span>}
      </div>
    </div>
  )
}
