import { useMemo, useState } from 'react'

import type { MiniGameProps } from '@/features/games/types'
import { cx } from '@/lib/cx'

const groups = [
  {
    id: 'tone',
    label: 'Tone',
    options: ['Radiant', 'Soft glow', 'Playfully dramatic'],
  },
  {
    id: 'verb',
    label: 'Action',
    options: ['carries me', 'anchors me', 'rewrites my day'],
  },
  {
    id: 'ending',
    label: 'Ending',
    options: ['like the first cup of chai', 'like a midnight slow dance', 'like sunshine sneaking in'],
  },
] as const

type SelectionMap = Record<(typeof groups)[number]['id'], string>

export default function ComplimentCrafter({ game, onWin }: MiniGameProps) {
  const [selections, setSelections] = useState<SelectionMap>(() => ({ tone: '', verb: '', ending: '' }))
  const [hasWon, setHasWon] = useState(false)

  const ready = useMemo(() => groups.every((group) => selections[group.id]), [selections])

  const preview = useMemo(() => {
    if (!ready) {
      return 'Choose a tone, an action, and an ending to craft tonight\'s message.'
    }
    return `My ${selections.tone.toLowerCase()} heart ${selections.verb}, ${selections.ending}.`
  }, [ready, selections])

  function handleSelect(groupId: keyof SelectionMap, option: string) {
    if (hasWon) return
    setSelections((prev) => ({ ...prev, [groupId]: option }))
  }

  function handleCompose() {
    if (!ready || hasWon) return
    setHasWon(true)
    onWin()
  }

  function reset() {
    setHasWon(false)
    setSelections({ tone: '', verb: '', ending: '' })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="rounded-3xl border-2 border-ink/10 bg-white/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">{group.label}</p>
            <div className="mt-2 flex flex-col gap-2">
              {group.options.map((option) => {
                const isActive = selections[group.id] === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(group.id, option)}
                    className={cx(
                      'rounded-2xl border-2 border-ink/10 px-3 py-2 text-left text-sm font-semibold text-ink/70 transition hover:border-lavender/60 hover:bg-lavender/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
                      isActive && 'border-lavender bg-lavender/20 text-ink',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/70 p-4 text-sm text-ink/80">
        <p className="font-semibold text-ink">Draft</p>
        <p className="mt-1 leading-relaxed">{preview}</p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <button
          type="button"
          onClick={handleCompose}
          disabled={!ready}
          className={cx(
            'tap-target rounded-2xl border border-ink/10 bg-ink text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
            !ready && 'cursor-not-allowed opacity-50 hover:scale-100 hover:shadow-none',
          )}
        >
          Send compliment
        </button>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Clear
        </button>
        {hasWon && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Compliment delivered 💌</span>}
      </div>
    </div>
  )
}
