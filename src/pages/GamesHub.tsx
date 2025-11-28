import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'
import { gameCatalog } from '@/features/games/catalog'
import { preloadMiniGame } from '@/features/games/lazy'
import { useGameProgress } from '@/features/games/progress'
import type { GameCategory } from '@/features/games/types'
import { cx } from '@/lib/cx'

const CHUNK_SIZE = 12

const categoryOptions: Array<'all' | GameCategory> = ['all', ...new Set(gameCatalog.map((game) => game.category))]

const difficultyColors: Record<string, string> = {
  Cozy: 'bg-lavender/30 text-ink',
  Chill: 'bg-mint/30 text-ink',
  Spicy: 'bg-blush/50 text-ink',
}

type Filter = 'all' | GameCategory

export default function GamesHub() {
  const { completedIds, stats } = useGameProgress(gameCatalog)
  const [filter, setFilter] = useState<Filter>('all')
  const [chunks, setChunks] = useState(2)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gameCatalog.slice(0, 4).forEach((game) => preloadMiniGame(game.resolver))
  }, [])

  useEffect(() => {
    setChunks(2)
  }, [filter])

  const filteredGames = useMemo(() => {
    if (filter === 'all') return gameCatalog
    return gameCatalog.filter((game) => game.category === filter)
  }, [filter])

  const visibleGames = filteredGames.slice(0, chunks * CHUNK_SIZE)
  const hasMore = visibleGames.length < filteredGames.length

  useEffect(() => {
    if (!hasMore) {
      return
    }
    const target = sentinelRef.current
    if (!target) return
    if (typeof IntersectionObserver === 'undefined') {
      setChunks((prev) => prev + 1)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setChunks((prev) => prev + 1)
      }
    }, { rootMargin: '120px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [filter, hasMore, visibleGames.length])

  return (
    <section className="space-y-8">
      <PixelCard accent="lavender" shimmer className="space-y-6">
        <p className="typing-pill">Romantic arcade</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-[2.4rem]">Game hub</h1>
          <p className="text-sm text-ink/75">
            Play bite-sized rituals, memory games, and writing prompts made for thumbs. Everything here lazy-loads so
            the lobby stays fast even on sleepy networks.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatBadge label="Cleared" value={`${stats.completed}/${stats.total}`} sub={`${stats.percent}% complete`} />
          <StatBadge label="Secret signal" value={stats.completed > 0 ? 'Armed' : 'Locked'} sub="Beat any game to ping the letters" />
          <StatBadge label="Categories" value={categoryOptions.length - 1} sub="Filter by vibe anytime" />
        </div>
        <div className="flex flex-wrap gap-3">
          {categoryOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cx(
                'tap-target rounded-2xl border border-ink/10 bg-white/70 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-ink/70 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
                filter === option && 'bg-ink text-white shadow-lg',
              )}
            >
              {option === 'all' ? 'All games' : option}
            </button>
          ))}
        </div>
      </PixelCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleGames.map((game) => {
          const completed = completedIds.has(game.id)
          const darkCard = game.accent === 'ink'
          const titleColor = darkCard ? 'text-white' : 'text-ink'
          const summaryColor = darkCard ? 'text-white/70' : 'text-ink/75'
          const metaColor = darkCard ? 'text-white/70' : 'text-ink/60'
          const badgeColor = darkCard ? 'bg-white/20 text-white' : 'bg-white/60 text-ink/70'
          return (
            <PixelCard
              key={game.id}
              as={Link}
              to={`/games/${game.id}`}
              accent={game.accent}
              className="group flex h-full flex-col justify-between gap-4 rounded-[1.75rem] text-left transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-2xl">
                  <span aria-hidden>{game.icon}</span>
                  {completed && <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink">Cleared</span>}
                </div>
                <div className="space-y-1">
                  <h2 className={cx('text-xl font-semibold', titleColor)}>{game.title}</h2>
                  <p className={cx('text-sm', summaryColor)}>{game.summary}</p>
                </div>
              </div>
              <div className={cx('flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]', metaColor)}>
                <span className={cx('rounded-full px-3 py-1', badgeColor)}>{game.category}</span>
                <span className={`${difficultyColors[game.difficulty] ?? 'bg-white/60 text-ink'} rounded-full px-3 py-1`}>{game.difficulty}</span>
                <span className={cx('rounded-full px-3 py-1', badgeColor)}>{game.duration}</span>
              </div>
            </PixelCard>
          )
        })}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-4" aria-live="polite">
          <span className="text-sm text-ink/60">Loading more games…</span>
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-sm text-ink/60">End of the arcade list ✨</div>
      )}
    </section>
  )
}

type StatBadgeProps = {
  label: string
  value: string | number
  sub: string
}

function StatBadge({ label, value, sub }: StatBadgeProps) {
  return (
    <div className="rounded-3xl border-2 border-white/50 bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.4em] text-ink/50">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink/60">{sub}</p>
    </div>
  )
}
