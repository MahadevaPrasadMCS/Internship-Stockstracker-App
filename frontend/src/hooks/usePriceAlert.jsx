import { useEffect, useRef } from "react";

/**
 * usePriceAlerts – Enhanced Live Price Monitoring
 *
 * ✔ Detects price jumps above threshold%
 * ✔ Prevents spam using cooldown window
 * ✔ Skips first-load comparisons (avoids false alerts)
 * ✔ Works with delayed APIs (MarketStack)
 * ✔ Clean & readable architecture
 *
 * @param {object} pricesMap -  { AAPL: { currentPrice }, MSFT: { currentPrice }, ... }
 * @param {number} thresholdPct - % change required to trigger alert (e.g., 2 for ±2%)
 * @param {function} onNotify - callback({ symbol, oldPrice, newPrice, pct })
 * @param {number} cooldownMs - minimum delay between alerts per stock
 */
export default function usePriceAlerts(
  pricesMap = {},
  thresholdPct = 2,
  onNotify,
  cooldownMs = 10_000 // 10 seconds default
) {
  const prevPrices = useRef({});
  const lastAlert = useRef({}); // tracks last alert timestamp

  useEffect(() => {
    for (const symbol of Object.keys(pricesMap)) {
      const next = pricesMap[symbol]?.currentPrice ?? null;

      // Skip if invalid data
      if (!next || next <= 0) continue;

      const prev = prevPrices.current[symbol] ?? null;

      // First load → only store but don't alert
      if (prev === null) {
        prevPrices.current[symbol] = next;
        continue;
      }

      // Calculate percentage change
      const pct = ((next - prev) / prev) * 100;

      if (Math.abs(pct) >= thresholdPct) {
        const now = Date.now();

        // Prevent alert spam for this symbol
        if (!lastAlert.current[symbol] || now - lastAlert.current[symbol] >= cooldownMs) {
          lastAlert.current[symbol] = now;

          onNotify?.({
            symbol,
            oldPrice: prev,
            newPrice: next,
            pct: Number(pct.toFixed(2)),
          });
        }
      }

      // Update price snapshot
      prevPrices.current[symbol] = next;
    }
  }, [pricesMap, thresholdPct, onNotify, cooldownMs]);
}
