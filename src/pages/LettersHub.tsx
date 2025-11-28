import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'
import { letterCatalog, getLetterSnippet } from '@/features/letters/catalog'
import { hasLettersUnlocked, persistLettersUnlock, verifySecret } from '@/features/letters/secret'

export default function LettersHub() {
  const [unlocked, setUnlocked] = useState(() => hasLettersUnlocked())
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const totalLetters = letterCatalog.length

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (unlocked) return
    if (verifySecret(password)) {
      persistLettersUnlock()
      setUnlocked(true)
      setError('')
    } else {
      setError('That password felt off. Try whispering “jani na”.')
    }
  }

  const letterList = useMemo(() => letterCatalog, [])

  return (
    <section className="space-y-6">
      <PixelCard accent="lavender" shimmer className="space-y-3">
        <p className="typing-pill">Letters locker</p>
        <h1 className="text-3xl font-semibold text-ink">Warm letters</h1>
        <p className="text-sm text-ink/70">
          Fifteen letters stay hidden until you enter the shared password. It ignores casing, whitespace, and emoji so you can just type the feeling.
        </p>
        <p className="text-xs uppercase tracking-[0.35em] text-ink/50">Password hint</p>
        <p className="text-sm font-semibold text-ink">jani na</p>
      </PixelCard>

      {!unlocked && (
        <PixelCard accent="mint" className="space-y-4">
          <p className="text-sm text-ink/70">Prove you\'re us by entering the phrase we repeat after surprises.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="space-y-2 text-sm font-semibold text-ink">
              Secret phrase
              <input
                type="password"
                inputMode="text"
                autoComplete="off"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) {
                    setError('')
                  }
                }}
                className="w-full rounded-3xl border-2 border-ink/10 bg-white/80 px-4 py-3 text-base text-ink focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender"
                placeholder="jani na"
              />
            </label>
            {error && <p className="text-sm text-blush/80">{error}</p>}
            <button type="submit" className="tap-target rounded-2xl bg-ink text-white">
              Unlock letters
            </button>
          </form>
        </PixelCard>
      )}

      {unlocked && (
        <>
          <PixelCard accent="mint" className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Unlocked</p>
              <p className="text-sm text-ink/70">{totalLetters} letters are ready with a typewriter entrance.</p>
            </div>
            <Link to="/games" className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
              Beat more games
            </Link>
          </PixelCard>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {letterList.map((letter) => (
              <PixelCard
                key={letter.id}
                as={Link}
                to={`/letters/${letter.id}`}
                accent="blush"
                className="flex h-full flex-col justify-between gap-3 rounded-[1.75rem] text-left transition"
              >
                <div className="space-y-2">
                  <span aria-hidden className="text-2xl">
                    {letter.emoji}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{letter.title}</h2>
                    <p className="text-xs uppercase tracking-[0.35em] text-ink/50">{letter.tone}</p>
                  </div>
                  <p className="text-sm text-ink/75">{getLetterSnippet(letter)}</p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">Open letter →</span>
              </PixelCard>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
