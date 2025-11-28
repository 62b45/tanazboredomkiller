import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-lg space-y-4 rounded-[28px] border border-ink/10 bg-white/80 p-8 shadow-card backdrop-blur dark:bg-surface/80">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/60">404</p>
        <h1 className="text-3xl font-semibold text-ink">This screen floated away.</h1>
        <p className="text-sm text-ink/70">The link you followed isn&apos;t part of the scaffold yet. Pick another route to keep exploring the starter.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-dusk px-6 py-3 text-sm font-semibold text-white shadow-card">
            Home
          </Link>
          <Link to="/plan" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink/80">
            Launch plan
          </Link>
        </div>
      </div>
    </section>
  )
}
