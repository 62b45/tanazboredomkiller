import { Link } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'

type QuickLink = {
  title: string
  copy: string
  icon: string
  accent: 'lavender' | 'mint' | 'blush'
  to?: string
  href?: string
}

const heroStats = [
  { label: 'Daily logins', value: '2', meta: 'Sunrise + midnight check-ins' },
  { label: 'Co-op energy', value: '98%', meta: 'After-mission vibe score' },
  { label: 'Secret achievements', value: '14', meta: 'Waiting to be triggered' },
]

const quickLinks: QuickLink[] = [
  {
    title: 'See our timeline',
    copy: 'Travel through our highlight reel and seasonal events.',
    icon: '🧭',
    accent: 'blush',
    to: '/about#timeline',
  },
  {
    title: 'Open the game hub',
    copy: 'Browse 50+ pastel games and unlock the letters vault.',
    icon: '🕹️',
    accent: 'mint',
    to: '/games',
  },
  {
    title: 'Start tonight’s quest',
    copy: 'Pick a co-op challenge without opening another app.',
    icon: '🎮',
    accent: 'mint',
    href: '#quest-board',
  },
  {
    title: 'Cue the soundtrack',
    copy: 'Toggle the quiet synth loop when you reach the About screen.',
    icon: '🎶',
    accent: 'lavender',
    to: '/about#soundtrack',
  },
]

const questModes = [
  { title: 'Cozy raid', tag: 'Weekend', detail: 'Theme dinner + a new cooperative chapter. Photos required.' },
  { title: 'Micro quest', tag: 'Weekday', detail: 'Ten-minute afternoon video check-in while doodling the day.' },
  { title: 'Side mission', tag: 'Anytime', detail: 'Send hourly photo clues until we meet at the café finish line.' },
]

const highlightCards = [
  {
    title: 'Romantic game hub',
    copy: '720p mobile-first layout with no layout shift between 360px and 1280px, so the experience stays snuggly.',
    icon: '📱',
  },
  {
    title: 'Heart cursor + tap targets',
    copy: 'Desktop gets a heart pointer, while every CTA respects a chunky 48px hit area for thumbs.',
    icon: '🖱️',
  },
  {
    title: 'CSS-only sparkle',
    copy: 'Particles, shimmer, typing dots, and ribbons rely on transforms + opacity for 60fps-friendly motion.',
    icon: '✨',
  },
]

export default function Home() {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        <PixelCard accent="lavender" shimmer className="space-y-6">
          <p className="typing-pill">Romantic game hub</p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-[2.8rem]">
              A pastel pixel lobby for everything co-op and swoon-worthy<span className="typing-caret" />
            </h1>
            <p className="text-base text-ink/75">
              Queue quests, swap love notes, and launch shared rituals without leaving this tiny pastel universe. Designed for 360px
              to 1280px viewports so mobile mornings and desktop nights feel identical.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/about" className="tap-target rounded-2xl bg-ink text-white shadow-lg">
              Explore About our love
            </Link>
            <a href="#quick-links" className="tap-target rounded-2xl bg-white/70 text-ink">
              Jump to quick links
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="pixel-border-ghost rounded-2xl bg-white/70 px-4 py-3 text-center">
                <p className="text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-ink/50">{stat.label}</p>
                <p className="text-[0.75rem] text-ink/60">{stat.meta}</p>
              </div>
            ))}
          </div>
        </PixelCard>

        <div className="space-y-4">
          <PixelCard accent="mint" className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Now playing</p>
            <h2 className="text-2xl font-semibold text-ink">Romantic XP boosters</h2>
            <ul className="space-y-2 text-sm text-ink/75">
              <li>• Daily shimmer animation for new notes.</li>
              <li>• Typing dots show when the other player is drafting a surprise.</li>
              <li>• Pixel borders keep everything cohesive across cards.</li>
            </ul>
          </PixelCard>
          <PixelCard accent="blush" className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Quick cues</p>
            <div className="flex flex-wrap gap-3 text-sm text-ink/80">
              <span className="pixel-border rounded-2xl px-4 py-2">Background particles only use transforms.</span>
              <span className="pixel-border rounded-2xl px-4 py-2">Tap targets ≥ 48px, tested on thumbs.</span>
            </div>
          </PixelCard>
        </div>
      </div>

      <section id="quick-links" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Quick links</p>
            <h2 className="text-2xl font-semibold text-ink">Jump into cozy rituals fast</h2>
          </div>
          <div className="typing-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => {
            const content = (
              <>
                <span aria-hidden className="text-3xl">{link.icon}</span>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-ink">{link.title}</h3>
                  <p className="text-sm text-ink/75">{link.copy}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.35em] text-ink/60">Open</span>
              </>
            )

            if (link.to) {
              return (
                <PixelCard
                  key={link.title}
                  as={Link}
                  to={link.to}
                  accent={link.accent}
                  className="tap-target h-full flex flex-col items-start gap-3 rounded-[1.75rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
                >
                  {content}
                </PixelCard>
              )
            }

            return (
              <PixelCard
                key={link.title}
                as="a"
                href={link.href}
                accent={link.accent}
                className="tap-target h-full flex flex-col items-start gap-3 rounded-[1.75rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
              >
                {content}
              </PixelCard>
            )
          })}
        </div>
      </section>

      <section id="quest-board" className="grid gap-4 lg:grid-cols-[0.8fr,1.2fr]">
        <PixelCard accent="ink" className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Quest board</p>
          <h2 className="text-2xl font-semibold text-white">Tonight&apos;s co-op menu</h2>
          <p className="text-sm text-white/80">Pick a mission, screenshot it, and send it with a sparkle emoji to lock it in.</p>
          <ul className="space-y-3">
            {questModes.map((quest) => (
              <li key={quest.title} className="rounded-2xl border border-white/20 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-white">
                  <span>{quest.title}</span>
                  <span className="text-xs uppercase tracking-[0.35em] text-white/70">{quest.tag}</span>
                </div>
                <p className="mt-2 text-sm text-white/80">{quest.detail}</p>
              </li>
            ))}
          </ul>
        </PixelCard>

        <div className="grid gap-4 md:grid-cols-2">
          {highlightCards.map((card) => (
            <PixelCard key={card.title} accent="mint" className="space-y-2">
              <span aria-hidden className="text-2xl">{card.icon}</span>
              <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
              <p className="text-sm text-ink/75">{card.copy}</p>
            </PixelCard>
          ))}
        </div>
      </section>
    </section>
  )
}
