import { useState } from 'react'

import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export function InstallPromptBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt()
  const [isPrompting, setIsPrompting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!canInstall) {
    return null
  }

  const handleInstall = async () => {
    try {
      setIsPrompting(true)
      const accepted = await promptInstall()
      setMessage(accepted ? 'Installed! Find the pixel heart on your home screen.' : 'Install was dismissed. Try again whenever you like.')
      if (accepted) {
        setTimeout(() => setMessage(null), 4000)
      }
    } catch (error) {
      console.error(error)
      setMessage('Something went wrong while prompting for install.')
    } finally {
      setIsPrompting(false)
    }
  }

  return (
    <aside className="pointer-events-none fixed bottom-4 left-1/2 z-40 flex w-full justify-center px-4">
      <div className="pointer-events-auto w-[min(520px,100%)]">
        <div className="pixel-border-strong bg-surface/95 px-5 py-4 text-sm shadow-card backdrop-blur">
          <div className="flex flex-col gap-3 text-ink/80">
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-2xl">💾</span>
              <div>
                <p className="text-base font-semibold text-ink">Save the Pixel Love Arcade?</p>
                <p className="text-[0.75rem] uppercase tracking-[0.4em] text-ink/50">Install for offline quests</p>
              </div>
            </div>
            {message && <p className="rounded-2xl bg-blush/50 px-3 py-2 text-xs text-ink">{message}</p>}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleInstall}
                disabled={isPrompting}
                className="tap-target flex-1 rounded-2xl bg-ink text-white shadow-lg disabled:opacity-60"
              >
                {isPrompting ? 'Preparing…' : 'Install app'}
              </button>
              <button type="button" onClick={dismiss} className="tap-target flex-1 rounded-2xl bg-white/70 text-ink/70">
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
