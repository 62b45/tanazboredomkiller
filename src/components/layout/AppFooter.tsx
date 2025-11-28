export function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-white/30 bg-white/60 px-4 py-6 text-sm text-ink/70 backdrop-blur dark:bg-surface/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Lavender PWA starter. Built with React, Vite, and Tailwind.</p>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-ink" href="https://vite.dev" target="_blank" rel="noreferrer">
            Vite docs
          </a>
          <a className="hover:text-ink" href="https://react.dev" target="_blank" rel="noreferrer">
            React docs
          </a>
          <a className="hover:text-ink" href="https://tailwindcss.com" target="_blank" rel="noreferrer">
            Tailwind docs
          </a>
        </div>
      </div>
    </footer>
  )
}
