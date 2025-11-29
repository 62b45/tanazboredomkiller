import { useCallback, useEffect, useState } from 'react'

import { useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const size = 4
const targetScoreMap = {
  Cozy: 64,
  Chill: 96,
  Spicy: 128,
}

type DifficultyKey = keyof typeof targetScoreMap

type Board = number[][]

function createBoard(): Board {
  let board = Array.from({ length: size }, () => Array(size).fill(0))
  board = addRandom(addRandom(board))
  return board
}

function addRandom(board: Board) {
  const empty: Array<[number, number]> = []
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c])
    }),
  )
  if (!empty.length) return board
  const [row, col] = empty[Math.floor(Math.random() * empty.length)]
  const value = Math.random() < 0.8 ? 2 : 4
  const copy = board.map((r) => r.slice())
  copy[row][col] = value
  return copy
}

function slideRow(row: number[]) {
  const filtered = row.filter((cell) => cell !== 0)
  const merged: number[] = []
  let gained = 0
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const value = filtered[i] * 2
      merged.push(value)
      gained += value
      i++
    } else {
      merged.push(filtered[i])
    }
  }
  while (merged.length < size) {
    merged.push(0)
  }
  return { row: merged, gained }
}

function transpose(board: Board): Board {
  return board[0].map((_, col) => board.map((row) => row[col]))
}

function moveBoard(board: Board, direction: 'left' | 'right' | 'up' | 'down') {
  let working: Board
  let gained = 0

  if (direction === 'left') {
    working = board.map((row) => {
      const result = slideRow(row)
      gained += result.gained
      return result.row
    })
  } else if (direction === 'right') {
    working = board.map((row) => {
      const reversed = [...row].reverse()
      const result = slideRow(reversed)
      gained += result.gained
      return result.row.reverse()
    })
  } else if (direction === 'up') {
    const transposed = transpose(board)
    const collapsed = transposed.map((row) => {
      const result = slideRow(row)
      gained += result.gained
      return result.row
    })
    working = transpose(collapsed)
  } else {
    const transposed = transpose(board)
    const collapsed = transposed.map((row) => {
      const reversed = [...row].reverse()
      const result = slideRow(reversed)
      gained += result.gained
      return result.row.reverse()
    })
    working = transpose(collapsed)
  }

  const moved = board.some((row, r) => row.some((cell, c) => cell !== working[r][c]))
  if (!moved) {
    return { board, moved: false, gained: 0 }
  }
  return { board: addRandom(working), moved: true, gained }
}

function hasMoves(board: Board) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return true
      if (c < size - 1 && board[r][c] === board[r][c + 1]) return true
      if (r < size - 1 && board[r][c] === board[r + 1][c]) return true
    }
  }
  return false
}

function tileTone(value: number) {
  if (value === 0) return 'border-dashed border-ink/15 bg-white/50 text-ink/20'
  if (value <= 4) return 'bg-lavender/40 text-ink'
  if (value <= 16) return 'bg-mint/40 text-ink'
  if (value <= 64) return 'bg-blush/40 text-ink'
  return 'bg-ink text-white'
}

export default function MergeTiles({ game, onWin }: MiniGameProps) {
  const targetScore = targetScoreMap[game.difficulty as DifficultyKey] ?? targetScoreMap.Chill
  const { best, updateBest } = useGameMetric(game.id, 'score', 'higher')
  const [board, setBoard] = useState<Board>(() => createBoard())
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Slide tiles to merge matching values. Hit the target score to stabilize the grid.')
  const [solved, setSolved] = useState(false)
  const [stuck, setStuck] = useState(false)

  const reset = useCallback(() => {
    setBoard(createBoard())
    setScore(0)
    setMessage('Slide tiles to merge matching values. Hit the target score to stabilize the grid.')
    setSolved(false)
    setStuck(false)
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  const handleMove = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (solved || stuck) return
      const result = moveBoard(board, direction)
      if (!result.moved) {
        setMessage('That slide didn\'t shift anything.')
        return
      }
      const nextScore = score + result.gained
      setBoard(result.board)
      setScore(nextScore)
      if (nextScore >= targetScore) {
        setSolved(true)
        setMessage('Energy stabilized ✨')
        updateBest(nextScore)
        onWin()
        return
      }
      if (!hasMoves(result.board)) {
        setStuck(true)
        setMessage('Board stuck. Reset to try again.')
      } else {
        setMessage('Nice merge! Keep sliding.')
      }
    },
    [board, onWin, score, solved, stuck, targetScore, updateBest],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleMove('up')
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        handleMove('down')
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleMove('left')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleMove('right')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleMove])

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Score</p>
          <p className="text-2xl font-semibold text-ink">{score}</p>
          <p className="text-xs text-ink/60">Goal {targetScore}</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best</p>
          <p className="text-2xl font-semibold text-ink">{best ?? '—'}</p>
          <p className="text-xs text-ink/60">Highest run stored.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">State</p>
          <p className="text-2xl font-semibold text-ink">{solved ? 'Stable' : stuck ? 'Frozen' : 'Shifting'}</p>
          <p className="text-xs text-ink/60">Use keys or pad below.</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {board.flat().map((value, index) => (
          <div
            key={`${value}-${index}-${score}`}
            className={cx(
              'flex aspect-square items-center justify-center rounded-3xl border-2 text-2xl font-semibold shadow-card transition',
              tileTone(value),
            )}
          >
            {value !== 0 ? value : ''}
          </div>
        ))}
      </div>
      <div className="grid w-full max-w-xs grid-cols-3 gap-2 text-xl text-ink">
        <span />
        <button type="button" onClick={() => handleMove('up')} className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3">
          ↑
        </button>
        <span />
        <button type="button" onClick={() => handleMove('left')} className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3">
          ←
        </button>
        <button type="button" onClick={() => handleMove('down')} className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3">
          ↓
        </button>
        <button type="button" onClick={() => handleMove('right')} className="tap-target rounded-2xl border border-ink/10 bg-white/80 py-3">
          →
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset grid
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Target reached</span>}
      </div>
    </div>
  )
}
