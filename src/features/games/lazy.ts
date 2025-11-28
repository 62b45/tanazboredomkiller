import { useCallback, useEffect, useMemo, useState } from 'react'

import type { MiniGameComponent, MiniGameResolverKey } from './types'

const moduleCache = new Map<MiniGameResolverKey, MiniGameComponent>()

const miniGameResolvers: Record<MiniGameResolverKey, () => Promise<{ default: MiniGameComponent }>> = {
  'starlight-connect': () => import('@/mini-games/StarlightConnect'),
  'compliment-crafter': () => import('@/mini-games/ComplimentCrafter'),
  'emoji-forage': () => import('@/mini-games/EmojiForage'),
  'harmony-sum': () => import('@/mini-games/HarmonySum'),
  'story-spark': () => import('@/mini-games/StorySpark'),
}

export function preloadMiniGame(resolver: MiniGameResolverKey) {
  if (moduleCache.has(resolver)) {
    return
  }

  void miniGameResolvers[resolver]().then((mod) => {
    moduleCache.set(resolver, mod.default)
  })
}

export function useMiniGameComponent(resolver: MiniGameResolverKey) {
  const initial = moduleCache.get(resolver) ?? null
  const [Component, setComponent] = useState<MiniGameComponent | null>(initial)
  const [loading, setLoading] = useState(() => initial === null)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    miniGameResolvers[resolver]()
      .then((mod) => {
        moduleCache.set(resolver, mod.default)
        setComponent(() => mod.default)
        setError(null)
      })
      .catch((err: Error) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [resolver])

  useEffect(() => {
    if (!Component) {
      load()
    }
  }, [Component, load])

  const status = useMemo(() => ({ loading, error }), [loading, error])

  return {
    Component,
    ...status,
    reload: load,
    preload: () => preloadMiniGame(resolver),
  }
}
