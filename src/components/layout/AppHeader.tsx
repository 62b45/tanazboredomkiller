import { NavLink } from 'react-router-dom'

import { cx } from '@/lib/cx'

import { primaryNavLinks } from './navLinks'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 sm:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Navigate home">
          <span className="pixel-logo" aria-hidden>
            PX
          </span>
          <div className="leading-tight">
            <p className="text-[0.55rem] uppercase tracking-[0.6em] text-ink/60">Pastel pixel</p>
            <p className="text-lg font-semibold text-ink">Love Arcade</p>
          </div>
        </NavLink>
        <nav className="hidden gap-2 md:flex" aria-label="Primary">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cx(
                  'tap-target pixel-border rounded-2xl text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ink/70 transition',
                  isActive ? 'bg-ink text-white shadow-lg scale-[1.01]' : 'bg-white/60 hover:bg-white/80 hover:text-ink',
                )
              }
            >
              <span aria-hidden className="text-lg">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
