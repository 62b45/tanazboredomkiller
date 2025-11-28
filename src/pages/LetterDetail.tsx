import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'
import { getLetterById, revealLetterBody } from '@/features/letters/catalog'
import { hasLettersUnlocked } from '@/features/letters/secret'
import { useTypewriter } from '@/hooks/useTypewriter'

export default function LetterDetail() {
  const { letterId } = useParams<{ letterId: string }>()
  const navigate = useNavigate()
  const unlocked = hasLettersUnlocked()
  const letter = useMemo(() => (letterId ? getLetterById(letterId) : undefined), [letterId])

  useEffect(() => {
    if (!unlocked) {
      navigate('/letters', { replace: true })
    }
  }, [navigate, unlocked])

  if (!letter) {
    return (
      <section className="space-y-6">
        <PixelCard className="space-y-3 text-center">
          <p className="text-xl font-semibold text-ink">Letter not found.</p>
          <Link to="/letters" className="tap-target mx-auto rounded-2xl bg-ink text-white">
            Back to letters
          </Link>
        </PixelCard>
      </section>
    )
  }

  const body = useMemo(() => revealLetterBody(letter), [letter])
  const { value, isComplete, revealAll } = useTypewriter(body, 20)

  return (
    <section className="space-y-4">
      <Link to="/letters" className="tap-target inline-flex rounded-2xl border border-ink/10 bg-white/70 text-ink">
        ← Letters hub
      </Link>
      <PixelCard accent="lavender" className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">{letter.tone}</p>
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-4xl">
            {letter.emoji}
          </span>
          <h1 className="text-3xl font-semibold text-ink">{letter.title}</h1>
        </div>
      </PixelCard>
      <PixelCard accent="mint" className="space-y-4">
        <div className="space-y-3 text-base leading-relaxed text-ink">
          <p className="whitespace-pre-line">{value}</p>
        </div>
        {!isComplete && (
          <button type="button" onClick={revealAll} className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-sm text-ink">
            Skip animation
          </button>
        )}
      </PixelCard>
    </section>
  )
}
