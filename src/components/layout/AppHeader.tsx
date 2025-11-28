import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview', end: true },
  { to: '/plan', label: 'Launch plan' },
  { to: '/offline', label: 'Offline mode' },
]

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-surface/80 backdrop-blur dark:border-ink/20">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <NavLink to="/" className="text-lg font-semibold text-ink">
          Lavender<span className="text-dusk">.</span>
        </NavLink>
        <nav className="flex items-center gap-2 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${
                  isActive ? 'bg-dusk text-white shadow-card' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
