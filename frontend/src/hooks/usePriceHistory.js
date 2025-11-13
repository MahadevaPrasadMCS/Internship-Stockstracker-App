// src/hooks/usePriceHistory.js
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function usePriceHistory(symbol) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!symbol) {
      setHistory([])
      return
    }

    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await axios.get(`${API_BASE}/history/${encodeURIComponent(symbol)}`)
        if (!mounted) return
        setHistory(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('usePriceHistory load error', err.message)
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [symbol])

  return { history, loading, error }
}
