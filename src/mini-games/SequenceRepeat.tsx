import { useCallback, useEffect, useState } from 'react'

import { formatDuration, useGameMetric } from '@/features/games/metrics'
import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const pads = [
  { id: 0, label: 'Rose', base: 'bg-blush/40', active: 'bg-blush text-white' },
  { id: 1, label: 'Mint', base: 'bg-mint/40', active: 'bg-mint text-ink' },
  { id: 2, label: 'Dusk', base: 'bg-lavender/40', active: 'bg-lavender text-ink' },
  { id: 3, label: 'Ink', base: 'bg-ink/20', active: 'bg-ink text-white' },
]

const roundGoal = {
  Cozy: 4,
  Chill: 5,
  Spicy: 6,
}

type DifficultyKey = keyof typeof roundGoal

export default function SequenceRepeat({ game, onWin }: MiniGameProps) {
  const goal = roundGoal[game.difficulty as DifficultyKey] ?? roundGoal.Chill
  const { best, updateBest } = useGameMetric(game.id, 'time', 'lower')
  const [sequence, setSequence] = useState<number[]>([])
  const [showing, setShowing] = useState(false)
  const [activePad, setActivePad] = useState<number | null>(null)
  const [userIndex, setUserIndex] = useState(0)
  const [status, setStatus] = useState('Tap start to hear the pattern.')
  const [complete, setComplete] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  const reset = useCallback(() => {
    setSequence([])
    setShowing(false)
    setActivePad(null)
    setUserIndex(0)
    setComplete(false)
    setStatus('Tap start to hear the pattern.')
    setStartedAt(null)
  }, [])

  useEffect(() => {
    reset()
  }, [game.id, game.difficulty, reset])

  useEffect(() => {
    if (!showing || sequence.length === 0) return
    const timeouts: number[] = []
    sequence.forEach((padIndex, idx) => {
      timeouts.push(
        window.setTimeout(() => {
          setActivePad(padIndex)
        }, idx * 700),
      )
      timeouts.push(
        window.setTimeout(() => {
          setActivePad(null)
        }, idx * 700 + 400),
      )
    })
    timeouts.push(
      window.setTimeout(() => {
        setShowing(false)
        setUserIndex(0)
        setStatus('Repeat the glow with taps.')
      }, sequence.length * 700 + 450),
    )
    return () => timeouts.forEach((id) => window.clearTimeout(id))
  }, [sequence, showing])

  function startGame() {
    const first = Math.floor(Math.random() * pads.length)
    setSequence([first])
    setShowing(true)
    setComplete(false)
    setStatus('Watch closely…')
    setStartedAt(Date.now())
  }

  function extendSequence(prev: number[]) {
    const next = [...prev, Math.floor(Math.random() * pads.length)]
    setSequence(next)
    setShowing(true)
  }

  function handlePad(index: number) {
    if (showing || sequence.length === 0 || complete) return
    setActivePad(index)
    window.setTimeout(() => setActivePad(null), 200)
    if (sequence[userIndex] === index) {
      const nextIndex = userIndex + 1
      if (nextIndex === sequence.length) {
        if (sequence.length >= goal) {
          setComplete(true)
          setStatus('Sequence mastered ✨')
          const elapsed = startedAt ? Date.now() - startedAt : 0
          updateBest(elapsed)
          onWin()
        } else {
          setStatus('Sequence extended. Watch again.')
          extendSequence(sequence)
        }
      } else {
        setUserIndex(nextIndex)
      }
    } else {
      setStatus('Pattern broke! Restarting from one note.')
      const first = Math.floor(Math.random() * pads.length)
      setSequence([first])
      setShowing(true)
      setUserIndex(0)
      setStartedAt(Date.now())
      setComplete(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Length</p>
          <p className="text-2xl font-semibold text-ink">
            {sequence.length}/{goal}
          </p>
          <p className="text-xs text-ink/60">Survive {goal} rounds</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Best time</p>
          <p className="text-2xl font-semibold text-ink">{formatDuration(best)}</p>
          <p className="text-xs text-ink/60">Fastest completion saved.</p>
        </div>
        <div className="rounded-3xl border-2 border-ink/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/50">State</p>
          <p className="text-2xl font-semibold text-ink">{complete ? 'Cleared' : showing ? 'Showing' : 'Listening'}</p>
          <p className="text-xs text-ink/60">Tap start to begin.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pads.map((pad) => (
          <button
            key={pad.id}
            type="button"
            onClick={() => handlePad(pad.id)}
            className={cx(
              'tap-target rounded-3xl border-2 border-ink/10 py-8 text-center text-sm font-semibold uppercase tracking-[0.3em] text-ink/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
              pad.base,
              activePad === pad.id && pad.active,
            )}
          >
            {pad.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="pixel-border rounded-2xl px-4 py-2">{status}</span>
        <button type="button" onClick={startGame} className="tap-target rounded-2xl bg-ink text-white">
          {sequence.length === 0 ? 'Start' : 'Restart'}
        </button>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Clear board
        </button>
        {complete && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Signal synced</span>}
      </div>
    </div>
  )
}
