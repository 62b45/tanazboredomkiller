import { useCallback, useEffect, useRef, useState } from 'react'

export function useTypewriter(text: string, pace = 22) {
  const [value, setValue] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const rafRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const revealAll = useCallback(() => {
    stop()
    setValue(text)
    setIsComplete(true)
  }, [stop, text])

  useEffect(() => {
    let index = 0
    let lastTime = 0
    const total = text.length
    setValue('')
    setIsComplete(false)

    const stepSize = Math.max(1, Math.floor(total / 1200))

    const loop = (time: number) => {
      if (!lastTime) {
        lastTime = time
      }
      const delta = time - lastTime
      if (delta >= pace) {
        index = Math.min(total, index + stepSize)
        setValue(text.slice(0, index))
        lastTime = time
      }
      if (index >= total) {
        setIsComplete(true)
        rafRef.current = null
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      stop()
    }
  }, [pace, stop, text])

  return { value, isComplete, revealAll }
}
