import { useEffect, useState } from 'react'

const getNavigatorStatus = () => (typeof navigator !== 'undefined' ? navigator.onLine : true)

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(getNavigatorStatus)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const update = () => setIsOnline(getNavigatorStatus())

    window.addEventListener('online', update)
    window.addEventListener('offline', update)

    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return isOnline
}
