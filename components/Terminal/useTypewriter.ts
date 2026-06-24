'use client'
import { useState, useEffect } from 'react'

export function useTypewriter(text: string, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Reset when text changes or enabled becomes true
    if (!enabled) {
      setDisplayed('')
      setDone(false)
      return
    }

    setDisplayed('')
    setDone(false)

    let n = 0
    let timeoutId: NodeJS.Timeout | null = null
    let initialDelayId: NodeJS.Timeout | null = null

    const tick = () => {
      n++
      setDisplayed(text.slice(0, n))

      if (n < text.length) {
        // Random delay between 14-26ms for next character
        timeoutId = setTimeout(tick, 14 + Math.random() * 12)
      } else {
        // Typing complete
        setDone(true)
      }
    }

    // Initial 60ms delay before starting
    initialDelayId = setTimeout(tick, 60)

    // Cleanup function
    return () => {
      if (initialDelayId) clearTimeout(initialDelayId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [text, enabled])

  return { displayed, done }
}
