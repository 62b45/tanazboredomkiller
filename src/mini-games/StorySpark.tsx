import { FormEvent, useMemo, useState } from 'react'

import type { MiniGameProps } from '@/features/games/types'

const prompts = [
  {
    id: 'setting',
    label: 'Setting',
    placeholder: 'Sunlit rooftop, noodle shop, cozy bus stop…',
  },
  {
    id: 'time',
    label: 'Time',
    placeholder: 'Golden hour, midnight, third coffee of the day…',
  },
  {
    id: 'surprise',
    label: 'Surprise detail',
    placeholder: 'A stray cat, confetti meteor, kind barista…',
  },
] as const

type AnswerMap = Record<(typeof prompts)[number]['id'], string>

export default function StorySpark({ game, onWin }: MiniGameProps) {
  const [answers, setAnswers] = useState<AnswerMap>(() => ({ setting: '', time: '', surprise: '' }))
  const [hasWon, setHasWon] = useState(false)

  const filled = useMemo(() => prompts.every((prompt) => answers[prompt.id].trim().length >= 6), [answers])

  const summary = useMemo(() => {
    if (!filled) {
      return 'Jot down three details to light up a micro story.'
    }
    return `We meet at ${answers.setting.trim()}, right around ${answers.time.trim()}, when ${answers.surprise.trim()} changes everything.`
  }, [answers, filled])

  function handleChange(id: keyof AnswerMap, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!filled || hasWon) return
    setHasWon(true)
    onWin()
  }

  function reset() {
    setAnswers({ setting: '', time: '', surprise: '' })
    setHasWon(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-ink/70">{game.summary}</p>
      <div className="grid gap-3">
        {prompts.map((prompt) => (
          <label key={prompt.id} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/50">{prompt.label}</span>
            <textarea
              required
              value={answers[prompt.id]}
              onChange={(event) => handleChange(prompt.id, event.target.value)}
              placeholder={prompt.placeholder}
              className="min-h-[80px] w-full rounded-3xl border-2 border-ink/10 bg-white/80 p-3 text-sm text-ink/80 focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender"
            />
          </label>
        ))}
      </div>
      <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/70 p-4 text-sm text-ink/80">
        <p className="font-semibold text-ink">Story beat</p>
        <p className="mt-1 leading-relaxed">{summary}</p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <button
          type="submit"
          disabled={!filled}
          className="tap-target rounded-2xl border border-ink/10 bg-ink text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save story spark
        </button>
        <button type="button" onClick={reset} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          Clear
        </button>
        {hasWon && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Story lantern lit 🏮</span>}
      </div>
    </form>
  )
}
