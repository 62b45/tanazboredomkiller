import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]

function shuffleBoard() {
  let board = [...goalState]
  do {
    board = [...goalState].sort(() => Math.random() - 0.5)
  } while (!isSolvable(board) || isSolved(board))
  return board
}

function isSolved(board: number[]) {
  return board.every((value, index) => value === goalState[index])
}

function isSolvable(board: number[]) {
  const numbers = board.filter((value) => value !== 0)
  let inversions = 0
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > numbers[j]) inversions++
    }
  }
  return inversions % 2 === 0
}

function isAdjacent(a: number, b: number) {
  const rowA = Math.floor(a / 3)
  const rowB = Math.floor(b / 3)
  const colA = a % 3
  const colB = b % 3
  const sameRow = rowA === rowB && Math.abs(colA - colB) === 1
  const sameCol = colA === colB && Math.abs(rowA - rowB) === 1
  return sameRow || sameCol
}

export default function SlidePuzzle({ game, onWin }: MiniGameProps) {
  const [tiles, setTiles] = useState(() => shuffleBoard())
  const [moves, setMoves] = useState(0)
  const [status, setStatus] = useState('Slide tiles until 1-8 are in order and the blank rests in the corner.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')

  const resetBoard = useCallback(() => {
    setTiles(shuffleBoard())
    setMoves(0)
    setStatus('Slide tiles until 1-8 are in order and the blank rests in the corner.')
    setSolved(false)
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    resetBoard()
  }, [game.id, game.difficulty, resetBoard])

  const attemptMove = useCallback(
    (index: number) => {
      if (solved) return
      const zeroIndex = tiles.indexOf(0)
      if (!isAdjacent(index, zeroIndex)) {
        setStatus('Only tiles touching the empty space can slide.')
        return
      }
      const next = [...tiles]
      ;[next[index], next[zeroIndex]] = [next[zeroIndex], next[index]]
      setTiles(next)
      setMoves((prev) => prev + 1)
      if (isSolved(next)) {
        const elapsed = Date.now() - startedAt
        setSolved(true)
        setStatus('Constellation locked in ✨')
        updateBest(elapsed)
        onWin()
      } else {
        setStatus('Keep sliding the constellation pieces.')
      }
    },
    [onWin, solved, startedAt, tiles, updateBest],
  )

  const handleArrow = useCallback(
    (key: string) => {
      const zeroIndex = tiles.indexOf(0)
      const row = Math.floor(zeroIndex / 3)
      const col = zeroIndex % 3
      let target = -1
      if (key === 'ArrowUp' && row < 2) target = zeroIndex + 3
      if (key === 'ArrowDown' && row > 0) target = zeroIndex - 3
      if (key === 'ArrowLeft' && col < 2) target = zeroIndex + 1
      if (key === 'ArrowRight' && col > 0) target = zeroIndex - 1
      if (target >= 0) {
        attemptMove(target)
      }
    },
    [attemptMove, tiles],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: KeyboardEvent) => {
      if (!event.key.startsWith('Arrow')) return
      event.preventDefault()
      handleArrow(event.key)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleArrow])

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Track your fastest solve.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Moves</p>
          <p className="text-2xl font-semibold text-ink">{moves}</p>
          <p className="text-xs text-ink/60">Lower counts feel extra cozy.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3" role="grid">
        {tiles.map((value, index) => (
          <button
            key={`${value}-${index}`}
            type="button"
            onClick={() => attemptMove(index)}
            className={cx(
              'tap-target aspect-square rounded-2xl border-2 bg-white/80 text-2xl font-semibold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
              value === 0 ? 'border-dashed border-ink/20 text-ink/20' : 'border-ink/10 text-ink',
              solved && 'cursor-default',
            )}
            aria-label={value === 0 ? 'Empty slot' : `Tile ${value}`}
          >
            {value === 0 ? '·' : value}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{status}</span>
        <button type="button" onClick={resetBoard} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Shuffle board
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Puzzle solved!</span>}
      </div>
    </div>
  )
}
