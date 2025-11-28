import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const emojiPool = ['🌸', '🌿', '🍓', '🎧', '🍰', '💎', '🧊', '🪻', '🫧', '🪴']
const pairCountMap = {
  Cozy: 4,
  Chill: 5,
  Spicy: 6,
}

type DifficultyKey = keyof typeof pairCountMap

type Card = {
  id: number
  emoji: string
  matched: boolean
}

function shuffle<T>(list: T[]) {
  return [...list].sort(() => Math.random() - 0.5)
}

function createDeck(pairCount: number): Card[] {
  const picks = shuffle(emojiPool).slice(0, pairCount)
  return shuffle([...picks, ...picks]).map((emoji, index) => ({ id: index, emoji, matched: false }))
}

export default function MemoryFlip({ game, onWin }: MiniGameProps) {
  const pairCount = pairCountMap[game.difficulty as DifficultyKey] ?? pairCountMap.Chill
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [cards, setCards] = useState<Card[]>(() => createDeck(pairCount))
  const [flipped, setFlipped] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState('Flip cards to find each pair.')
  const [solved, setSolved] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())

  const reset = useCallback(() => {
    setCards(createDeck(pairCount))
    setFlipped([])
    setLocked(false)
    setMoves(0)
    setSolved(false)
    setMessage('Flip cards to find each pair.')
    setStartedAt(Date.now())
  }, [pairCount])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  function handleFlip(index: number) {
    if (solved || locked) return
    if (flipped.includes(index)) return
    if (cards[index].matched) return
    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)
    if (nextFlipped.length === 2) {
      setLocked(true)
      setTimeout(() => evaluatePair(nextFlipped[0], nextFlipped[1]), 600)
    }
  }

  function evaluatePair(aIndex: number, bIndex: number) {
    const first = cards[aIndex]
    const second = cards[bIndex]
    const nextMoves = moves + 1
    setMoves(nextMoves)
    if (first.emoji === second.emoji) {
      const updated = cards.map((card, idx) => (idx === aIndex || idx === bIndex ? { ...card, matched: true } : card))
      setCards(updated)
      const allMatched = updated.every((card) => card.matched)
      if (allMatched) {
        setSolved(true)
        const elapsed = Date.now() - startedAt
        setMessage('All pairs found ✨')
        updateBest(elapsed)
        onWin()
      } else {
        setMessage('Pair matched!')
      }
    } else {
      setMessage('Not a match — try again.')
    }
    setFlipped([])
    setLocked(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Pairs</p>
          <p className="text-2xl font-semibold text-ink">
            {cards.filter((card) => card.matched).length / 2}/{pairCount}
          </p>
          <p className="text-xs text-ink/60">Match them all to win.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest round stored locally.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Turns</p>
          <p className="text-2xl font-semibold text-ink">{moves}</p>
          <p className="text-xs text-ink/60">Stay mindful.</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {cards.map((card, index) => {
          const isRevealed = card.matched || flipped.includes(index)
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(index)}
              className={cx(
                'tap-target aspect-square rounded-2xl border-2 border-ink/10 bg-white/80 text-3xl shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
                card.matched && 'bg-mint/40 text-ink',
              )}
              aria-label={isRevealed ? `Card showing ${card.emoji}` : 'Hidden card'}
            >
              {isRevealed ? card.emoji : '❔'}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{message}</span>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Reset cards
        </button>
        {solved && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Board memorized</span>}
      </div>
    </div>
  )
}
