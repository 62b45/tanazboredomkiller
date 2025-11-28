import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AppFooter } from './components/layout/AppFooter'
import { AppHeader } from './components/layout/AppHeader'
import { InstallPromptBanner } from './components/pwa/InstallPromptBanner'
import { NetworkStatusNotice } from './components/pwa/NetworkStatusNotice'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <AppHeader />
      <NetworkStatusNotice />
      <main className="flex-1">
        <Suspense fallback={<RouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <AppFooter />
      <InstallPromptBanner />
    </div>
  )
}

function RouteSkeleton() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading route">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-dusk/20 border-t-dusk" />
    </div>
  )
}
