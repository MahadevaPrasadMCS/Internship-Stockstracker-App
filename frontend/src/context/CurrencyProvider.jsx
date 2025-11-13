// src/contexts/CurrencyProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const CurrencyContext = createContext(null);

/**
 * Lightweight internal exchange-rate fetcher.
 * (No external hook required)
 */
async function fetchUSDExchangeRates() {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD");
    const json = await res.json();
    return {
      rates: json?.rates || {},
      error: null,
    };
  } catch (err) {
    return {
      rates: {},
      error: err.message || "Failed to fetch currency rates",
    };
  }
}

/**
 * CurrencyProvider
 * - Handles USD → INR/EUR/GBP conversions
 * - Auto-refreshes every 6 hours
 * - No external hooks required
 */
export function CurrencyProvider({ children, base = "USD" }) {
  const [currency, setCurrency] = useState(base);
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Fetch rates function (internal)
  const loadRates = async () => {
    setIsLoading(true);
    const { rates, error } = await fetchUSDExchangeRates();

    if (!error) {
      setRates(rates);
      setLastUpdated(Date.now());
    } else {
      setError(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadRates(); // Initial fetch

    const interval = setInterval(loadRates, 1000 * 60 * 60 * 6);
    return () => clearInterval(interval);
  }, [base]);

  // Memoized context info
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      isLoading,
      lastUpdated,
      error,
    }),
    [currency, rates, isLoading, lastUpdated, error]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

/** Hook to access Currency data */
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
