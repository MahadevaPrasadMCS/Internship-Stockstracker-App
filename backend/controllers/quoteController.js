import { YahooFinance } from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const getQuote = async (req, res) => {
  try {
    let { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required." });
    }

    // Normalize symbol
    let clean = symbol.toUpperCase().trim();

    if (clean.endsWith(".BSE")) clean = clean.replace(".BSE", ".BO");
    if (clean.endsWith(".NSE")) clean = clean.replace(".NSE", ".NS");

    if (!clean.endsWith(".BO") && !clean.endsWith(".NS")) {
      clean += ".BO";
    }

    let quote;

    try {
      // NEW correct API call
      quote = await yahooFinance.quote(clean);
    } catch (err) {
      return res.status(404).json({
        message: "Yahoo Finance could not fetch data.",
        error: err.message,
      });
    }

    if (!quote?.regularMarketPrice) {
      return res.status(404).json({
        message: "No live price found for this symbol.",
        symbol: clean,
      });
    }

    res.json({
      symbol: clean,
      currentPrice: quote.regularMarketPrice ?? null,
      open: quote.regularMarketOpen ?? null,
      high: quote.regularMarketDayHigh ?? null,
      low: quote.regularMarketDayLow ?? null,
      previousClose: quote.regularMarketPreviousClose ?? null,
      volume: quote.regularMarketVolume ?? null,
      currency: quote.currency ?? "INR",
      fetchedAt: new Date().toISOString(),
      source: "yahoo-finance",
    });

  } catch (error) {
    console.error("Quote Error:", error);
    res.status(500).json({
      message: "Internal server error fetching quote.",
      error: error.message,
    });
  }
};
