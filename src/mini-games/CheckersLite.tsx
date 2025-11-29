import { useCallback, useEffect, useState } from 'react'

import { useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

type Cell = '' | 'P' | 'E'
type Board = Cell[][]

type Move = {
  row: number
  col: number
  capture?: { row: number; col: number }
}

const baseBoard: Board = [
  ['', 'E', '', ''],
  ['', '', 'E', ''],
  ['', 'P', '', ''],
  ['P', '', '', ''],
]

const size = 4

function cloneBoard(board: Board): Board {
  return board.map((row) => row.slice())
}

function getMoves(board: Board, row: number, col: number): Move[] {
  const directions = [
    { dr: -1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: 1, dc: 1 },
  ]
  const moves: Move[] = []
  for (const dir of directions) {
    const nextRow = row + dir.dr
    const nextCol = col + dir.dc
    if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) continue
    const target = board[nextRow][nextCol]
    if (target === '') {
      moves.push({ row: nextRow, col: nextCol })
    } else if (target === 'E') {
      const jumpRow = nextRow + dir.dr
      const jumpCol = nextCol + dir.dc
      if (jumpRow < 0 || jumpRow >= size || jumpCol < 0 || jumpCol >= size) continue
      if (board[jumpRow][jumpCol] === '') {
        moves.push({ row: jumpRow, col: jumpCol, capture: { row: nextRow, col: nextCol } })
      }
    }
  }
  return moves
}

function enemyCount(board: Board) {
  return board.flat().filter((cell) => cell === 'E').length
}

export default function CheckersLite({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'score', 'lower')
  const [board, setBoard] = useState<Board>(() => cloneBoard(baseBoard))
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState('Capture both opposing tokens using diagonal jumps.')
  const [solved, setSolved] = useState(false)

  const reset = useCallback(() => {
    setBoard(cloneBoard(baseBoard))
    setSelected(null)
    setMoves(0)
    setSolved(false)
    setMessage('Capture both opposing tokens using diagonal jumps.')
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function handleSelect(row: number, col: number) {
    if (solved) return
    if (board[row][col] === 'P') {
      setSelected({ row, col })
      setMessage('Tile selected. Tap a highlighted move.')
    } else if (selected) {
      const possible = getMoves(board, selected.row, selected.col)
      const move = possible.find((option) => option.row === row && option.col === col)
      if (move) {
        executeMove(move)
      } else {
        setSelected(null)
      }
    }
  }

  function executeMove(move: Move) {
    if (!selected) return
    const next = cloneBoard(board)
    next[selected.row][selected.col] = ''
    next[move.row][move.col] = 'P'
    if (move.capture) {
      next[move.capture.row][move.capture.col] = ''
    }
    const nextMoves = moves + 1
    setBoard(next)
    setSelected(null)
    setMoves(nextMoves)
    const remaining = enemyCount(next)
    if (remaining === 0) {
      setSolved(true)
      setMessage('All enemy pieces captured ✨')
      updateBest(nextMoves)
      onWin()
    } else {
      setMessage('Great jump. Keep sweeping the board.')
    }
  }

  const highlightMoves = selected ? getMoves(board, selected.row, selected.col) : []

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Moves</p>
          <p className="text-2xl font-semibold text-ink">{moves}</p>
          <p className="text-xs text-ink/60">Lower wins bragging rights.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best</p>
          <p className="text-2xl font-semibold text-ink">{best ?? '—'}</p>
          <p className="text-xs text-ink/60">Fewest moves tracked.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Enemies left</p>
          <p className="text-2xl font-semibold text-ink">{enemyCount(board)}</p>
          <p className="text-xs text-ink/60">Clear them all to win.</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selected?.row === r && selected.col === c
            const isMove = highlightMoves.some((move) => move.row === r && move.col === c)
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleSelect(r, c)}
                className={cx(
                  'tap-target aspect-square rounded-2xl border-2 border-ink/15 bg-white/80 text-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
                  (r + c) % 2 === 0 ? 'bg-ink/5' : 'bg-white/60',
                  isSelected && 'ring-2 ring-ink',
                  isMove && 'border-mint bg-mint/30',
                )}
                aria-label={`Row ${r + 1} column ${c + 1}`}
              >
                {cell === 'P' && '🟢'}
                {cell === 'E' && '🔺'}
              </button>
            )
          }),
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset board
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Checkers mastered</span>}
      </div>
    </div>
  )
}
