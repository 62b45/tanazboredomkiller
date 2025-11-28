import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'
import { gameCatalog } from '@/features/games/catalog'
import { hasSecretPopupBeenShown, markSecretPopupShown, useGameProgress } from '@/features/games/progress'
import { useMiniGameComponent } from '@/features/games/lazy'
import { hasLettersUnlocked, rememberSecretHint } from '@/features/letters/secret'

export default function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const game = useMemo(() => gameCatalog.find((entry) => entry.id === gameId), [gameId])
  const fallbackResolver = gameCatalog[0]?.resolver ?? 'starlight-connect'
  const { completedIds, markComplete } = useGameProgress(gameCatalog)
  const { Component, loading, error, reload } = useMiniGameComponent(game?.resolver ?? fallbackResolver)
  const [hasWon, setHasWon] = useState(false)
  const [secretModal, setSecretModal] = useState(false)

  useEffect(() => {
    setHasWon(false)
    setSecretModal(false)
  }, [gameId])

  useEffect(() => {
    if (!game) {
      setHasWon(false)
      setSecretModal(false)
    }
  }, [game])

  if (!game) {
    return (
      <section className="space-y-6">
        <PixelCard className="space-y-3 text-center">
          <p className="text-xl font-semibold text-ink">That mini game got lost in the clouds.</p>
          <p className="text-sm text-ink/70">Head back to the game hub to pick a fresh quest.</p>
          <Link to="/games" className="tap-target mx-auto rounded-2xl bg-ink text-white">
            Return to hub
          </Link>
        </PixelCard>
      </section>
    )
  }

  const completed = completedIds.has(game.id)

  function handleWin() {
    if (hasWon) return
    setHasWon(true)
    const firstClear = markComplete(game.id)
    if (firstClear && !hasSecretPopupBeenShown()) {
      setSecretModal(true)
      markSecretPopupShown()
      rememberSecretHint()
    }
  }

  const shouldNudgeLetters = secretModal && !hasLettersUnlocked()

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link to="/games" className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
          ← Back to hub
        </Link>
        {completed && <span className="tap-target rounded-2xl bg-mint/40 text-ink">Previously cleared</span>}
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <PixelCard accent="mint" className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">{game.category}</p>
          <div className="flex items-center gap-3 text-3xl">
            <span aria-hidden>{game.icon}</span>
            <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{game.title}</h1>
          </div>
          <p className="text-sm text-ink/75">{game.summary}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoRow label="Difficulty" value={game.difficulty} />
            <InfoRow label="Avg time" value={game.duration} />
            <InfoRow label="Tags" value={game.tags.join(', ')} />
          </div>
          {hasWon ? (
            <div className="rounded-3xl border-2 border-white/60 bg-white/80 p-4 text-sm text-ink/80">
              <p className="font-semibold text-ink">Great run!</p>
              <p>Your completion is saved locally, so you can brag later.</p>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/70 p-4 text-sm text-ink/70">
              Beat the prompt to log progress and awaken the letters system.
            </div>
          )}
        </PixelCard>

        <PixelCard accent="blush" className="space-y-4">
          {loading && <GameSkeleton />}
          {error && (
            <div className="space-y-3 text-center text-sm text-ink/70">
              <p>We couldn\'t load this mini game just yet.</p>
              <button type="button" onClick={reload} className="tap-target rounded-2xl bg-ink text-white">
                Retry download
              </button>
            </div>
          )}
          {!loading && !error && Component && <Component game={game} onWin={handleWin} />}
        </PixelCard>
      </div>

      {hasWon && !shouldNudgeLetters && (
        <PixelCard accent="lavender" className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Love tokens banked</p>
            <p className="text-sm text-ink/70">Play another or visit the Letters hub for more softness.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/games" className="tap-target rounded-2xl border border-ink/10 bg-white/70 text-ink">
              Pick another game
            </Link>
            <Link to="/letters" className="tap-target rounded-2xl bg-ink text-white">
              Letters hub
            </Link>
          </div>
        </PixelCard>
      )}

      {secretModal && (
        <SecretModal
          onDismiss={() => setSecretModal(false)}
          onNavigate={() => navigate('/letters')}
          unlocked={hasLettersUnlocked()}
        />
      )}
    </section>
  )
}

type InfoRowProps = {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-ink/50">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  )
}

function GameSkeleton() {
  return (
    <div className="space-y-4" aria-live="polite">
      <div className="h-4 rounded-full bg-white/50" />
      <div className="h-36 rounded-3xl bg-white/40" />
      <div className="h-12 rounded-3xl bg-white/40" />
    </div>
  )
}

type SecretModalProps = {
  onDismiss: () => void
  onNavigate: () => void
  unlocked: boolean
}

function SecretModal({ onDismiss, onNavigate, unlocked }: SecretModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" role="dialog" aria-modal="true">
      <PixelCard accent="ink" className="max-w-lg space-y-4 text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-white/70">Secret courier</p>
        <h2 className="text-2xl font-semibold">Letters just shifted</h2>
        <p className="text-sm text-white/80">
          That win unlocked the rumor about fifteen hidden letters. {unlocked ? 'They\'re already unlocked, but go peek again.' : 'Head to the Letters hub and whisper the password to see them.'}
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-semibold text-ink">
          <button
            type="button"
            onClick={onDismiss}
            className="tap-target rounded-2xl border border-white/30 bg-white/10 text-white"
          >
            Keep playing
          </button>
          <button type="button" onClick={onNavigate} className="tap-target rounded-2xl bg-white text-ink">
            Visit letters hub
          </button>
        </div>
      </PixelCard>
    </div>
  )
}
