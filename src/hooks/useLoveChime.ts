import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

type UseLoveChimeReturn = {
  isSupported: boolean
  isLoading: boolean
  isPlaying: boolean
  error: string | null
  togglePlayback: () => Promise<void>
}

export function useLoveChime(): UseLoveChimeReturn {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const mountedRef = useRef(true)

  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && (!!window.AudioContext || !!window.webkitAudioContext))
    return () => {
      mountedRef.current = false
      if (sourceRef.current) {
        try {
          sourceRef.current.stop(0)
        } catch {
          /* noop */
        }
        sourceRef.current.disconnect()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined)
      }
    }
  }, [])

  const ensureContext = useCallback(() => {
    if (!isSupported || typeof window === 'undefined') {
      throw new Error('Web Audio API is unavailable')
    }

    if (!audioContextRef.current) {
      const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext
      if (!AudioContextCtor) {
        throw new Error('Web Audio API is unavailable')
      }
      const context = new AudioContextCtor()
      const gain = context.createGain()
      gain.gain.value = 0.06
      gain.connect(context.destination)
      audioContextRef.current = context
      gainRef.current = gain
    }

    return audioContextRef.current
  }, [isSupported])

  const loadBuffer = useCallback(
    async (ctx: AudioContext) => {
      if (bufferRef.current) {
        return bufferRef.current
      }

      if (mountedRef.current) {
        setIsLoading(true)
        setError(null)
      }

      try {
        const response = await fetch('/audio/love-chime.wav')
        if (!response.ok) {
          throw new Error('Unable to fetch soundtrack')
        }
        const arrayBuffer = await response.arrayBuffer()
        const decoded = await ctx.decodeAudioData(arrayBuffer)
        bufferRef.current = decoded
        return decoded
      } catch (err) {
        console.error(err)
        if (mountedRef.current) {
          setError('Unable to load the love loop right now.')
        }
        throw err
      } finally {
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  const startPlayback = useCallback(async () => {
    try {
      const ctx = ensureContext()
      await ctx.resume()
      const buffer = await loadBuffer(ctx)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(gainRef.current ?? ctx.destination)
      source.start(0)
      sourceRef.current = source
      if (mountedRef.current) {
        setIsPlaying(true)
      }
    } catch (err) {
      console.error(err)
      if (mountedRef.current) {
        setError('We could not start the love loop. Try again?')
      }
    }
  }, [ensureContext, loadBuffer])

  const stopPlayback = useCallback(async () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop(0)
      } catch {
        /* noop */
      }
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      await audioContextRef.current.suspend()
    }

    if (mountedRef.current) {
      setIsPlaying(false)
    }
  }, [])

  const togglePlayback = useCallback(async () => {
    if (!isSupported) {
      setError('Web Audio API is not available in this browser.')
      return
    }

    if (isPlaying) {
      await stopPlayback()
      return
    }

    await startPlayback()
  }, [isPlaying, isSupported, startPlayback, stopPlayback])

  return {
    isSupported,
    isLoading,
    isPlaying,
    error,
    togglePlayback,
  }
}
