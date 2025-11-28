import { Link } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <PixelCard accent="lavender" className="max-w-lg space-y-5">
        <p className="typing-pill">404</p>
        <h1 className="text-3xl font-semibold text-ink">This screen drifted into another timeline.</h1>
        <p className="text-sm text-ink/70">The route you tried isn&apos;t part of the Pixel Love Arcade yet. Pick a cozy destination below.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="tap-target rounded-2xl bg-ink text-white shadow-card">
            Home base
          </Link>
          <Link to="/about" className="tap-target rounded-2xl bg-white/70 text-ink">
            About our love
          </Link>
        </div>
      </PixelCard>
    </section>
  )
}
