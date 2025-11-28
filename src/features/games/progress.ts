import { useCallback, useEffect, useMemo, useState } from 'react'

import type { GameDefinition } from './types'

const STORAGE_KEY = 'px_game_progress_v1'
const SESSION_KEY = 'px_game_session_progress_v1'
const SECRET_POPUP_SESSION_KEY = 'px_secret_popup_seen'

type ProgressMap = Record<string, number>

type CompletionResult = {
  updated: boolean
  map: ProgressMap
}

function readStorage(): ProgressMap {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProgressMap
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
    return {}
  } catch {
    return {}
  }
}

function persist(map: ProgressMap) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {}
}

function persistSession(gameId: string) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    const snapshot = window.sessionStorage.getItem(SESSION_KEY)
    const parsed = snapshot ? (JSON.parse(snapshot) as ProgressMap) : {}
    parsed[gameId] = Date.now()
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed))
  } catch {}
}

export function markGameCompleted(gameId: string): CompletionResult {
  if (typeof window === 'undefined') {
    return { updated: false, map: {} }
  }
  const map = readStorage()
  if (map[gameId]) {
    return { updated: false, map }
  }
  const next = { ...map, [gameId]: Date.now() }
  persist(next)
  persistSession(gameId)
  return { updated: true, map: next }
}

export function hasSecretPopupBeenShown() {
  if (typeof window === 'undefined') {
    return false
  }
  return window.sessionStorage.getItem(SECRET_POPUP_SESSION_KEY) === '1'
}

export function markSecretPopupShown() {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.setItem(SECRET_POPUP_SESSION_KEY, '1')
}

export function useGameProgress(games: GameDefinition[]) {
  const [map, setMap] = useState<ProgressMap>(() => readStorage())

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setMap(() => readStorage())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const completedIds = useMemo(() => new Set(Object.keys(map)), [map])

  const stats = useMemo(() => {
    const completed = completedIds.size
    const total = games.length
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { completed, total, percent }
  }, [completedIds.size, games.length])

  const markComplete = useCallback((gameId: string) => {
    const result = markGameCompleted(gameId)
    if (result.updated) {
      setMap(result.map)
    }
    return result.updated
  }, [])

  return {
    completedIds,
    stats,
    markComplete,
  }
}
