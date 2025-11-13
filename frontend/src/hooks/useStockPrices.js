import { useState, useEffect, useMemo } from "react";
import { fetchQuote } from "../api/stockAPI";

/**
 * useStockPrices
 * Fetches latest stock prices (MarketStack-based) and returns:
 *  - prices: { AAPL: { currentPrice, open, high, low }, MSFT: {...} }
 *  - isLoading: boolean
 *  - lastUpdated: timestamp
 */
export default function useStockPrices(symbols = []) {
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🔹 Remove duplicates + invalid symbol values
  const cleanSymbols = useMemo(() => {
    return [...new Set(symbols.filter((s) => s && typeof s === "string"))];
  }, [symbols]);

  useEffect(() => {
    if (!cleanSymbols.length) return;

    let isMounted = true;

    async function loadPrices() {
      try {
        setIsLoading(true);

        // 🔸 Fetch latest MarketStack prices
        const results = await Promise.all(cleanSymbols.map(fetchQuote));

        const mapped = {};

        // 🔸 Normalize into dictionary format
        results.forEach((q) => {
          if (!q?.symbol) return;

          mapped[q.symbol] = {
            currentPrice: q.currentPrice ?? q.close ?? null,
            open: q.open ?? null,
            high: q.high ?? null,
            low: q.low ?? null,
          };
        });

        if (!isMounted) return;

        setPrices(mapped);
        setLastUpdated(Date.now());
      } catch (err) {
        console.error("Price fetch failed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPrices();

    return () => {
      isMounted = false;
    };
  }, [cleanSymbols]);

  return { prices, isLoading, lastUpdated };
}
