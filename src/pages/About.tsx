import { PixelCard } from '@/components/design/PixelCard'
import { cx } from '@/lib/cx'
import { useLoveChime } from '@/hooks/useLoveChime'

const ribbons = [
  { id: 'ribbon-1', icons: ['💌', '🌸', '✨', '🎀'], reverse: false },
  { id: 'ribbon-2', icons: ['🎮', '💞', '🍓', '⭐️'], reverse: true },
]

const timelineEvents = [
  {
    title: 'Co-op beta launched',
    date: 'March 2019',
    copy: 'We soft launched our shared world on a rainy Friday night, turning spontaneous Mario Kart races into the default date night warm up.',
    accent: 'lavender',
    icon: '🎮',
  },
  {
    title: 'Patch 1.5: Distant quests',
    date: 'August 2020',
    copy: 'When we lived in different cities, nightly Stardew farm chores and synchronized playlists kept the vibe steady and low latency.',
    accent: 'mint',
    icon: '🛰️',
  },
  {
    title: 'Seasonal event: The Yes',
    date: 'November 2022',
    copy: 'A scavenger hunt through our favorite coffee shops ended with a hidden SD card, a pixel animation, and a proposal under string lights.',
    accent: 'blush',
    icon: '💍',
  },
  {
    title: 'Now playing: Cozy expansion',
    date: 'Today',
    copy: 'Our shared hub is a pastel pocket universe for slow mornings, background music, and secret achievements only we can unlock.',
    accent: 'lavender',
    icon: '💫',
  },
] as const

const loveMetrics = [
  { label: 'Quests cleared', value: '128', subtext: 'co-op missions since 2019' },
  { label: 'Daily heart streak', value: '864', subtext: 'good morning texts exchanged' },
  { label: 'Future DLC ideas', value: '07', subtext: 'picnic / travel combos on deck' },
]

export default function About() {
  const { isSupported, isLoading, isPlaying, error, togglePlayback } = useLoveChime()

  return (
    <section className="space-y-8">
      <div className="space-y-2" aria-hidden>
        {ribbons.map((ribbon) => (
          <div key={ribbon.id} className="emoji-ribbon">
            <div className={cx('emoji-ribbon__track', ribbon.reverse && 'emoji-ribbon__track--reverse')}>
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={`${ribbon.id}-${index}`}>{ribbon.icons[index % ribbon.icons.length]}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <PixelCard accent="blush" shimmer className="space-y-5">
        <p className="typing-pill">About our love</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">A romantic pixel portal for daily co-op rituals.</h1>
          <p className="text-base text-ink/75">
            Think of this space as our always-on lobby: pastel UI, zero latency check-ins, and gentle background soundtracks that make
            even errands feel like side quests.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {loveMetrics.map((metric) => (
            <div key={metric.label} className="pixel-border-ghost rounded-2xl bg-white/60 px-4 py-3 text-center">
              <p className="text-3xl font-semibold text-ink">{metric.value}</p>
              <p className="text-xs uppercase tracking-[0.4em] text-ink/50">{metric.label}</p>
              <p className="text-xs text-ink/60">{metric.subtext}</p>
            </div>
          ))}
        </div>
        <div id="soundtrack" className="space-y-2">
          <p className="text-sm font-medium text-ink">Quiet background music</p>
          <p className="text-xs text-ink/70">A looping synth chime rendered with the Web Audio API. Loads only when you tap play.</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void togglePlayback()}
              disabled={!isSupported || isLoading}
              className="tap-target pixel-border rounded-2xl bg-white/70 text-sm text-ink disabled:opacity-50"
            >
              {isPlaying ? 'Pause love loop' : isLoading ? 'Loading chime…' : 'Play love loop'}
            </button>
            {!isSupported && <span className="text-xs text-ink/60">Your browser doesn&apos;t support Web Audio, but the love story continues.</span>}
          </div>
          {error && <p className="text-xs text-rose-500" role="alert">{error}</p>}
        </div>
      </PixelCard>

      <section id="timeline" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Cute timeline</p>
            <h2 className="text-2xl font-semibold text-ink">Milestones from beta to forever DLC</h2>
          </div>
          <div className="typing-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
        <ol className="relative space-y-6 border-l-2 border-ink/10 pl-6">
          {timelineEvents.map((event) => (
            <li key={event.title} className="relative">
              <span className="absolute -left-[15px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-card" aria-hidden>
                {event.icon}
              </span>
              <PixelCard accent={event.accent} className="relative space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-ink/60">{event.date}</p>
                <h3 className="text-xl font-semibold text-ink">{event.title}</h3>
                <p className="text-sm text-ink/75">{event.copy}</p>
              </PixelCard>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}
