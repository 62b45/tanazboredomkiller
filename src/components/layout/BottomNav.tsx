import { NavLink } from 'react-router-dom'

import { cx } from '@/lib/cx'

import { primaryNavLinks } from './navLinks'

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 z-40 w-[min(420px,calc(100%-1.5rem))] -translate-x-1/2">
      <div className="pixel-border-strong flex items-center gap-2 bg-surface/90 px-2 py-2 shadow-card backdrop-blur">
        {primaryNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cx(
                'tap-target flex h-full flex-1 flex-col rounded-2xl text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em]',
                isActive
                  ? 'bg-ink text-white shadow-lg'
                  : 'bg-white/60 text-ink/70 transition hover:bg-white/80 hover:text-ink',
              )
            }
          >
            <span aria-hidden className="text-xl">{link.icon}</span>
            <span className="mt-1">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
