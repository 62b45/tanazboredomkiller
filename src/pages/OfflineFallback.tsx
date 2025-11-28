import { Link } from 'react-router-dom'

export default function OfflineFallback() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-xl space-y-6 rounded-[32px] border border-ink/10 bg-white/90 p-8 shadow-card backdrop-blur dark:bg-surface/80">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/60">Offline friendly</p>
        <h1 className="text-3xl font-semibold text-ink">You&apos;re offline, but the experience continues.</h1>
        <p className="text-base text-ink/70">
          All the core screens are cached locally. When your connection returns we will sync the latest content automatically.
        </p>
        <ul className="space-y-3 text-sm text-ink/75">
          <li>• Cached shell + fonts keep navigation instant.</li>
          <li>• Runtime caching serves images and documents you already opened.</li>
          <li>• This page is also available as `/offline.html` for hard reloads.</li>
        </ul>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-dusk px-6 py-3 text-sm font-semibold text-white shadow-card">
            Go back online view
          </Link>
          <Link to="/plan" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink/80">
            Review rollout plan
          </Link>
        </div>
      </div>
    </section>
  )
}
