import { Link } from 'react-router-dom'

export function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 border-t border-ink/10 bg-surface/90 px-4 py-8 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 text-sm text-ink/75 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-ink">© {year} Pixel Love Arcade</p>
          <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Crafted with React, Vite + pastel pixels</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/offline" className="tap-target pixel-border bg-white/70 text-[0.72rem] uppercase tracking-[0.35em] text-ink/70">
            Offline mode
          </Link>
          <a className="tap-target pixel-border bg-white/70 text-[0.72rem] uppercase tracking-[0.35em] text-ink/70" href="https://react.dev" target="_blank" rel="noreferrer">
            React docs
          </a>
          <a className="tap-target pixel-border bg-white/70 text-[0.72rem] uppercase tracking-[0.35em] text-ink/70" href="https://tailwindcss.com" target="_blank" rel="noreferrer">
            Tailwind
          </a>
        </div>
      </div>
    </footer>
  )
}
