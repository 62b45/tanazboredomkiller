import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const palette = [
  { id: 'rose', label: 'Rosewater', swatch: 'bg-blush/60 border-blush/70 text-ink' },
  { id: 'mint', label: 'Mint fog', swatch: 'bg-mint/60 border-mint/70 text-ink' },
  { id: 'dusk', label: 'Dusk', swatch: 'bg-lavender/60 border-lavender/70 text-ink' },
  { id: 'ink', label: 'Starlit ink', swatch: 'bg-ink/60 border-ink/70 text-white' },
  { id: 'sun', label: 'Sunray', swatch: 'bg-amber-200 border-amber-300 text-ink' },
]

const configs = {
  Cozy: { rounds: 3, baseLength: 3 },
  Chill: { rounds: 4, baseLength: 3 },
  Spicy: { rounds: 5, baseLength: 4 },
}

type DifficultyKey = keyof typeof configs

function createSequence(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * palette.length))
}

export default function ColorMatch({ game, onWin }: MiniGameProps) {
  const setup = configs[game.difficulty as DifficultyKey] ?? configs.Chill
  const threshold = useMemo(() => Math.ceil(setup.rounds * 0.6), [setup.rounds])
  const { best, updateBest } = useGameMetric(game.id, 'score', 'higher')
  const [round, setRound] = useState(1)
  const [target, setTarget] = useState(() => createSequence(setup.baseLength))
  const [guess, setGuess] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('Trace the palette from left to right.')
  const [finished, setFinished] = useState(false)

  const resetRounds = useCallback(() => {
    setRound(1)
    setScore(0)
    setGuess([])
    setFinished(false)
    setStatus('Trace the palette from left to right.')
    setTarget(createSequence(setup.baseLength))
  }, [setup.baseLength])

  const advanceRound = useCallback(
    (nextRound: number) => {
      const extra = Math.floor((nextRound - 1) / 2)
      setGuess([])
      setTarget(createSequence(setup.baseLength + extra))
    },
    [setup.baseLength],
  )

  useEffect(() => {
    resetRounds()
  }, [game.id, game.difficulty, resetRounds])

  function resolveRound(match: boolean) {
    const potentialScore = score + (match ? 1 : 0)
    if (match) {
      setScore(potentialScore)
      setStatus('Palette synced ✨')
    } else {
      setStatus('Sequence drifted, try again.')
    }
    if (round === setup.rounds) {
      setFinished(true)
      updateBest(potentialScore)
      if (potentialScore >= threshold) {
        setStatus('Palette memory glowing!')
        onWin()
      } else {
        setStatus('Need a few more perfect loops.')
      }
      return
    }
    const nextRound = round + 1
    setRound(nextRound)
    advanceRound(nextRound)
  }

  function handlePick(index: number) {
    if (finished) return
    const nextGuess = [...guess, index]
    setGuess(nextGuess)
    if (nextGuess.length === target.length) {
      const match = nextGuess.every((value, idx) => value === target[idx])
      resolveRound(match)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Round</p>
          <p className="text-2xl font-semibold text-ink">
            {round}/{setup.rounds}
          </p>
          <p className="text-xs text-ink/60">Hold at least {threshold} perfect loops.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Score</p>
          <p className="text-2xl font-semibold text-ink">{score}</p>
          <p className="text-xs text-ink/60">Each correct palette adds one.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best streak</p>
          <p className="text-2xl font-semibold text-ink">{best ?? '—'}</p>
          <p className="text-xs text-ink/60">Stored locally.</p>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Target palette</p>
        <div className="flex gap-2">
          {target.map((colorIndex, idx) => (
            <span
              key={`${idx}-${round}`}
              className={cx(
                'flex h-12 flex-1 items-center justify-center rounded-2xl border-2 text-xs font-semibold uppercase tracking-[0.35em]',
                palette[colorIndex].swatch,
              )}
            >
              {palette[colorIndex].label}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Your picks</p>
        <div className="flex gap-2">
          {target.map((_, idx) => {
            const value = guess[idx]
            return (
              <span
                key={idx}
                className={cx(
                  'flex h-12 flex-1 items-center justify-center rounded-2xl border-2 border-dashed text-xs font-semibold uppercase tracking-[0.35em] text-ink/50',
                  typeof value === 'number' && palette[value].swatch,
                )}
              >
                {typeof value === 'number' ? palette[value].label : '—'}
              </span>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {palette.map((color, index) => (
          <button
            key={color.id}
            type="button"
            onClick={() => handlePick(index)}
            className={cx(
              'tap-target rounded-2xl border-2 py-4 text-sm font-semibold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint',
              color.swatch,
            )}
          >
            {color.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{status}</span>
        <button type="button" onClick={resetRounds} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset palette
        </button>
        {finished && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Sequence logged</span>}
      </div>
    </div>
  )
}
