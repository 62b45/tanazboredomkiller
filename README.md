# Lavender PWA Scaffold

A lightweight React + Vite starter tuned for installable, pastel-themed PWAs. It keeps the total JavaScript payload under 200 KB, embraces mobile-first styles with TailwindCSS, and bundles an offline-first service worker so the experience survives low-end hardware like the Vivo Y02a.

## What's included

- **React 19 + React Router 7** with lazy-loaded routes (`/`, `/plan`, `/offline`) to encourage code-splitting from day one.
- **TailwindCSS + PostCSS** configured with lavender-themed CSS variables for consistent theming across light/dark UI.
- **PWA essentials**: manifest + icons, meta tags, offline fallback HTML, custom service worker with precache + runtime caching, and an install prompt banner powered by `beforeinstallprompt`.
- **Netlify ready**: `npm run build` outputs to `dist/`, `netlify.toml` declares the command/publish dir, and SPA redirects are in place.
- **Performance guardrails**: a Vite build plugin fails the build if emitted JS chunks exceed 200 KB, while `npm run analyze` opens a bundle report via `rollup-plugin-visualizer`.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite in development mode. |
| `npm run typecheck` | Run TypeScript project references (app + config). |
| `npm run build` | Type-check, build for production, then inject the hashed assets into the service worker precache manifest. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint with the flat config + type-aware rules. |
| `npm run format` | Format the entire repo with Prettier. |
| `npm run analyze` | Build with the visualizer + performance budget plugin for bundle inspection. |

## PWA checklist

- `public/manifest.webmanifest` defines lavender theme colors, standalone display, and installable icons (`192px` + `512px`).
- `public/service-worker.js` precaches the app shell, offline HTML, and hashed build assets, then provides runtime caching + offline navigation fallback.
- `public/offline.html` mirrors the `/offline` route so the SW can serve a meaningful page even when JavaScript cant boot.
- `src/components/pwa/InstallPromptBanner.tsx` listens for `beforeinstallprompt` and surfaces a friendly install call-to-action.
- Mobile-first meta tags (viewport, theme color, apple mobile web app) live in `index.html` alongside the manifest link.

## Development notes

- Tailwind utility classes reference CSS variables declared in `src/index.css`, so the palette is easy to tweak without touching component code.
- Path aliases (`@/*`) are wired through both `tsconfig` and `vite.config` for clean imports.
- The service worker registration happens after the window load event (`src/lib/register-sw.ts`) to avoid blocking hydration during development.
- To inspect bundle composition without affecting everyday builds, run `npm run analyze` (or set `ANALYZE=true`) to emit `dist/bundle-report.html` via `rollup-plugin-visualizer`.

## Deploying

1. Run `npm run build`.
2. Deploy the `dist/` directory (Netlify will use `netlify.toml` automatically).
3. Confirm that the service worker registers (DevTools > Application > Service Workers) and that toggling **Offline** mode serves `/offline.html` as expected.

Happy building!
