import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const prompts = ['Lavender', 'Comet', 'Harbor', 'Quartz', 'Melody', 'Aurora', 'Atlas', 'Meadow', 'Saturn', 'Nebula', 'Saffron', 'Marsh', 'Oasis']

const configs = {
  Cozy: { rounds: 4, reveal: 3, respond: 6 },
  Chill: { rounds: 5, reveal: 3, respond: 5 },
  Spicy: { rounds: 6, reveal: 2, respond: 4 },
}

type DifficultyKey = keyof typeof configs

type Phase = 'idle' | 'show' | 'quiz' | 'done'

function shuffle<T>(list: T[]) {
  return [...list].sort(() => Math.random() - 0.5)
}

export default function FastRecall({ game, onWin }: MiniGameProps) {
  const config = configs[game.difficulty as DifficultyKey] ?? configs.Chill
  const threshold = Math.ceil(config.rounds * 0.6)
  const { best, updateBest } = useGameMetric(game.id, 'score', 'higher')
  const [phase, setPhase] = useState<Phase>('idle')
  const [round, setRound] = useState(0)
  const [target, setTarget] = useState<string | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [timer, setTimer] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Tap begin to view the first prompt.')
  const [solved, setSolved] = useState(false)

  const reset = useCallback(() => {
    setPhase('idle')
    setRound(0)
    setScore(0)
    setOptions([])
    setTarget(null)
    setTimer(0)
    setSolved(false)
    setMessage('Tap begin to view the first prompt.')
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return
    if (timer === 0) {
      if (phase === 'show') {
        setPhase('quiz')
        setTimer(config.respond)
        setMessage('Which word just appeared?')
      } else if (phase === 'quiz') {
        setMessage(`Time up! It was ${target ?? 'that word'}.`)
        resolveRound(false)
      }
      return
    }
    const id = window.setTimeout(() => setTimer((prev) => prev - 1), 1000)
    return () => window.clearTimeout(id)
  }, [config.respond, phase, resolveRound, target, timer])

  const beginRound = useCallback(
    (roundNumber: number) => {
      const pool = shuffle(prompts)
      const nextTarget = pool[0]
      const nextOptions = shuffle([nextTarget, ...pool.slice(1, 4)])
      setPhase('show')
      setRound(roundNumber)
      setTarget(nextTarget)
      setOptions(nextOptions)
      setTimer(config.reveal)
      setMessage('Memorize this prompt…')
    },
    [config.reveal],
  )

  const resolveRound = useCallback(
    (correct: boolean) => {
      const updatedScore = correct ? score + 1 : score
      setScore(updatedScore)
      const nextRound = round + 1
      if (nextRound > config.rounds) {
        setPhase('done')
        updateBest(updatedScore)
        if (updatedScore >= threshold) {
          setMessage('Recall champion ✨')
          setSolved(true)
          onWin()
        } else {
          setMessage('Need a few more hits—try again!')
        }
      } else {
        beginRound(nextRound)
      }
    },
    [beginRound, config.rounds, onWin, round, score, threshold, updateBest],
  )

  function handleStart() {
    setScore(0)
    setSolved(false)
    beginRound(1)
  }

  function handleAnswer(choice: string) {
    if (phase !== 'quiz' || !target) return
    const correct = choice === target
    setMessage(correct ? 'Correct memory!' : `Nope, it was ${target}.`)
    resolveRound(correct)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Round</p>
          <p className="text-2xl font-semibold text-ink">
            {round}/{config.rounds}
          </p>
          <p className="text-xs text-ink/60">Stay above {threshold} correct</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Score</p>
          <p className="text-2xl font-semibold text-ink">{score}</p>
          <p className="text-xs text-ink/60">{solved ? 'Goal met' : 'Keep stacking wins'}</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best score</p>
          <p className="text-2xl font-semibold text-ink">{best ?? '—'}</p>
          <p className="text-xs text-ink/60">Stored locally.</p>
        </div>
      </div>
      <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Timer</p>
        <p className="text-4xl font-semibold text-ink">{timer}s</p>
        <p className="text-sm text-ink/70">{phase === 'show' ? 'Watch & memorize' : phase === 'quiz' ? 'Answer now' : 'Awaiting start'}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 p-6 text-center text-2xl font-semibold text-ink">
          {phase === 'show' && target}
          {phase === 'idle' && 'Press begin'}
          {phase === 'quiz' && 'Select the prompt below'}
          {phase === 'done' && 'Session complete'}
        </div>
        <div className="space-y-3">
          <button type="button" onClick={handleStart} className="tap-target w-full rounded-3xl bg-ink py-4 text-white">
            {phase === 'idle' ? 'Begin round' : 'Restart session'}
          </button>
          <button type="button" onClick={reset} className="tap-target w-full rounded-3xl border border-ink/10 bg-white/70 text-ink">
            Reset progress
          </button>
          <p className="text-sm text-ink/60">{message}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(option)}
            className={cx(
              'tap-target rounded-3xl border-2 border-ink/10 bg-white/80 py-4 text-center text-sm font-semibold uppercase tracking-[0.3em] text-ink/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint',
              phase !== 'quiz' && 'opacity-60',
            )}
            disabled={phase !== 'quiz'}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
