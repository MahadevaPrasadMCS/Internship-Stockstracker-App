import yahooFinance from "yahoo-finance2";

export const getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required." });
    }

    // Fetch live quote
    const quote = await yahooFinance.quote(symbol);

    if (!quote) {
      return res.status(404).json({ message: "No data found for symbol." });
    }

    res.json({
      symbol: symbol.toUpperCase(),
      open: quote.regularMarketOpen ?? null,
      high: quote.regularMarketDayHigh ?? null,
      low: quote.regularMarketDayLow ?? null,
      close: quote.regularMarketPrice ?? null,
      previousClose: quote.regularMarketPreviousClose ?? null,
      volume: quote.regularMarketVolume ?? null,
      currency: quote.currency ?? "INR",
      fetchedAt: new Date().toISOString(),
      source: "yahoo-finance"
    });

  } catch (error) {
    console.error("Yahoo Finance Quote Error:", error);
    return res.status(500).json({
      message: "Failed to fetch live price",
      error: error.message
    });
  }
};
