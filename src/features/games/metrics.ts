import { useCallback, useState } from 'react'

const METRICS_STORAGE_KEY = 'px_game_metrics_v1'

export type MetricKind = 'score' | 'time'
export type MetricComparator = 'higher' | 'lower'

type MetricEntry = {
  bestScore?: number
  bestTime?: number
}

type MetricMap = Record<string, MetricEntry>

function readMetrics(): MetricMap {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(METRICS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as MetricMap
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
    return {}
  } catch {
    return {}
  }
}

function persistMetrics(map: MetricMap) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(map))
  } catch {}
}

export function useGameMetric(gameId: string, kind: MetricKind, comparator: MetricComparator) {
  const key = kind === 'score' ? 'bestScore' : 'bestTime'
  const [best, setBest] = useState<number | null>(() => {
    const metrics = readMetrics()
    const stored = metrics[gameId]?.[key]
    return typeof stored === 'number' ? stored : null
  })

  const updateBest = useCallback(
    (value: number) => {
      if (!Number.isFinite(value)) return false
      const snapshot = readMetrics()
      const entry = snapshot[gameId] ?? {}
      const current = entry[key]
      const isBetter = current == null ? true : comparator === 'higher' ? value > current : value < current
      if (!isBetter) return false
      const nextEntry = { ...entry, [key]: value }
      const nextSnapshot = { ...snapshot, [gameId]: nextEntry }
      persistMetrics(nextSnapshot)
      setBest(value)
      return true
    },
    [comparator, gameId, key],
  )

  return { best, updateBest }
}

export function formatDuration(value: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return '—'
  }
  if (value < 1000) {
    return `${Math.round(value)}ms`
  }
  const seconds = value / 1000
  if (seconds < 60) {
    return seconds < 10 ? `${seconds.toFixed(1)}s` : `${seconds.toFixed(0)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remaining = Math.round(seconds % 60)
  const padded = remaining.toString().padStart(2, '0')
  return `${minutes}m ${padded}s`
}
