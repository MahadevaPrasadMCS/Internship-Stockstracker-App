import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// In-memory cache to prevent redundant requests
const cache = new Map()
const CACHE_TTL = 60 * 1000 // 1 minute

/**
 * Fetch current stock quote from backend (Alpha Vantage-powered)
 * Normalizes all data to a consistent frontend structure.
 */
export async function fetchQuote(symbol) {
  const cleanSymbol = symbol.toUpperCase().trim()

  // Return cached data if valid
  const cached = cache.get(cleanSymbol)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }

  try {
    const { data } = await axios.get(`${API_BASE}/quote?symbol=${cleanSymbol}`)

    if (!data || !data.close) {
      console.warn(`⚠️ No valid data returned for symbol: ${cleanSymbol}`)
      return { symbol: cleanSymbol, currentPrice: null }
    }

    // Normalize Alpha Vantage response to match UI expectations
    const normalized = {
      symbol: data.symbol || cleanSymbol,
      currentPrice: Number(data.close) || null,
      open: Number(data.open) || 0,
      high: Number(data.high) || 0,
      low: Number(data.low) || 0,
      previousClose: Number(data.previousClose || data.close) || 0,
      fetchedAt: data.fetchedAt || new Date().toISOString(),
      source: data.source || 'alphavantage',
    }

    // Cache result
    cache.set(cleanSymbol, { data: normalized, time: Date.now() })
    return normalized
  } catch (error) {
    console.warn(`⚠️ Failed to fetch quote for ${cleanSymbol}:`, error.message)

    return {
      symbol: cleanSymbol,
      currentPrice: null,
      open: 0,
      high: 0,
      low: 0,
      previousClose: 0,
      fetchedAt: new Date().toISOString(),
      source: 'fallback',
    }
  }
}
