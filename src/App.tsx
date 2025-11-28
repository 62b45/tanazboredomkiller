import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { PixelCard } from '@/components/design/PixelCard'
import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'
import { BackgroundParticles } from '@/components/layout/BackgroundParticles'
import { BottomNav } from '@/components/layout/BottomNav'
import { InstallPromptBanner } from '@/components/pwa/InstallPromptBanner'
import { NetworkStatusNotice } from '@/components/pwa/NetworkStatusNotice'

export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface text-ink">
      <BackgroundParticles />
      <AppHeader />
      <NetworkStatusNotice />
      <main className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-4 pb-28 pt-8 sm:px-8 md:pb-16 min-h-[720px]">
        <Suspense fallback={<RouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <AppFooter />
      <InstallPromptBanner />
      <BottomNav />
    </div>
  )
}

function RouteSkeleton() {
  return (
    <PixelCard
      as="section"
      className="mx-auto mt-12 flex min-h-[40vh] w-full max-w-2xl flex-col items-center justify-center gap-4 text-center text-ink/70"
      aria-live="polite"
      aria-label="Loading route"
      shimmer
    >
      <span className="h-14 w-14 animate-spin rounded-full border-4 border-lavender/40 border-t-dusk" />
      <p className="text-sm uppercase tracking-[0.4em] text-ink/50">Loading</p>
    </PixelCard>
  )
}
