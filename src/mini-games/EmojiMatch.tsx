import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const emojiSet = ['🌸', '🌿', '🍓', '🌙', '🎧', '🍰', '💡', '🌊', '💌', '💫', '🥨', '🧃']
const goalMap = {
  Cozy: 6,
  Chill: 8,
  Spicy: 10,
}

type DifficultyKey = keyof typeof goalMap

function shuffle<T>(list: T[]) {
  return [...list].sort(() => Math.random() - 0.5)
}

export default function EmojiMatch({ game, onWin }: MiniGameProps) {
  const goal = goalMap[game.difficulty as DifficultyKey] ?? goalMap.Chill
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [target, setTarget] = useState<string>('🌸')
  const [choices, setChoices] = useState<string[]>(() => shuffle(emojiSet).slice(0, 4))
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Tap the matching emoji before the grid reshuffles.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const createRound = useCallback(() => {
    const pool = shuffle(emojiSet)
    const nextTarget = pool[0]
    const nextChoices = shuffle([nextTarget, ...pool.slice(1, 5)]).slice(0, 4)
    setTarget(nextTarget)
    setChoices(nextChoices)
  }, [])

  const reset = useCallback(() => {
    setScore(0)
    setMessage('Tap the matching emoji before the grid reshuffles.')
    setSolved(false)
    setStartedAt(Date.now())
    createRound()
  }, [createRound])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function handlePick(emoji: string) {
    if (solved) return
    if (emoji === target) {
      const nextScore = score + 1
      setScore(nextScore)
      if (nextScore >= goal) {
        setSolved(true)
        setMessage('Perfect streak ✨')
        const elapsed = Date.now() - startedAt
        updateBest(elapsed)
        onWin()
      } else {
        setMessage('Nice catch!')
        createRound()
      }
    } else {
      setMessage('Missed! Try another before the shuffle.')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Target</p>
          <p className="text-3xl" role="img" aria-label="target emoji">
            {target}
          </p>
          <p className="text-xs text-ink/60">Find this emoji</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Matches</p>
          <p className="text-2xl font-semibold text-ink">
            {score}/{goal}
          </p>
          <p className="text-xs text-ink/60">Streak to win</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest streak saved.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {choices.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handlePick(emoji)}
            className={cx(
              'tap-target rounded-3xl border-2 border-ink/10 bg-white/80 py-6 text-center text-4xl shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint',
              solved && 'opacity-60',
            )}
            aria-label={`Pick ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset streak
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Emoji relay complete</span>}
      </div>
    </div>
  )
}
