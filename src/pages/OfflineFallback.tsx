import { Link } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'

export default function OfflineFallback() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <PixelCard accent="mint" className="max-w-xl space-y-5">
        <p className="typing-pill">Offline safe mode</p>
        <h1 className="text-3xl font-semibold text-ink">You&apos;re offline, but our pastel lobby is cached.</h1>
        <p className="text-base text-ink/70">
          The entire shell, fonts, icons, and this page live locally. Once signal returns we&apos;ll sync any queued notes and continue the
          cozy rituals without a hiccup.
        </p>
        <ul className="space-y-2 text-sm text-ink/75">
          <li>• Background music toggle waits for a connection before fetching audio.</li>
          <li>• Quick links still load because they point to already cached routes.</li>
          <li>• `/offline.html` remains available for hard reloads outside the app shell.</li>
        </ul>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="tap-target rounded-2xl bg-ink text-white shadow-card">
            Back to home base
          </Link>
          <Link to="/about" className="tap-target rounded-2xl bg-white/70 text-ink">
            Peek at the timeline
          </Link>
        </div>
      </PixelCard>
    </section>
  )
}
