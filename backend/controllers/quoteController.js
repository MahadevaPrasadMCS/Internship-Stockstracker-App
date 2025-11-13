import yahooFinance from "yahoo-finance2";

export const getQuote = async (req, res, next) => {
  try {
    let { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required." });
    }

    // Normalize input
    let clean = symbol.toUpperCase().trim();

    // Convert .BSE → .BO
    if (clean.endsWith(".BSE")) clean = clean.replace(".BSE", ".BO");

    // Convert .NSE → .NS
    if (clean.endsWith(".NSE")) clean = clean.replace(".NSE", ".NS");

    // Default exchange if none present -> assume BSE
    if (!clean.endsWith(".BO") && !clean.endsWith(".NS")) {
      clean += ".BO";
    }

    // Fetch quote
    const quote = await yahooFinance.quote(clean);

    if (!quote) {
      return res.status(404).json({ message: "No data found for symbol." });
    }

    res.json({
      symbol: clean,
      open: quote.regularMarketOpen ?? null,
      high: quote.regularMarketDayHigh ?? null,
      low: quote.regularMarketDayLow ?? null,
      currentPrice: quote.regularMarketPrice ?? null,
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
