import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export function NetworkStatusNotice() {
  const isOnline = useNetworkStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className="bg-blush/70 px-4 py-3 text-center text-sm font-medium text-ink">
      You&apos;re offline — we&apos;ll serve cached content and sync changes once you reconnect.
    </div>
  )
}
