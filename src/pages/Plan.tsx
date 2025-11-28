const trackItems = [
  {
    title: 'Routing & code splitting',
    detail: 'React Router 7 + lazy entrypoints keep each view in its own chunk so navigation stays snappy.',
    metric: 'Routing verified',
  },
  {
    title: 'Offline contract',
    detail: 'Custom service worker precaches the shell, icons, and fallback HTML, then runtime-caches data + media.',
    metric: 'Offline ready',
  },
  {
    title: 'Install prompts',
    detail: 'beforeinstallprompt is captured once and re-used by the InstallPromptBanner component.',
    metric: 'UX friendly',
  },
]

const checklist = [
  'Lavender theme variables in CSS + Tailwind tokens.',
  'Netlify-ready build command plus SPA redirects.',
  'Performance budget enforced at build time.',
  'Bundle analysis available via npm run analyze.',
]

export default function Plan() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">Launch playbook</p>
          <h1 className="text-4xl font-semibold text-ink">Ship a pastel PWA that survives low-end hardware.</h1>
          <p className="text-lg text-ink/70">
            Everything required by the ticket is wired: manifest, offline support, install UI, routing, Tailwind, and Netlify deployment settings.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {trackItems.map((item) => (
            <article key={item.title} className="rounded-[28px] border border-ink/10 bg-white/80 p-5 shadow-card backdrop-blur dark:bg-surface/80">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">{item.metric}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="rounded-[32px] border border-lavender/30 bg-gradient-to-br from-lavender/30 via-sand/40 to-mint/40 p-8 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-ink/60">Build tooling</p>
              <h2 className="text-2xl font-semibold text-ink">Performance budget enforcement</h2>
            </div>
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-dusk">
              200 KB cap
            </span>
          </div>
          <p className="mt-4 text-sm text-ink/80">
            Vite runs with a custom plugin that sums emitted JS chunks and fails the build if the total exceeds 200 KB. During development the
            `npm run analyze` command enables rollup-plugin-visualizer so you can inspect the bundle without leaving the terminal.
          </p>
        </div>

        <div className="rounded-[28px] border border-ink/10 bg-white/80 p-8 shadow-card dark:bg-surface/80">
          <h3 className="text-xl font-semibold text-ink">Release checklist</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink/75">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-lavender/30 text-xs font-semibold text-dusk">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
