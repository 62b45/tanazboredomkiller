import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const options = [
  { id: 'rock', label: 'Rock', emoji: '🪨' },
  { id: 'paper', label: 'Paper', emoji: '📜' },
  { id: 'scissors', label: 'Scissors', emoji: '✂️' },
]

const beats: Record<string, string> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
}

const targetWins = 3

type Choice = 'rock' | 'paper' | 'scissors'

type Score = {
  player: number
  cpu: number
}

export default function RockPaperScissors({ game, onWin }: MiniGameProps) {
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [score, setScore] = useState<Score>({ player: 0, cpu: 0 })
  const [history, setHistory] = useState<Array<{ player: Choice; cpu: Choice; result: string }>>([])
  const [message, setMessage] = useState('First to three wins. Tap a symbol to throw.')
  const [finished, setFinished] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setScore({ player: 0, cpu: 0 })
    setHistory([])
    setMessage('First to three wins. Tap a symbol to throw.')
    setFinished(false)
    setStartedAt(Date.now())
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function handlePlay(choice: Choice) {
    if (finished) return
    const cpuChoice = options[Math.floor(Math.random() * options.length)].id as Choice
    if (choice === cpuChoice) {
      setMessage('Tie — try again')
      setHistory((prev) => [...prev.slice(-4), { player: choice, cpu: cpuChoice, result: 'tie' }])
      return
    }
    const playerWon = beats[choice] === cpuChoice
    setMessage(playerWon ? 'You scored ✨' : 'CPU scored this round')
    setHistory((prev) => [...prev.slice(-4), { player: choice, cpu: cpuChoice, result: playerWon ? 'win' : 'loss' }])
    setScore((prev) => {
      const next = {
        player: prev.player + (playerWon ? 1 : 0),
        cpu: prev.cpu + (playerWon ? 0 : 1),
      }
      if (next.player === targetWins) {
        setFinished(true)
        const elapsed = Date.now() - startedAt
        setMessage('Match secured!')
        updateBest(elapsed)
        onWin()
      } else if (next.cpu === targetWins) {
        setFinished(true)
        setMessage('CPU won the match. Reset to try again.')
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best match</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest victory logged.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Score</p>
          <p className="text-2xl font-semibold text-ink">
            {score.player} : {score.cpu}
          </p>
          <p className="text-xs text-ink/60">First to {targetWins}</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Rounds logged</p>
          <p className="text-2xl font-semibold text-ink">{history.length}</p>
          <p className="text-xs text-ink/60">Last five shown below.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handlePlay(option.id as Choice)}
            className={cx(
              'tap-target rounded-3xl border-2 border-ink/10 bg-white/80 py-6 text-center text-3xl font-semibold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint',
              finished && 'opacity-60',
            )}
          >
            <span aria-hidden>{option.emoji}</span>
            <span className="block text-sm font-semibold text-ink/70">{option.label}</span>
          </button>
        ))}
      </div>
      <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4 text-sm text-ink/70">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Last throws</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {history.length === 0 && <span>No rounds yet.</span>}
          {history.map((entry, idx) => (
            <span
              key={idx}
              className={cx(
                'rounded-2xl px-3 py-1 font-semibold uppercase tracking-[0.3em]',
                entry.result === 'win' && 'bg-mint/40 text-ink',
                entry.result === 'loss' && 'bg-blush/40 text-ink',
                entry.result === 'tie' && 'bg-ink/10 text-ink/70',
              )}
            >
              {entry.player} vs {entry.cpu}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset match
        </button>
      </div>
    </div>
  )
}
