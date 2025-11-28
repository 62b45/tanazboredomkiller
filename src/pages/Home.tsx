import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Install-ready shell',
    copy: 'Service worker precaches the UI shell and fonts so navigation stays instant even on a Vivo Y02a.',
  },
  {
    title: 'Runtime aware caching',
    copy: 'Static assets use cache-first, while API + media calls fall back to stale-while-revalidate for resiliency.',
  },
  {
    title: 'Pastel design tokens',
    copy: 'Tailwind + CSS variables keep the lavender palette consistent across light and dark surfaces.',
  },
]

const milestones = [
  { title: 'Audit bundle size', detail: 'Budgeted under 200 KB of JS using Vite visualizer + build plugin guardrails.' },
  { title: 'Offline UX', detail: 'Dedicated fallback route + static HTML so users get friendly guidance when signal drops.' },
  { title: 'Install cues', detail: 'beforeinstallprompt hook powers a lightweight banner instead of intrusive modals.' },
]

export default function Home() {
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6 rounded-[32px] bg-white/80 p-8 shadow-card ring-1 ring-lavender/30 backdrop-blur dark:bg-surface/80">
            <p className="inline-flex items-center gap-2 rounded-full bg-lavender/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-dusk">
              Fast • Installable • Offline
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Lavender is a pastel-first PWA starter for focused, low-bandwidth experiences.
            </h1>
            <p className="text-lg text-ink/80">
              Powered by React 19, Vite, TypeScript, and Tailwind, the scaffold includes routing, caching, install prompts, and
              Netlify-ready builds without bloating the payload.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/plan"
                className="inline-flex items-center justify-center rounded-full bg-dusk px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-dusk/90"
              >
                View launch plan
              </Link>
              <Link
                to="/offline"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink/80 hover:border-ink/40"
              >
                Preview offline UI
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/40 bg-surface/80 p-6 shadow-inner backdrop-blur dark:border-ink/20">
              <p className="text-sm uppercase tracking-wide text-ink/60">Performance budget</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-5xl font-semibold text-ink">200</span>
                <span className="text-lg font-medium text-ink/70">KB</span>
              </div>
              <p className="mt-2 text-sm text-ink/70">
                Guard rails enforce total JS under 200 KB and surface bundle composition via <code>npm run analyze</code>.
              </p>
              <div className="mt-4 h-2 rounded-full bg-ink/10">
                <span className="block h-full w-[62%] rounded-full bg-lavender" aria-hidden />
              </div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-lavender/40 via-blush/40 to-mint/40 p-6 text-ink shadow-card">
              <p className="text-sm uppercase tracking-wide text-ink/60">Ready for install</p>
              <p className="mt-2 text-lg font-medium">Manifest, themed icons, meta tags, and SW registration included out of the box.</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/80">
                <li>• Standalone display with lavender chrome.</li>
                <li>• Offline fallback page + route.</li>
                <li>• Install banner powered by beforeinstallprompt.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-card backdrop-blur dark:bg-surface/70">
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="rounded-[32px] border border-white/40 bg-white/80 p-8 shadow-card backdrop-blur dark:bg-surface/70">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-ink/60">Rollout checklist</p>
              <h2 className="text-2xl font-semibold text-ink">What ships with this scaffold</h2>
            </div>
            <Link to="/plan" className="text-sm font-semibold text-dusk hover:underline">
              Deep dive into the plan →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {milestones.map((milestone) => (
              <div key={milestone.title} className="rounded-3xl border border-ink/10 bg-surface/80 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-ink/60">{milestone.title}</p>
                <p className="mt-2 text-sm text-ink/75">{milestone.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
