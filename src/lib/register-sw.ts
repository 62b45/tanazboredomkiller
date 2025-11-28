const SW_PATH = '/service-worker.js'

export function registerSW() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  const register = async () => {
    const swUrl = import.meta.env.DEV
      ? `${SW_PATH}?dev-sw=${Date.now()}`
      : SW_PATH

    try {
      const registration = await navigator.serviceWorker.register(swUrl)

      if (import.meta.env.DEV) {
        console.info('[pwa] service worker registered', registration.scope)
      }
    } catch (error) {
      console.error('[pwa] service worker registration failed', error)
    }
  }

  window.addEventListener(
    'load',
    () => {
      register().catch((error) => console.error(error))
    },
    { once: true },
  )
}
