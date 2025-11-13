import { useState, useEffect } from 'react'
import { fetchQuote } from '../api/stockAPI'

/**
 * Fetch prices ONLY once after login.
 * No intervals.
 */
export default function useStockPrices(symbols = []) {
  const [prices, setPrices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const shouldFetch = localStorage.getItem('shouldFetchPrices') === 'true'
    if (!shouldFetch || !symbols.length) return

    async function loadPrices() {
      try {
        setIsLoading(true)
        const results = await Promise.all(symbols.map(fetchQuote))
        setPrices(results)
        setLastUpdated(Date.now())
      } catch (err) {
        console.error('Price fetch failed:', err.message)
      } finally {
        setIsLoading(false)
        localStorage.setItem('shouldFetchPrices', 'false')
      }
    }

    loadPrices()
  }, [symbols])

  return { prices, isLoading, lastUpdated }
}
