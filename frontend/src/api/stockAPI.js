import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

/** Normalize number or return null */
const num = (v) => (typeof v === "number" && !isNaN(v) ? v : null);

/**
 * Fetch current stock quote from backend
 *  → Backend returns MarketStack EOD latest fields
 *  → Normalized into consistent price object
 */
export async function fetchQuote(symbol) {
  if (!symbol || typeof symbol !== "string") {
    console.warn("⚠️ Invalid symbol passed to fetchQuote:", symbol);
    return null;
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  /* ---------------------------
     Cache Check
  --------------------------- */
  const cached = cache.get(cleanSymbol);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  try {
    const { data } = await axios.get(`${API_BASE}/quote?symbol=${cleanSymbol}`);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid API response");
    }

    const close = num(data.close);
    const normalized = {
      symbol: cleanSymbol,
      currentPrice: close,
      open: num(data.open),
      high: num(data.high),
      low: num(data.low),
      previousClose: close,
      fetchedAt: data.fetchedAt || new Date().toISOString(),
      currency: data.currency || "USD",
      source: "marketstack",
    };

    cache.set(cleanSymbol, { data: normalized, time: Date.now() });

    return normalized;
  } catch (error) {
    console.warn(`⚠️ Quote fetch failed for ${cleanSymbol}:`, error.message);

    // Fallback to safe, empty structure
    return {
      symbol: cleanSymbol,
      currentPrice: null,
      open: null,
      high: null,
      low: null,
      previousClose: null,
      fetchedAt: new Date().toISOString(),
      currency: "USD",
      source: "fallback",
    };
  }
}
