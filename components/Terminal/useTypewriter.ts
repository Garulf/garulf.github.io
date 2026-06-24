'use client'
import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text: string, enabled: boolean = true, onComplete?: () => void) {
  const [displayed, setDisplayed] = useState('')
  const onCompleteRef = useRef(onComplete)

  // Keep the latest onComplete without causing effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (!enabled) return

    let n = 0
    let timeoutId: NodeJS.Timeout | null = null

    const tick = () => {
      n++
      setDisplayed(text.slice(0, n))

      if (n < text.length) {
        // Random delay between 14-26ms for next character
        timeoutId = setTimeout(tick, 14 + Math.random() * 12)
      } else {
        // Typing complete
        onCompleteRef.current?.()
      }
    }

    // Initial 60ms delay before starting
    const initialDelayId = setTimeout(tick, 60)

    // Cleanup function
    return () => {
      clearTimeout(initialDelayId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [text, enabled])

  if (!enabled) return { displayed: '', done: false }
  return { displayed, done: false }
}
