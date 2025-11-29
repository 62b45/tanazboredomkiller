import { useCallback, useEffect, useState } from 'react'

import { useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const baseNumbers = [1, 2, 3, 4, 5]

const moveLimits = {
  Cozy: 12,
  Chill: 9,
  Spicy: 7,
}

type DifficultyKey = keyof typeof moveLimits

function shuffleNumbers() {
  let arr = [...baseNumbers]
  do {
    arr = [...baseNumbers].sort(() => Math.random() - 0.5)
  } while (arr.every((num, idx) => num === baseNumbers[idx]))
  return arr
}

function isSorted(list: number[]) {
  return list.every((value, idx) => value === baseNumbers[idx])
}

export default function NumberSwap({ game, onWin }: MiniGameProps) {
  const limit = moveLimits[game.difficulty as DifficultyKey] ?? moveLimits.Chill
  const { best, updateBest } = useGameMetric(game.id, 'score', 'lower')
  const [numbers, setNumbers] = useState(() => shuffleNumbers())
  const [selection, setSelection] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState('Tap two adjacent values to swap them until they read 1 → 5.')
  const [solved, setSolved] = useState(false)

  const reset = useCallback(() => {
    setNumbers(shuffleNumbers())
    setSelection([])
    setMoves(0)
    setSolved(false)
    setMessage('Tap two adjacent values to swap them until they read 1 → 5.')
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function handlePick(index: number) {
    if (solved) return
    if (selection.length === 0) {
      setSelection([index])
      return
    }
    if (selection[0] === index) {
      setSelection([])
      return
    }
    const [first] = selection
    if (Math.abs(first - index) !== 1) {
      setSelection([index])
      setMessage('Only neighbors can be swapped.')
      return
    }
    const next = [...numbers]
    ;[next[first], next[index]] = [next[index], next[first]]
    setNumbers(next)
    const nextMoves = moves + 1
    setMoves(nextMoves)
    setSelection([])
    if (isSorted(next)) {
      setSolved(true)
      setMessage('Digits aligned perfectly ✨')
      updateBest(nextMoves)
      onWin()
    } else {
      setMessage('Good swap! Keep ordering the row.')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Moves</p>
          <p className="text-2xl font-semibold text-ink">
            {moves}/{limit}
          </p>
          <p className="text-xs text-ink/60">Lower is better.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best run</p>
          <p className="text-2xl font-semibold text-ink">{best ?? '—'}</p>
          <p className="text-xs text-ink/60">Fewest swaps recorded.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Selection</p>
          <p className="text-2xl font-semibold text-ink">
            {selection.length ? numbers[selection[0]] : '—'}
          </p>
          <p className="text-xs text-ink/60">Tap a neighbor to swap.</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {numbers.map((value, index) => (
          <button
            key={`${value}-${index}-${moves}`}
            type="button"
            onClick={() => handlePick(index)}
            className={cx(
              'tap-target rounded-3xl border-2 border-ink/15 bg-white/80 py-6 text-center text-2xl font-semibold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint',
              selection.includes(index) && 'border-ink bg-ink/90 text-white',
              solved && 'bg-mint/40 text-ink',
            )}
            aria-label={`Swap tile ${value}`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Shuffle again
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Sequence complete</span>}
      </div>
    </div>
  )
}
