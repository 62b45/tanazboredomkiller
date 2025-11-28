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
      setMessage(accepted ? 'Installed! Find Lavender on your home screen.' : 'Install was dismissed. You can try again anytime.')
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
    <aside className="pointer-events-auto fixed bottom-4 left-1/2 z-50 w-[clamp(280px,90vw,520px)] -translate-x-1/2 rounded-[32px] border border-white/60 bg-surface/95 p-5 shadow-card backdrop-blur">
      <div className="flex flex-col gap-3 text-sm text-ink/80">
        <div>
          <p className="text-base font-semibold text-ink">Install Lavender?</p>
          <p>Pin the experience to your home screen for offline access and instant launches.</p>
        </div>
        {message && <p className="text-xs text-ink/60">{message}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleInstall}
            disabled={isPrompting}
            className="rounded-full bg-dusk px-5 py-2 text-sm font-semibold text-white shadow-card disabled:opacity-60"
          >
            {isPrompting ? 'Preparing…' : 'Install app'}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink/70 hover:border-ink/40"
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  )
}
