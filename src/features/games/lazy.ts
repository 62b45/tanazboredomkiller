import { useCallback, useEffect, useMemo, useState } from 'react'

import type { MiniGameComponent, MiniGameResolverKey } from './types'

const moduleCache = new Map<MiniGameResolverKey, MiniGameComponent>()

const miniGameResolvers: Record<MiniGameResolverKey, () => Promise<{ default: MiniGameComponent }>> = {
  'starlight-connect': () => import('@/mini-games/StarlightConnect'),
  'compliment-crafter': () => import('@/mini-games/ComplimentCrafter'),
  'emoji-forage': () => import('@/mini-games/EmojiForage'),
  'harmony-sum': () => import('@/mini-games/HarmonySum'),
  'story-spark': () => import('@/mini-games/StorySpark'),
  'slide-puzzle': () => import('@/mini-games/SlidePuzzle'),
  'color-match': () => import('@/mini-games/ColorMatch'),
  'line-connect': () => import('@/mini-games/LineConnect'),
  'number-swap': () => import('@/mini-games/NumberSwap'),
  'path-finder': () => import('@/mini-games/PathFinder'),
  'merge-tiles': () => import('@/mini-games/MergeTiles'),
  'rotate-tiles': () => import('@/mini-games/RotateTiles'),
  'tic-tac-toe': () => import('@/mini-games/TicTacToe'),
  'connect-four': () => import('@/mini-games/ConnectFour'),
  'rock-paper-scissors': () => import('@/mini-games/RockPaperScissors'),
  'checkers-lite': () => import('@/mini-games/CheckersLite'),
  'dots-and-boxes': () => import('@/mini-games/DotsAndBoxes'),
  'memory-flip': () => import('@/mini-games/MemoryFlip'),
  'emoji-match': () => import('@/mini-games/EmojiMatch'),
  'sequence-repeat': () => import('@/mini-games/SequenceRepeat'),
  'fast-recall': () => import('@/mini-games/FastRecall'),
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
