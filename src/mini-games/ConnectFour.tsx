import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const ROWS = 6
const COLS = 7

type Cell = '' | 'P' | 'C'
type Board = Cell[][]

function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''))
}

function dropDisc(board: Board, column: number, token: Cell) {
  const copy = board.map((row) => row.slice())
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!copy[row][column]) {
      copy[row][column] = token
      return { board: copy, row }
    }
  }
  return null
}

function previewDrop(board: Board, column: number, token: Cell) {
  const copy = board.map((row) => row.slice())
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!copy[row][column]) {
      copy[row][column] = token
      return copy
    }
  }
  return null
}

function checkWinner(board: Board, token: Cell) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (col + 3 < COLS && board[row][col] === token && board[row][col + 1] === token && board[row][col + 2] === token && board[row][col + 3] === token) {
        return true
      }
      if (row + 3 < ROWS && board[row][col] === token && board[row + 1][col] === token && board[row + 2][col] === token && board[row + 3][col] === token) {
        return true
      }
      if (
        row + 3 < ROWS &&
        col + 3 < COLS &&
        board[row][col] === token &&
        board[row + 1][col + 1] === token &&
        board[row + 2][col + 2] === token &&
        board[row + 3][col + 3] === token
      ) {
        return true
      }
      if (
        row - 3 >= 0 &&
        col + 3 < COLS &&
        board[row][col] === token &&
        board[row - 1][col + 1] === token &&
        board[row - 2][col + 2] === token &&
        board[row - 3][col + 3] === token
      ) {
        return true
      }
    }
  }
  return false
}

function isBoardFull(board: Board) {
  return board[0].every(Boolean)
}

function pickCpuColumn(board: Board) {
  const options = Array.from({ length: COLS }, (_, col) => col).filter((col) => !board[0][col])
  // attempt win
  for (const col of options) {
    const preview = previewDrop(board, col, 'C')
    if (preview && checkWinner(preview, 'C')) {
      return col
    }
  }
  // block player
  for (const col of options) {
    const preview = previewDrop(board, col, 'P')
    if (preview && checkWinner(preview, 'P')) {
      return col
    }
  }
  const priority = [3, 2, 4, 1, 5, 0, 6]
  for (const col of priority) {
    if (options.includes(col)) {
      return col
    }
  }
  return options[0] ?? -1
}

export default function ConnectFour({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [board, setBoard] = useState<Board>(() => createBoard())
  const [turn, setTurn] = useState<'player' | 'cpu'>('player')
  const [message, setMessage] = useState('Drop discs to connect four before the AI does.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setBoard(createBoard())
    setTurn('player')
    setSolved(false)
    setMessage('Drop discs to connect four before the AI does.')
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  useEffect(() => {
    if (turn !== 'cpu' || solved) return
    const id = window.setTimeout(() => {
      const column = pickCpuColumn(board)
      if (column === -1) return
      const result = dropDisc(board, column, 'C')
      if (!result) return
      const nextBoard = result.board
      setBoard(nextBoard)
      if (checkWinner(nextBoard, 'C')) {
        setSolved(true)
        setMessage('AI formed the line. Reset to retry.')
      } else if (isBoardFull(nextBoard)) {
        setSolved(true)
        setMessage('It\'s a draw. Reset for another round.')
      } else {
        setTurn('player')
        setMessage('Your turn!')
      }
    }, 600)
    return () => window.clearTimeout(id)
  }, [board, solved, turn])

  function handleDrop(column: number) {
    if (solved || turn !== 'player') return
    const result = dropDisc(board, column, 'P')
    if (!result) {
      setMessage('That column is full.')
      return
    }
    const nextBoard = result.board
    setBoard(nextBoard)
    if (checkWinner(nextBoard, 'P')) {
      setSolved(true)
      const elapsed = Date.now() - startedAt
      setMessage('Connection secured ✨')
      updateBest(elapsed)
      onWin()
    } else if (isBoardFull(nextBoard)) {
      setSolved(true)
      setMessage('It\'s a draw. Reset to play again.')
    } else {
      setTurn('cpu')
      setMessage('AI is thinking…')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best win</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest victory logged.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Turn</p>
          <p className="text-2xl font-semibold text-ink">{turn === 'player' ? 'You' : 'AI'}</p>
          <p className="text-xs text-ink/60">Tap a column to drop.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Status</p>
          <p className="text-2xl font-semibold text-ink">{solved ? 'Finished' : 'In play'}</p>
          <p className="text-xs text-ink/60">Connect four horizontally, vertically, or diagonally.</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: COLS }, (_, col) => (
          <button
            key={`col-${col}`}
            type="button"
            onClick={() => handleDrop(col)}
            className="tap-target rounded-2xl border border-ink/10 bg-white/70 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink"
          >
            Drop {col + 1}
          </button>
        ))}
      </div>
      <div className="rounded-[2rem] border-2 border-ink/10 bg-white/80 p-4">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div key={`${r}-${c}`} className="flex items-center justify-center">
                <div
                  className={cx(
                    'aspect-square w-10 rounded-full border border-ink/10 bg-white/60 text-xl',
                    cell === 'P' && 'bg-mint/60 text-ink',
                    cell === 'C' && 'bg-ink text-white',
                  )}
                />
              </div>
            )),
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset grid
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Round logged</span>}
      </div>
    </div>
  )
}
