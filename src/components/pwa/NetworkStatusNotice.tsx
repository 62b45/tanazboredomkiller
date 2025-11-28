import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export function NetworkStatusNotice() {
  const isOnline = useNetworkStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className="z-30 flex justify-center px-4 pt-3" role="status" aria-live="assertive">
      <div className="pixel-border flex max-w-xl flex-wrap items-center justify-center gap-2 rounded-2xl bg-blush/70 px-4 py-2 text-sm font-semibold text-ink">
        <span aria-hidden>💞</span>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-ink/80">Offline safe mode</p>
        <span className="text-[0.8rem] text-ink/70">We&apos;ll sync the love notes when signal returns.</span>
      </div>
    </div>
  )
}
