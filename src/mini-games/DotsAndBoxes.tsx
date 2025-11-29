import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const size = 2
const dotCount = size + 1
const gridDimension = dotCount * 2 - 1
const totalBoxes = size * size

function boxKey(row: number, col: number) {
  return `b-${row}-${col}`
}

function isBoxComplete(row: number, col: number, edges: Set<string>) {
  const top = `h-${row}-${col}`
  const bottom = `h-${row + 1}-${col}`
  const left = `v-${row}-${col}`
  const right = `v-${row}-${col + 1}`
  return edges.has(top) && edges.has(bottom) && edges.has(left) && edges.has(right)
}

export default function DotsAndBoxes({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [edges, setEdges] = useState<Set<string>>(() => new Set())
  const [completed, setCompleted] = useState<Set<string>>(() => new Set())
  const [message, setMessage] = useState('Draw pixel lines to complete every box.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setEdges(new Set())
    setCompleted(new Set())
    setMessage('Draw pixel lines to complete every box.')
    setSolved(false)
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function toggleEdge(key: string) {
    if (solved) return
    if (edges.has(key)) {
      setMessage('Edge already drawn.')
      return
    }
    const nextEdges = new Set(edges)
    nextEdges.add(key)
    const nextCompleted = new Set(completed)
    let gained = 0
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const keyBox = boxKey(r, c)
        if (!nextCompleted.has(keyBox) && isBoxComplete(r, c, nextEdges)) {
          nextCompleted.add(keyBox)
          gained++
        }
      }
    }
    setEdges(nextEdges)
    setCompleted(nextCompleted)
    if (nextCompleted.size === totalBoxes) {
      setSolved(true)
      const elapsed = Date.now() - startedAt
      setMessage('All boxes complete ✨')
      updateBest(elapsed)
      onWin()
    } else {
      setMessage(gained > 0 ? 'Nice! Box captured.' : 'Line added.')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest completion saved.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Boxes</p>
          <p className="text-2xl font-semibold text-ink">
            {completed.size}/{totalBoxes}
          </p>
          <p className="text-xs text-ink/60">Fill them all.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Status</p>
          <p className="text-2xl font-semibold text-ink">{solved ? 'Complete' : 'Drawing'}</p>
          <p className="text-xs text-ink/60">Tap edges to connect dots.</p>
        </div>
      </div>
      <div className="rounded-[2rem] border-2 border-ink/10 bg-white/70 p-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridDimension}, minmax(0, 1fr))` }}>
          {Array.from({ length: gridDimension * gridDimension }, (_, index) => {
            const row = Math.floor(index / gridDimension)
            const col = index % gridDimension
            const isDot = row % 2 === 0 && col % 2 === 0
            const isHorizontal = row % 2 === 0 && col % 2 === 1
            const isVertical = row % 2 === 1 && col % 2 === 0
            const isBox = row % 2 === 1 && col % 2 === 1

            if (isDot) {
              return <span key={index} className="h-3 w-3 rounded-full bg-ink" />
            }

            if (isHorizontal) {
              const edgeRow = row / 2
              const edgeCol = (col - 1) / 2
              const key = `h-${edgeRow}-${edgeCol}`
              const active = edges.has(key)
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleEdge(key)}
                  className={cx(
                    'h-3 rounded-full border border-dashed border-ink/15 bg-white/40 transition',
                    active && 'border-mint bg-mint/50',
                  )}
                  aria-label="Horizontal edge"
                />
              )
            }

            if (isVertical) {
              const edgeRow = (row - 1) / 2
              const edgeCol = col / 2
              const key = `v-${edgeRow}-${edgeCol}`
              const active = edges.has(key)
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleEdge(key)}
                  className={cx(
                    'w-3 rounded-full border border-dashed border-ink/15 bg-white/40 transition',
                    active && 'border-mint bg-mint/50',
                  )}
                  aria-label="Vertical edge"
                />
              )
            }

            if (isBox) {
              const boxRow = (row - 1) / 2
              const boxCol = (col - 1) / 2
              const key = boxKey(boxRow, boxCol)
              const active = completed.has(key)
              return (
                <div
                  key={index}
                  className={cx(
                    'flex h-8 items-center justify-center rounded-xl border border-transparent text-lg text-ink/20',
                    active && 'border-mint bg-mint/30 text-ink',
                  )}
                >
                  {active ? '✨' : ''}
                </div>
              )
            }

            return <span key={index} />
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset board
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Boxes locked in</span>}
      </div>
    </div>
  )
}
