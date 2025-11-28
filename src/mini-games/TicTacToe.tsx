import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

type Cell = '' | 'X' | 'O'

type Winner = 'player' | 'cpu' | 'draw' | null

function detectWinner(board: Cell[]): Winner {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === 'X' ? 'player' : 'cpu'
    }
  }
  if (board.every(Boolean)) {
    return 'draw'
  }
  return null
}

function pickCpuMove(board: Cell[]) {
  const empty = board.map((value, index) => (value ? null : index)).filter((value) => value !== null) as number[]
  // try to win
  for (const index of empty) {
    const clone = [...board]
    clone[index] = 'O'
    if (detectWinner(clone) === 'cpu') {
      return index
    }
  }
  // block player
  for (const index of empty) {
    const clone = [...board]
    clone[index] = 'X'
    if (detectWinner(clone) === 'player') {
      return index
    }
  }
  // take center
  if (empty.includes(4)) return 4
  // pick corner
  const corners = empty.filter((index) => [0, 2, 6, 8].includes(index))
  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)]
  }
  // fallback random
  return empty[Math.floor(Math.random() * empty.length)] ?? -1
}

export default function TicTacToe({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(''))
  const [turn, setTurn] = useState<'player' | 'cpu'>('player')
  const [message, setMessage] = useState('Place three Xs in a row before the bot strikes.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setBoard(Array(9).fill(''))
    setTurn('player')
    setMessage('Place three Xs in a row before the bot strikes.')
    setSolved(false)
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  useEffect(() => {
    if (turn !== 'cpu' || solved) return
    const id = window.setTimeout(() => {
      const move = pickCpuMove(board)
      if (move === -1) return
      const next = [...board]
      next[move] = 'O'
      const winner = detectWinner(next)
      setBoard(next)
      if (winner === 'cpu') {
        setSolved(true)
        setMessage('Bot claimed the line. Reset to try again.')
      } else if (winner === 'draw') {
        setSolved(true)
        setMessage('Draw game. Reset for another round.')
      } else {
        setTurn('player')
        setMessage('Your move!')
      }
    }, 500)
    return () => window.clearTimeout(id)
  }, [board, solved, turn])

  function handleSelect(index: number) {
    if (solved || turn !== 'player') return
    if (board[index]) return
    const next = [...board]
    next[index] = 'X'
    setBoard(next)
    const winner = detectWinner(next)
    if (winner === 'player') {
      setSolved(true)
      setMessage('You won ✨')
      const elapsed = Date.now() - startedAt
      updateBest(elapsed)
      onWin()
    } else if (winner === 'draw') {
      setSolved(true)
      setMessage('Draw. Reset to play again.')
    } else {
      setTurn('cpu')
      setMessage('Bot is thinking…')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best win</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest victory stored locally.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Turn</p>
          <p className="text-2xl font-semibold text-ink">{turn === 'player' ? 'You' : 'Bot'}</p>
          <p className="text-xs text-ink/60">Bot moves automatically.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Status</p>
          <p className="text-2xl font-semibold text-ink">{solved ? 'Finished' : 'In play'}</p>
          <p className="text-xs text-ink/60">Beat the bot once to win.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {board.map((value, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSelect(index)}
            className={cx(
              'tap-target aspect-square rounded-[1.75rem] border-2 border-ink/10 bg-white/80 text-4xl font-semibold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
              value === 'X' && 'text-ink',
              value === 'O' && 'text-lavender',
              solved && winnerStyle(board, index),
            )}
            aria-label={`Play at cell ${index + 1}`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset board
        </button>
      </div>
    </div>
  )
}

function winnerStyle(board: Cell[], index: number) {
  const winningLine = winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c])
  if (!winningLine) return ''
  return winningLine.includes(index) ? 'bg-mint/40' : ''
}
