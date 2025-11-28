import { useMemo, useState } from 'react'

import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const emojiPool = ['🌸', '🌙', '🍓', '🌿', '🫧', '💌', '⭐', '🥞', '🎈', '🌊', '🍬']
const targetSequence = ['💌', '🌙', '🍓']

function shuffle(list: string[]) {
  return [...list].sort(() => Math.random() - 0.5)
}

export default function EmojiForage({ game, onWin }: MiniGameProps) {
  const [progress, setProgress] = useState(0)
  const [feedback, setFeedback] = useState('Find the requested emoji three times to win.')
  const [grid, setGrid] = useState(() => shuffle(emojiPool).slice(0, 9))
  const [hasWon, setHasWon] = useState(false)

  const target = useMemo(() => targetSequence[progress], [progress])

  function handlePick(emoji: string) {
    if (hasWon) return
    if (emoji === target) {
      const nextProgress = progress + 1
      setFeedback('Spark captured!')
      if (nextProgress === targetSequence.length) {
        setHasWon(true)
        onWin()
      } else {
        setProgress(nextProgress)
        setGrid(shuffle(emojiPool).slice(0, 9))
      }
    } else {
      setFeedback('Almost! Try another sparkle.')
    }
  }

  function reset() {
    setProgress(0)
    setFeedback('Find the requested emoji three times to win.')
    setGrid(shuffle(emojiPool).slice(0, 9))
    setHasWon(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/50">Current target</p>
        <div className="mt-2 flex items-center gap-2 text-2xl">
          <span role="img" aria-label="target emoji" className="drop-shadow">
            {target ?? '✨'}
          </span>
          <span className="text-sm text-ink/70">
            {progress >= targetSequence.length ? 'All secret stamps found!' : 'Tap the matching emoji below.'}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {grid.map((emoji) => (
          <button
            key={emoji + progress}
            type="button"
            onClick={() => handlePick(emoji)}
            className="tap-target aspect-square rounded-3xl border-2 border-ink/10 bg-white/90 text-3xl shadow-card transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
            aria-label={`Select ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{feedback}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Shuffle again
        </button>
        {hasWon && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Message trail secured 💫</span>}
      </div>
    </div>
  )
}
