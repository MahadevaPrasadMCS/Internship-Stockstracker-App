import { useState, useEffect, useRef } from 'react'

/**
 * Persistent React state synchronized with localStorage.
 * - Syncs across tabs via 'storage' event.
 * - Prevents crashes if localStorage is full or unavailable.
 * - Uses JSON serialization internally.
 *
 * @param {string} key LocalStorage key
 * @param {*} initialValue Default state
 * @returns {[any, Function]} [state, setState]
 */
export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.warn(`⚠️ useLocalStorage: Error parsing key "${key}"`, err)
      return initialValue
    }
  })

  const mounted = useRef(true)

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!mounted.current) return
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (err) {
      console.warn(`⚠️ useLocalStorage: Failed to write key "${key}"`, err)
    }
  }, [key, state])

  // Sync state across browser tabs
  useEffect(() => {
    const handleStorage = event => {
      if (event.key === key && event.newValue !== event.oldValue) {
        try {
          setState(event.newValue ? JSON.parse(event.newValue) : initialValue)
        } catch (err) {
          console.warn(`⚠️ useLocalStorage: Failed sync for key "${key}"`, err)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      mounted.current = false
      window.removeEventListener('storage', handleStorage)
    }
  }, [key, initialValue])

  return [state, setState]
}
